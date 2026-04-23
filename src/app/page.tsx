"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");
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
        // Switch to dashboard view automatically when a file is uploaded
        setView("dashboard");
        setMessages(prev => [...prev, { role: "ai", content: `Successfully processed ${file.name}. Ask me any question!` }]);
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
        setMessages(prev => [...prev, { role: "ai", content: "Error: " + (data.error || "Unknown error") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Failed to connect to the AI service." }]);
    } finally {
      setIsAsking(false);
    }
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <div className="mb-8 p-4 bg-white rounded-3xl shadow-sm border border-slate-100 animate-slide-up">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
               <span className="text-white font-bold">C</span>
             </div>
             <span className="text-xl font-bold tracking-tighter">SabiBook <span className="text-primary italic">AI</span></span>
           </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] mb-6 max-w-4xl animate-slide-up [animation-delay:0.1s]">
          Learn smarter, <br />
          <span className="text-primary">not harder.</span>
        </h1>
        
        <p className="text-xl text-[#6b7280] max-w-2xl mb-12 animate-slide-up [animation-delay:0.2s] leading-relaxed">
           Transform your static lecture notes into an interactive learning experience with our AI-powered study assistant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up [animation-delay:0.3s]">
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
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isUploading ? "Starting up..." : "Upload Notes & Start"}
          </button>
          <button 
            onClick={() => setView("dashboard")}
            className="px-8 py-4 bg-white text-[#1a1a1a] border border-[#eef1f4] font-bold rounded-2xl hover:bg-slate-50 transition-all"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl animate-slide-up [animation-delay:0.4s]">
          {[
            { title: "Ask Questions", desc: "Interact with your notes just like chatting with a tutor." },
            { title: "Instant Summaries", desc: "Get the core concepts of lengthy PDFs in seconds." },
            { title: "Quiz Support", desc: "Generate practice questions to test your knowledge." }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-[#eef1f4] text-left hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-[#6b7280]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#eef1f4] flex flex-col p-6 space-y-8 animate-fade-in">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("landing")}>
          <div className="w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl font-serif italic">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SabiBook<span className="text-[#FF5A5F]">AI</span></span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-widest pl-3 mb-2">Main Tools</p>
          {[
            { label: "Dashboard", active: true, emoji: "📊" },
            { label: "Notifications", active: false, emoji: "🔔" },
            { label: "My Courses", active: false, emoji: "📚" },
            { label: "AI Assistant", active: false, emoji: "🤖" },
            { label: "Assignments", active: false, emoji: "✏️" },
            { label: "Certificates", active: false, emoji: "🏆" }
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${item.active ? 'bg-[#FFF0F0] text-[#FF5A5F]' : 'text-[#666666] hover:bg-slate-50'}`}>
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[14px] font-semibold">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
           <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-widest pl-3 mb-2">Settings</p>
           <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:bg-slate-50 cursor-pointer">
              <span>⚙️</span>
              <span className="text-[14px] font-semibold">Settings</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#eef1f4] flex items-center justify-between px-10 animate-fade-in">
          <div>
            <h2 className="text-[20px] font-bold">Dashboard</h2>
            <p className="text-[12px] text-[#888888]">Welcome back, Maxwell! Ready to level up?</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#eef1f4] rounded-full text-sm font-semibold hover:bg-slate-50 transition-all">
                <span>📹</span> Join Live Session
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A5F] text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-all">
                <span>⚡</span> Ask AI Tutor
             </button>
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-[#eef1f4]">
                <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200" alt="Avatar" width={40} height={40} />
             </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 animate-slide-up">
           {/* Top Stats Cards */}
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Courses Enrolled", value: "29", desc: "Closer to skill mastery!", emoji: "🧭" },
                { label: "Courses Completed", value: "372", desc: "you're on fire!", emoji: "✅" },
                { label: "Quizzes Taken", value: "192", desc: "Keep sharpening your skills!", emoji: "❓" }
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-white border border-[#eef1f4] rounded-[28px] shadow-sm flex flex-col">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-sm">{stat.emoji}</div>
                      <span className="text-[12px] font-semibold text-[#888888]">{stat.label}</span>
                   </div>
                   <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                   <span className="text-[11px] font-medium text-[#aaaaaa]">{stat.desc}</span>
                </div>
              ))}
           </div>

           {/* Second Row: Charts and Schedules */}
           <div className="grid grid-cols-2 gap-6">
              {/* AI Study Assistant Feature Box */}
              <div className="p-8 bg-white border border-[#eef1f4] rounded-[28px] flex flex-col h-[400px]">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-[14px] font-bold">AI Study Assistant</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         onChange={handleUpload} 
                         className="hidden" 
                         accept=".pdf"
                       />
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="text-[11px] font-bold text-[#FF5A5F] px-4 py-2 bg-[#FFF0F0] rounded-full hover:bg-[#FFD9D9] transition-all"
                       >
                         {isUploading ? "Uploading..." : "+ Upload New Notes"}
                       </button>
                    </div>
                 </div>

                 {/* Chat Messages */}
                 <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-style">
                   {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">🤖</div>
                         <p className="text-xs">Ask anything about your notes!</p>
                      </div>
                   ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`p-4 rounded-2xl text-[13px] max-w-[90%] ${
                            msg.role === "user" ? "bg-[#FF5A5F] text-white" : "bg-slate-50 border border-slate-100 text-slate-700"
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                   )}
                   {isAsking && <div className="text-[11px] text-[#FF5A5F] animate-pulse">AI is thinking...</div>}
                   <div ref={messagesEndRef} />
                 </div>

                 {/* Chat Input */}
                 <form onSubmit={askQuestion} className="relative">
                   <input 
                     type="text" 
                     value={question}
                     onChange={(e) => setQuestion(e.target.value)}
                     placeholder="Type your question..." 
                     className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-red-200 transition-all font-medium"
                   />
                   <button type="submit" className="absolute right-2 top-2 w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-all">
                      ➔
                   </button>
                 </form>
              </div>

              {/* Today's Schedule Card */}
              <div className="p-8 bg-white border border-[#eef1f4] rounded-[28px] flex flex-col">
                 <h3 className="text-[14px] font-bold mb-6">Today's Schedule</h3>
                 <div className="flex-1 flex flex-col gap-4">
                    {[
                      { time: "07:00 AM", task: "Neural Networks for Beginners", color: "#6366f1" },
                      { time: "09:00 AM", task: "Generative AI Learning Path", color: "#f59e0b" },
                      { time: "11:00 AM", task: "AI Ethics & Responsibilities", color: "#10b981" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <span className="text-[11px] font-bold text-[#aaaaaa] w-16">{item.time}</span>
                         <div className="flex-1 p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-[13px] font-bold">{item.task}</span>
                            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Recently Studied Results Table */}
           <div className="p-8 bg-white border border-[#eef1f4] rounded-[28px]">
              <h3 className="text-[14px] font-bold mb-6">Recently studied</h3>
              <div className="overflow-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[11px] font-bold text-[#aaaaaa] uppercase tracking-widest border-b border-slate-50">
                          <th className="pb-4 pl-2">Course Name</th>
                          <th className="pb-4">Start Time</th>
                          <th className="pb-4">End Time</th>
                          <th className="pb-4">Total Time</th>
                       </tr>
                    </thead>
                    <tbody className="text-[13px] font-semibold text-[#666666]">
                       {[
                         { name: "Machine Learning Basics", start: "09:30 AM", end: "10:45 AM", total: "01:38:55" },
                         { name: "Deep Learning Fundamentals", start: "07:00 PM", end: "07:45 PM", total: "01:38:55" },
                         { name: "Natural Language Processing", start: "01:40 PM", end: "02:10 PM", total: "01:38:55" }
                       ].map((course, i) => (
                         <tr key={i} className="hover:bg-slate-50 transition-all rounded-xl">
                            <td className="py-4 pl-2">{course.name}</td>
                            <td className="py-4">{course.start}</td>
                            <td className="py-4">{course.end}</td>
                            <td className="py-4">{course.total}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </main>

      <style jsx>{`
        .scrollbar-style::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-style::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .scrollbar-style::-webkit-scrollbar-thumb {
          background: #eef1f4;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
