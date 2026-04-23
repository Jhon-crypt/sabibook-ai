import { groq } from "@/lib/groq";
import { searchDocuments } from "@/lib/vectorStore";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    // Get relevant context from our "vector store"
    const context = searchDocuments(question);

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are SabiBook AI, a smart study assistant for Nigerian university students.
          
- Explain clearly and academically.
- Use simple language when appropriate.
- Give relatable examples (Nigerian context).
- If the answer isn't in the provided context, use your general knowledge but mention it's not from the notes.
- If unsure, say you don't know.

Context from lecture notes:
${context}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return Response.json({
      answer: response.choices[0]?.message?.content,
      foundContext: !!context
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
