import pdfParse from "pdf-parse";
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
    const data = await pdfParse(buffer);

    // Save to Supabase
    const { error: dbError } = await supabase
      .from("pdfs")
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          file_name: file.name,
          file_path: "temp/" + file.name, // In a real app, upload to storage first
          file_size: file.size,
          content_text: data.text,
        },
      ]);

    if (dbError) throw dbError;

    return Response.json({ 
      success: true, 
      pages: data.numpages,
      textPreview: data.text.substring(0, 100) + "..."
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
