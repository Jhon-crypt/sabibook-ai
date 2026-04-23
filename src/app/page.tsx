"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Bell, 
  BookOpen, 
  Bot, 
  ClipboardList, 
  Award, 
  Settings,
  Plus,
  Video,
  Zap,
  FileText,
  Clock,
  ChevronRight,
  Search,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

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
        setView("dashboard");
        setMessages(prev => [...prev, { role: "ai", content: `Successfully processed ${file.name}. What would you like to know?` }]);
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
      <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-red-100 animate-fade-in overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#eef1f4] px-6 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("landing")}>
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg font-serif italic">C</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">SabiBook<span className="text-primary">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#666666]">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#success" className="hover:text-primary transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView("dashboard")} className="text-sm font-bold text-[#666666] hover:text-primary transition-colors">Login</button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              Start Learning
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 container mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-primary text-[11px] font-bold uppercase tracking-widest mb-8 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Built for Nigerian University Students
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-slide-up [animation-delay:0.1s]">
            Turn your static notes into <br />
            <span className="text-primary italic">interactive intelligence.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mb-12 animate-slide-up [animation-delay:0.2s] leading-relaxed">
            Stop struggling with dense lecture materials. SabiBook AI processes your PDFs and lets you chat with your notes—summarizing, explaining, and testing your knowledge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-slide-up [animation-delay:0.3s]">
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept=".pdf" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-10 py-5 bg-primary text-white text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              {isUploading ? "Reading your notes..." : "Upload Notes & Ask AI"} 
              <FileText className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView("dashboard")}
              className="px-10 py-5 bg-white text-[#1a1a1a] border border-[#eef1f4] text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              Explore Dashboard <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Visual (Dashboard Preview Mock) */}
          <div className="relative w-full max-w-5xl rounded-[32px] border border-[#eef1f4] bg-white shadow-2xl overflow-hidden animate-slide-up [animation-delay:0.4s]">
             <div className="bg-slate-50/50 p-4 border-b border-[#eef1f4] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-xs text-slate-400 font-bold text-center pl-8">sabibook.ai/dashboard</div>
             </div>
             <div className="p-2 bg-[#f8f9fa]">
                <Image 
                  src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200" 
                  alt="Dashboard Preview" 
                  width={1200} 
                  height={600} 
                  className="rounded-2xl shadow-inner brightness-105"
                  unoptimized
                />
             </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-32 bg-white px-6">
           <div className="container mx-auto max-w-5xl text-center">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">The Problem</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">Why traditional studying feels like a chore.</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {[
                   { icon: <BookOpen className="w-8 h-8 text-primary" />, title: "Dense Materials", text: "Long PDFs and lecture slides are overwhelming to parse through before exams." },
                   { icon: <Clock className="w-8 h-8 text-primary" />, title: "Time Pressure", text: "Finding relative information in 100+ pages of notes takes hours." },
                   { icon: <HelpCircle className="w-8 h-8 text-primary" />, title: "Lack of Guidance", text: "Not everyone has access to a tutor to explain hard Nigerian university concepts." }
                 ].map((p, i) => (
                    <div key={i} className="group p-8 rounded-3xl border border-[#eef1f4] text-left hover:border-primary/20 transition-all">
                       <span className="mb-6 block">{p.icon}</span>
                       <h4 className="text-xl font-bold mb-3">{p.title}</h4>
                       <p className="text-[#6b7280] text-sm leading-relaxed">{p.text}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-32 bg-[#f8f9fa] px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-20">
               <div className="flex-1 text-left">
                  <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">How it works</h2>
                  <h3 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">It’s like ChatGPT, but trained on your own notes.</h3>
                  
                  <div className="space-y-12">
                     {[
                       { step: "01", title: "Upload Notes", desc: "Drag and drop your lecture PDFs or copy-paste text directly into the dashboard." },
                       { step: "02", title: "AI Ingestion", desc: "Our RAG system indexes the content, identifying key concepts and Nigerian specific context." },
                       { step: "03", title: "Chat & Learn", desc: "Start asking questions! SabiBook AI answers using only the material you provided." }
                     ].map((s, i) => (
                        <div key={i} className="flex gap-6 font-sans">
                           <div className="text-2xl font-black text-primary/30 pt-1 tracking-tighter">{s.step}</div>
                           <div>
                              <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                              <p className="text-[#6b7280] text-sm leading-relaxed">{s.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex-1 w-full flex justify-center">
                  <div className="relative w-full aspect-square bg-primary rounded-[48px] overflow-hidden rotate-3 shadow-2xl flex items-center justify-center p-12">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                     <div className="bg-white p-10 rounded-[32px] shadow-xl w-full -rotate-3 animate-pulse">
                        <div className="h-2 w-20 bg-slate-100 rounded-full mb-4" />
                        <div className="h-4 w-full bg-slate-50 rounded-full mb-2" />
                        <div className="h-4 w-2/3 bg-slate-50 rounded-full" />
                        <div className="mt-10 h-10 w-full bg-primary/10 rounded-xl flex items-center justify-center">
                           <Bot className="w-5 h-5 text-primary" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Sidebar Loop Swap below */}
        {/* Skipping similar updates for brevity, focus on Sidebar */}

        {/* Features Split */}
        <section id="features" className="py-32 bg-white px-6">
           <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <div className="p-12 rounded-[48px] bg-slate-900 text-white flex flex-col justify-between aspect-square group overflow-hidden relative">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                    <div>
                       <span className="text-5xl mb-6 block">⚡</span>
                       <h3 className="text-4xl font-bold mb-6 italic leading-tight">Instant Summaries <br />at your fingertips.</h3>
                       <p className="text-slate-400 text-lg leading-relaxed">Turn a 40-page PDF into a 5-bullet point summary in under 2 seconds. Perfect for last-minute revisions.</p>
                    </div>
                    <div className="mt-8 flex gap-2">
                       <div className="h-1.5 w-12 bg-primary rounded-full" />
                       <div className="h-1.5 w-4 bg-slate-800 rounded-full" />
                       <div className="h-1.5 w-4 bg-slate-800 rounded-full" />
                    </div>
                 </div>

                 <div className="p-12 rounded-[48px] bg-[#FFF0F0] border border-red-50 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-white transition-all duration-500">
                    <div>
                       <span className="text-5xl mb-6 block">🇳🇬</span>
                       <h3 className="text-4xl font-bold mb-6 italic leading-tight text-[#1a1a1a]">Simplified <br />Explaining.</h3>
                       <p className="text-slate-600 text-lg leading-relaxed">Hard concepts explained in simple Nigerian academic context. No robotic jargon—just pure 'Sabi'.</p>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm self-start">
                       <span className="text-primary font-bold">Ask:</span>
                       <span className="text-sm font-semibold">"Explain this like I de 100 Level"</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Call to Action */}
        <section className="py-40 bg-white px-6 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
           <div className="container mx-auto max-w-4xl text-center relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10 leading-[1.1]">Ready to boost <br />your GP?</h2>
              <p className="text-xl text-[#6b7280] mb-12 max-w-xl mx-auto">Join thousands of Nigerian students already using SabiBook AI to master their courses.</p>
              <button 
                onClick={() => setView("dashboard")}
                className="px-16 py-6 bg-[#1a1a1a] text-white text-xl font-bold rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Launch App Free
              </button>
           </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-white border-t border-[#eef1f4] px-6">
           <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="max-w-xs">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                       <span className="text-white font-bold italic">C</span>
                    </div>
                    <span className="text-xl font-bold tracking-tighter">SabiBook<span className="text-primary">AI</span></span>
                 </div>
                 <p className="text-sm text-[#6b7280] leading-relaxed">Empowering Nigerian university students with AI-first study intelligence.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
                 <div>
                    <h5 className="font-bold mb-6 text-sm">Product</h5>
                    <ul className="text-sm text-[#666666] space-y-4">
                       <li>Dashboard</li>
                       <li>AI Chat</li>
                       <li>Privacy</li>
                    </ul>
                 </div>
                 <div>
                    <h5 className="font-bold mb-6 text-sm">Legal</h5>
                    <ul className="text-sm text-[#666666] space-y-4">
                       <li>Terms</li>
                       <li>Academic Policy</li>
                    </ul>
                 </div>
              </div>
           </div>
           <div className="container mx-auto max-w-6xl mt-20 pt-8 border-t border-slate-50 flex justify-between text-[11px] font-bold text-[#aaaaaa] uppercase tracking-widest">
              <p>© 2026 SabiBook AI. ALL RIGHTS RESERVED.</p>
              <p>Made with ❤️ for Nigeria</p>
           </div>
        </footer>
      </div>
    );
  }

  // DASHBOARD VIEW (KEEPING THE SAME AS BEFORE)
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
            { label: "Dashboard", active: true, icon: <LayoutDashboard className="w-5 h-5" /> },
            { label: "Notifications", active: false, icon: <Bell className="w-5 h-5" /> },
            { label: "My Courses", active: false, icon: <BookOpen className="w-5 h-5" /> },
            { label: "AI Assistant", active: false, icon: <Bot className="w-5 h-5" /> },
            { label: "Assignments", active: false, icon: <ClipboardList className="w-5 h-5" /> },
            { label: "Certificates", active: false, icon: <Award className="w-5 h-5" /> }
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${item.active ? 'bg-[#FFF0F0] text-[#FF5A5F]' : 'text-[#666666] hover:bg-slate-50'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[14px] font-semibold">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
           <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-widest pl-3 mb-2">Settings</p>
           <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:bg-slate-50 cursor-pointer">
              <Settings className="w-5 h-5" />
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
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#eef1f4] rounded-full text-sm font-semibold hover:bg-slate-50 transition-all font-sans">
                <Video className="w-4 h-4 text-primary" /> Join Live Session
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A5F] text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-all font-sans">
                <Zap className="w-4 h-4" /> Ask AI Tutor
             </button>
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-[#eef1f4] relative">
                <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200" alt="Avatar" fill className="object-cover" unoptimized />
             </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 animate-slide-up">
           {/* Top Stats Cards */}
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Courses Enrolled", value: "29", desc: "Closer to skill mastery!", icon: <BookOpen className="w-4 h-4" /> },
                { label: "Courses Completed", value: "372", desc: "you're on fire!", icon: <CheckCircle2 className="w-4 h-4" /> },
                { label: "Quizzes Taken", value: "192", desc: "Keep sharpening your skills!", icon: <HelpCircle className="w-4 h-4" /> }
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-white border border-[#eef1f4] rounded-[28px] shadow-sm flex flex-col">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-sm">{stat.icon}</div>
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
              <div className="p-8 bg-white border border-[#eef1f4] rounded-[28px] flex flex-col h-[450px]">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold">AI Study Assistant</span>
                    <div className="flex items-center gap-2">
                       <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept=".pdf" />
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="text-[11px] font-bold text-[#FF5A5F] px-4 py-2 bg-[#FFF0F0] rounded-full hover:bg-[#FFD9D9] transition-all flex items-center gap-1.5"
                       >
                         <Plus className="w-3 h-3" />
                         {isUploading ? "Uploading..." : "Upload Notes"}
                       </button>
                    </div>
                 </div>

                 {/* Feature Buttons */}
                 <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { id: "summary", label: "Summarize", icon: <Zap className="w-3 h-3" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
                      { id: "quiz", label: "Generate Quiz", icon: <ClipboardList className="w-3 h-3" />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                      { id: "simple", label: "Explain Simply", icon: <Bot className="w-3 h-3" />, color: "bg-teal-50 text-teal-600 border-teal-100" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          if (btn.id === "summary") setQuestion("Can you summarize my uploaded notes into key bullet points?");
                          if (btn.id === "quiz") setQuestion("Generate 5 practice exam questions from these notes with suggested answers.");
                          if (btn.id === "simple") setQuestion("Explain the main concepts of these notes like I'm 5 years old, using simple Nigerian context.");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap transition-all hover:scale-105 active:scale-95 ${btn.color}`}
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                 </div>

                 {/* Chat Messages */}
                 <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-style">
                   {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                            <Bot className="w-6 h-6" />
                         </div>
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
                   {isAsking && (
                     <div className="flex items-center gap-2 text-[11px] text-[#FF5A5F] font-bold">
                        <Zap className="w-3 h-3 animate-pulse" /> AI is thinking...
                     </div>
                   )}
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
                      <Zap className="w-5 h-5 fill-current" />
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
