// @ts-ignore
import pdfParse from "pdf-parse";
import { addDocument } from "@/lib/vectorStore";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);

    // Split text into chunks if it's very large, but for now just add the whole thing
    addDocument(data.text);

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
