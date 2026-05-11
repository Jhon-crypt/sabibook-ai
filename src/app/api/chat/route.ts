import { groq } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    // Get the latest PDF contents from the database as context
    const { data: pdfData } = await supabase
      .from("pdfs")
      .select("content_text")
      .order("created_at", { ascending: false })
      .limit(3);

    const context = pdfData?.map(p => p.content_text).join("\n\n---\n\n") || "No lecture notes uploaded yet.";

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `You are SabiBook AI, a smart study assistant for Nigerian university students.
          
- MISSION: Help students understand their lecture notes through clear, academic, and culturally relevant explanations.
- CONTEXT: Use the provided lecture notes summary to answer. If the answer isn't there, rely on your knowledge but prioritize the notes.
- NIGERIAN CONTEXT: Use relatable metaphors and clear Nigerian academic English. 
- TONE: Encouraging, professional, and slightly informal ("Sabi" tone).

Context from lecture notes:
${context}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "study_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              foundContext: { type: "boolean" },
              suggestedQuestions: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["answer", "foundContext", "suggestedQuestions"],
            additionalProperties: false
          }
        }
      },
      temperature: 0.7,
      max_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");

    return Response.json(result);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
