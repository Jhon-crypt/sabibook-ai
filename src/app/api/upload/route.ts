const pdfParse = require("pdf-parse/lib/pdf-parse.js");
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Create an authenticated client that respects RLS
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const courseId = formData.get("courseId") as string;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Parse PDF text with a custom options to avoid ENOENT test file error
    const data = await pdfParse(buffer, {
      pagerender: (pageData: any) => {
        return pageData.getTextContent()
          .then((textContent: any) => {
            let lastY, text = '';
            for (let item of textContent.items) {
              if (lastY == item.transform[5] || !lastY) {
                text += item.str;
              } else {
                text += '\n' + item.str;
              }
              lastY = item.transform[5];
            }
            return text;
          });
      }
    });

    // 2. Upload to Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from("handouts")
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error("Storage Error:", storageError);
      // Fallback: If bucket doesn't exist, we might get an error. 
      // But we'll still proceed with the DB record if the user hasn't set up the bucket yet, 
      // though ideally they should.
    }

    // 3. Save to Database
    const { error: dbError } = await supabase
      .from("pdfs")
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          file_name: file.name,
          file_path: storageData?.path || "pending/" + file.name,
          file_size: file.size,
          content_text: data.text,
        },
      ]);

    if (dbError) throw dbError;

    // 4. Generate Extensive AI Curriculum (Modules)
    try {
      const curriculumPrompt = `You are a world-class academic tutor and curriculum designer. 
      Your task is to transform the following PDF text into an EXTENSIVE, high-quality interactive course.
      
      CRITICAL INSTRUCTIONS:
      1. Break the content into 3-5 detailed learning modules.
      2. For each module, provide a concise but rich explanation (around 200-300 words of educational content).
      3. Use a professional, academic yet accessible tone.
      4. For each module, generate exactly 3 high-quality multiple-choice questions.
      5. Each question must have 4 options and 1 correct answer.
      
      TEXT CONTENT FROM PDF:
      ${data.text.substring(0, 6000)}
      
      Output ONLY a JSON object with this exact structure:
      {
        "modules": [
          {
            "title": "Module Title",
            "content": "Detailed educational content...",
            "quiz_questions": [
              {
                "question": "Question text",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": 0
              }
            ]
          }
        ]
      }`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional academic curriculum generator. You output extremely detailed educational content in strict JSON format."
          },
          { role: "user", content: curriculumPrompt }
        ],
        model: "openai/gpt-oss-120b",
        response_format: { type: "json_object" },
        max_tokens: 2500, // Reduced to fit within 8000 TPM limit
      });

      const curriculum = JSON.parse(completion.choices[0].message.content || '{"modules": []}');

      if (curriculum.modules && curriculum.modules.length > 0) {
        const modulesToInsert = curriculum.modules.map((mod: any, index: number) => ({
          course_id: courseId,
          user_id: userId,
          title: mod.title,
          content: mod.content,
          order_index: index,
          quiz_questions: mod.quiz_questions || mod.questions || [],
        }));

        await supabase.from("course_modules").insert(modulesToInsert);
      }
    } catch (aiError) {
      console.error("AI Curriculum Generation Error:", aiError);
    }

    return Response.json({
      success: true,
      pages: data.numpages,
      filePath: storageData?.path,
      textPreview: data.text.substring(0, 100) + "..."
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
