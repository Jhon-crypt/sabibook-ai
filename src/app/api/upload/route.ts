const pdfParse = require("pdf-parse/lib/pdf-parse.js");
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
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
              if (lastY == item.transform[5] || !lastY){
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
