// SIMPLE IN-MEMORY STORE
// Note: This will reset when the server restarts or if running in a serverless environment.
let documents: string[] = [];

export function addDocument(text: string) {
  documents.push(text);
  console.log(`Added document. Total docs: ${documents.length}`);
}

export function searchDocuments(query: string) {
  // VERY SIMPLE: return first few docs
  // In a real app, you'd use embeddings and cosine similarity here
  return documents.slice(-5).join("\n\n---\n\n");
}

export function clearDocuments() {
  documents = [];
}
