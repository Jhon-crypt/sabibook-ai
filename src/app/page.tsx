"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  Bot, 
  FileText,
  Clock,
  ChevronRight,
  HelpCircle
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-red-100 animate-fade-in overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#eef1f4] px-6 lg:px-20 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg font-serif italic">C</span>
          </div>
          <span className="text-xl font-bold tracking-tighter">SabiBook<span className="text-primary">AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#666666]">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#success" className="hover:text-primary transition-colors">Success Stories</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#666666] hover:text-primary transition-colors">Login</Link>
          <Link 
            href="/signup"
            className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Start Learning
          </Link>
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
          <Link 
            href="/signup"
            className="px-10 py-5 bg-primary text-white text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            Get Started for Free
          </Link>
          <Link 
            href="/login"
            className="px-10 py-5 bg-white text-[#1a1a1a] border border-[#eef1f4] text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3"
          >
            Login <ChevronRight className="w-5 h-5" />
          </Link>
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
            <Link 
              href="/signup"
              className="px-16 py-6 bg-[#1a1a1a] text-white text-xl font-bold rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block"
            >
              Launch App Free
            </Link>
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
                     <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
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
