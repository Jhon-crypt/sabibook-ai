"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedFiles(prev => [...prev, file.name]);
        setMessages(prev => [...prev, { role: "ai", content: `Successfully processed ${file.name}. You can now ask questions about it!` }]);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const askQuestion = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || isAsking) return;

    const currentQuestion = question;
    setQuestion("");
    setMessages(prev => [...prev, { role: "user", content: currentQuestion }]);
    setIsAsking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages(prev => [...prev, { role: "ai", content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error: " + (data.error || "Unknown error") }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", content: "Failed to connect to the AI service." }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-black text-white selection:bg-teal-500/30 font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="SabiBook AI Background"
          fill
          className="object-cover opacity-40 scale-105 animate-pulse-slow"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <span className="text-xl font-bold">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">SabiBook <span className="text-teal-400 font-extrabold italic">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept=".pdf"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            ) : null}
            {isUploading ? "Processing..." : "Upload Notes (PDF)"}
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button className="px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-teal-400 transition-all duration-300">
            Login
          </button>
        </div>
      </nav>

      {/* Main Interface */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-10 flex flex-col lg:flex-row gap-8 h-[calc(100vh-80px)]">
        
        {/* Left Side: Hero Info & Stats */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 animate-fade-in-up w-fit">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Study Assistant Active</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight">
            Learn Smarter. <br />
            <span className="text-teal-400 italic">Sabi Harder.</span>
          </h1>
          
          <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
            Upload your lecture notes, PDFs, and hand-outs. SabiBook AI analyzes them to answer any question, generate summaries, and prepare you for exams.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Knowledge Base</p>
              <p className="text-xl font-bold text-teal-400">{uploadedFiles.length} Documents</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">LLM Model</p>
              <p className="text-xl font-bold text-purple-400">Llama3-70B</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
              <span className="text-teal-400 font-bold">!</span>
            </div>
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">Tip:</span> Ask me to "Summarize the key points of Chapter 3" after uploading.
            </p>
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-2xl relative">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-sm">Waitin' for your first question...</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-teal-500 text-black font-medium" 
                      : "bg-white/10 text-gray-200 border border-white/5"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isAsking && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-4 rounded-2xl flex gap-1">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={askQuestion} className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-3xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={uploadedFiles.length > 0 ? "Ask anything about your notes..." : "Upload a PDF then ask me anything..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-gray-600"
              />
              <button 
                type="submit"
                disabled={!question.trim() || isAsking}
                className="absolute right-2 p-3 bg-teal-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <p className="mt-2 text-[10px] text-center text-gray-600 uppercase tracking-widest font-bold">Powered by Llama3 on Groq</p>
          </form>
        </div>
      </div>
    </main>
  );
}
