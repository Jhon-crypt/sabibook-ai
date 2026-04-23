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
          
- MISSION: Help students understand their lecture notes through clear, academic, and culturally relevant explanations.
- CONTEXT: Use the provided lecture notes summary to answer. If the answer isn't there, rely on your knowledge but prioritize the notes.
- NIGERIAN CONTEXT: Use relatable metaphors and clear Nigerian academic English. 
- MODES:
    * SUMMARIES: Provide bold headers, bullet points, and a "TL;DR" at the end.
    * QUIZZES: Generate high-quality practice questions (Multiple Choice or Theory) based on actual exam patterns in Nigerian universities.
    * SIMPLE EXPLAIN: (ELIFE/Explain Like I'm Five) Use zero jargon, simple language, and relatable analogies.
- TONE: Encouraging, professional, and slightly informal ("Sabi" tone).

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
