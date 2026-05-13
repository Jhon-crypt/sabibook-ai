"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  BookOpen, 
  Bot, 
  FileText,
  Clock,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  MessageSquare,
  Rocket,
  Award,
  Globe,
  ArrowRight,
  BarChart3,
  User,
  GraduationCap
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if we just landed here from a verification link (Supabase adds hash params)
    const handleAuthRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's a hash with access_token, this is a fresh verification
      if (window.location.hash.includes("access_token")) {
        router.push("/verified");
      } 
      // Otherwise, if they are just logged in normally, go to dashboard
      else if (session) {
        router.push("/dashboard");
      }
    };

    handleAuthRedirect();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (window.location.hash.includes("access_token")) {
          router.push("/verified");
        } else {
          router.push("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-red-100 animate-fade-in overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#eef1f4] px-6 lg:px-20 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter">SabiBook<span className="text-primary">AI</span></span>
        </Link>
        <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold text-[#666666] uppercase tracking-wider">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#666666] hover:text-primary transition-colors hidden sm:block">Login</Link>
          <Link 
            href="/signup"
            className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 container mx-auto text-center flex flex-col items-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#eef1f4] shadow-sm text-[#666666] text-[11px] font-bold uppercase tracking-widest mb-8 animate-slide-up">
           <span className="bg-primary text-white px-2 py-0.5 rounded text-[9px]">NEW</span>
           AI-Powered Revision Tools for 2026
        </div>
        
        <h1 className="text-6xl md:text-[100px] font-black tracking-tight mb-8 leading-[0.9] animate-slide-up [animation-delay:0.1s]">
          Master your <br />
          <span className="text-primary italic relative">
             Curriculum.
             <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/10 -rotate-1 -z-10" />
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mb-12 animate-slide-up [animation-delay:0.2s] leading-relaxed font-medium">
          SabiBook AI turns your heavy lecture PDFs into a smart personal tutor. Chat with your notes, get instant summaries, and ace your exams with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-24 animate-slide-up [animation-delay:0.3s]">
          <Link 
            href="/signup"
            className="px-12 py-5 bg-[#1a1a1a] text-white text-lg font-bold rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            Start Learning Free
          </Link>
          <Link 
            href="#how-it-works"
            className="px-12 py-5 bg-white text-[#1a1a1a] border border-[#eef1f4] text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3"
          >
            See how it works
          </Link>
        </div>

        {/* Hero Visual */}
        <div className="relative w-full max-w-6xl rounded-[40px] border border-[#eef1f4] bg-white p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden animate-slide-up [animation-delay:0.4s]">
           <div className="rounded-[32px] overflow-hidden bg-slate-50 relative aspect-[16/9] md:aspect-auto">
              <Image 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1400" 
                alt="Dashboard Preview" 
                width={1400} 
                height={800} 
                className="w-full h-full object-cover brightness-[1.02]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating UI Elements */}
              <div className="absolute top-10 left-10 p-5 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 max-w-[200px] text-left hidden md:block animate-float">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Analysis Complete</span>
                 </div>
                 <p className="text-[12px] font-bold text-[#1a1a1a]">"GST 101 Summary generated. 12 key points identified."</p>
              </div>

              <div className="absolute bottom-10 right-10 p-5 bg-primary rounded-2xl shadow-xl text-white max-w-[220px] text-left hidden md:block animate-float [animation-delay:1s]">
                 <Bot className="w-6 h-6 mb-3" />
                 <p className="text-[13px] font-bold leading-tight">"Ask me anything about the laws of thermodynamics in simple terms."</p>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-[#eef1f4] bg-white">
         <div className="container mx-auto px-6 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-10">Trusted by students across</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 font-serif italic font-bold text-xl">
               <span>UNILAG</span>
               <span>LASU</span>
               <span>UI</span>
               <span>OAU</span>
               <span>LASUSTECH</span>
               <span>ABU</span>
            </div>
         </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 bg-white px-6">
         <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">The Old Way</h2>
                  <h3 className="text-5xl md:text-6xl font-bold mb-10 tracking-tight leading-[1.1]">Traditional studying is broken.</h3>
                  <p className="text-lg text-[#6b7280] mb-12 leading-relaxed">
                     Nigerian lecture notes are often dense, outdated, and overwhelming. Spending hours highlighting paper and rewriting notes is a waste of your brainpower.
                  </p>
                  <div className="space-y-6">
                     {[
                        { title: "Manual Parsing", desc: "Hours spent reading just to find one definition." },
                        { title: "No Interaction", desc: "Notes can't talk back or explain themselves." },
                        { title: "Static Content", desc: "Hard to test your knowledge without someone to quiz you." }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-1">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                           </div>
                           <div>
                              <h4 className="font-bold text-[#1a1a1a]">{item.title}</h4>
                              <p className="text-sm text-[#6b7280]">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                     <div className="aspect-[4/5] bg-slate-50 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group">
                        <BookOpen className="w-10 h-10 text-slate-300 absolute top-8 left-8" />
                        <h5 className="font-bold text-lg leading-tight">100+ Page <br />Handouts</h5>
                     </div>
                     <div className="aspect-square bg-[#FFF0F0] rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden">
                        <Clock className="w-10 h-10 text-primary/30 absolute top-8 left-8" />
                        <h5 className="font-bold text-lg leading-tight">Midnight <br />Cramming</h5>
                     </div>
                  </div>
                  <div className="space-y-6 pt-12">
                     <div className="aspect-square bg-slate-900 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden text-white">
                        <Bot className="w-10 h-10 text-white/20 absolute top-8 left-8" />
                        <h5 className="font-bold text-lg leading-tight">Zero <br />AI Help</h5>
                     </div>
                     <div className="aspect-[4/5] bg-slate-50 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden">
                        <HelpCircle className="w-10 h-10 text-slate-300 absolute top-8 left-8" />
                        <h5 className="font-bold text-lg leading-tight">Unanswered <br />Questions</h5>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* How it Works - Split Scroll Experience */}
      <section id="how-it-works" className="py-32 bg-[#1a1a1a] text-white px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1">
                <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">The Process</h2>
                <h3 className="text-5xl md:text-6xl font-bold mb-12 tracking-tight leading-[1.1]">Three steps to <br /><span className="text-primary italic">academic freedom.</span></h3>
                
                <div className="space-y-16">
                   {[
                     { step: "01", title: "Upload your Materials", desc: "Drag and drop your lecture PDFs, slides, or even photos of your handwritten notes." },
                     { step: "02", title: "AI Brain Mapping", desc: "Our neural engine scans and understands the core concepts, terminologies, and context of your material." },
                     { step: "03", title: "Chat with your Notes", desc: "Ask 'Explain this in simple terms' or 'Generate a 10-question quiz'. Your notes are now interactive." }
                   ].map((s, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="text-5xl font-black text-white/5 pt-1 group-hover:text-primary/20 transition-colors duration-500">{s.step}</div>
                         <div>
                            <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
                            <p className="text-slate-400 text-lg leading-relaxed">{s.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px]" />
                <div className="relative bg-slate-800/50 backdrop-blur-2xl border border-white/10 rounded-[48px] p-10 shadow-2xl">
                   <div className="space-y-6">
                      <div className="flex gap-4 items-start">
                         <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-slate-400" />
                         </div>
                         <div className="bg-slate-700/50 p-4 rounded-2xl text-[14px] font-medium leading-relaxed max-w-[80%]">
                            "Can you explain the difference between Micro and Macro economics using examples from the Nigerian market?"
                         </div>
                      </div>
                      <div className="flex gap-4 items-start flex-row-reverse">
                         <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <Bot className="w-5 h-5 text-white" />
                         </div>
                         <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl text-[14px] font-medium leading-relaxed max-w-[80%]">
                            "Think of Micro as your personal savings (pata-pata), while Macro is the entire Nigerian economy (Naira devaluation, CBN policies). In your notes, the lecturer highlights that..."
                         </div>
                      </div>
                      <div className="pt-10 flex justify-center">
                         <div className="animate-pulse flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Thinking...</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-32 bg-white px-6">
         <div className="container mx-auto max-w-6xl text-center mb-24">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">Features</h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tight">Everything you need <br />to graduate with honors.</h3>
         </div>
         
         <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { icon: <Zap className="w-8 h-8 text-amber-500" />, title: "AI Curriculum", desc: "Instantly turn any PDF into a structured course with clear, digestible learning modules." },
               { icon: <CheckCircle2 className="w-8 h-8 text-green-500" />, title: "Module Quizzes", desc: "Master every topic with automated quizzes that test your understanding of every module." },
               { icon: <BarChart3 className="w-8 h-8 text-blue-500" />, title: "Mastery Tracking", desc: "Visualize your academic progress with a real-time mastery percentage for every course." },
               { icon: <Clock className="w-8 h-8 text-teal-500" />, title: "Smart Resume", desc: "Never lose your place. We remember exactly where you stopped so you can pick up instantly." },
               { icon: <Award className="w-8 h-8 text-indigo-500" />, title: "Achievements", desc: "Stay motivated with instant notifications celebrating your module and course completions." },
               { icon: <Bot className="w-8 h-8 text-primary" />, title: "Personal AI Tutor", desc: "A constant learning companion that guides you through your curriculum 24/7." }
            ].map((f, i) => (
               <div key={i} className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all group duration-500">
                  <div className="mb-8 w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                     {f.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{f.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
               </div>
            ))}
         </div>
      </section>





      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white px-6">
         <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-24">
               <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">FAQ</h2>
               <h3 className="text-5xl font-bold tracking-tight">Common questions.</h3>
            </div>
            
            <div className="space-y-6">
               {[
                  { q: "Is SabiBook AI legal to use in my university?", a: "Absolutely! We are a study aid designed to help you understand your own materials. We encourage academic integrity and do not support plagiarism." },
                  { q: "What types of files can I upload?", a: "Currently, we support PDF files, but we are working on adding support for .doc, .ppt, and even handwritten image uploads." },
                  { q: "How accurate is the AI?", a: "SabiBook AI uses state-of-the-art RAG technology, meaning it only answers based on the text you provide. This significantly reduces hallucinations and ensures high accuracy." },
                  { q: "Can I use it for professional exams (ICAN, etc.)?", a: "Yes! Many students use SabiBook for professional certification materials to help them summarize dense legal or accounting texts." }
               ].map((faq, i) => (
                  <div key={i} className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group cursor-pointer">
                     <div className="flex items-center justify-between gap-4">
                        <h4 className="text-lg font-bold text-[#1a1a1a]">{faq.q}</h4>
                        <PlusIcon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                     </div>
                     <p className="mt-4 text-[#666666] leading-relaxed text-[15px] hidden group-hover:block animate-fade-in">{faq.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <section className="py-40 bg-white px-6 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
         <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">Stop reading. <br /><span className="text-primary italic">Start sabing.</span></h2>
            <p className="text-xl text-[#6b7280] mb-12 max-w-xl mx-auto font-medium">Join 5,000+ students from UNILAG, LASU, and OAU who are already crushing their grades.</p>
            <Link 
              href="/signup"
              className="px-16 py-7 bg-[#1a1a1a] text-white text-2xl font-black rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.05] active:scale-95 transition-all inline-flex items-center gap-4 group"
            >
              Get Started Now
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
         </div>
      </section>

      {/* Developer Hero Section */}
      <section className="py-32 bg-[#1a1a1a] text-white px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -z-0" />
         
         <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="animate-slide-up">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-8">
                     <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Student Innovation Project</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                     Built for students, <br />
                     <span className="text-primary italic">by a student.</span>
                  </h2>
                  <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl">
                     SabiBook AI was designed and developed by <span className="text-white font-bold">Ninola Oladele</span>, a Computer Science student at LASUSTECH, with a vision to revolutionize how Nigerian students interact with their study materials.
                  </p>
                  
                  <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center gap-6 group">
                     <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                        <User className="w-10 h-10 text-primary" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black tracking-tight mb-1">Ninola Oladele</h4>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                           <GraduationCap className="w-4 h-4 text-primary" />
                           LASUSTECH Computer Science
                        </div>
                     </div>
                  </div>
               </div>

               <div className="animate-slide-up [animation-delay:0.2s]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-10">The Technology Stack</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                        { name: "Next.js 14", detail: "The modern framework for powerful web apps.", icon: <Zap className="w-5 h-5" /> },
                        { name: "Supabase", detail: "Real-time database and secure authentication.", icon: <ShieldCheck className="w-5 h-5" /> },
                        { name: "Gemini AI", detail: "Advanced neural intelligence for curriculum analysis.", icon: <Sparkles className="w-5 h-5" /> },
                        { name: "Tailwind CSS", detail: "Responsive, high-fidelity design system.", icon: <Bot className="w-5 h-5" /> }
                     ].map((tech, i) => (
                        <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary">
                              {tech.icon}
                           </div>
                           <h4 className="text-lg font-black mb-2">{tech.name}</h4>
                           <p className="text-sm text-slate-500 leading-relaxed font-medium">{tech.detail}</p>
                        </div>
                     ))}
                  </div>
                  <div className="mt-12 flex items-center gap-4 text-slate-600 font-black text-[10px] uppercase tracking-[0.5em]">
                     <div className="h-[1px] flex-1 bg-white/10" />
                     100% Open Academic Innovation
                     <div className="h-[1px] flex-1 bg-white/10" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-32 bg-white border-t border-[#eef1f4] px-6">
         <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-20">
               <div className="col-span-1 lg:col-span-2">
                  <Link href="/" className="flex items-center gap-2 mb-8">
                     <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <BookOpen className="text-white w-6 h-6" />
                     </div>
                     <span className="text-2xl font-black tracking-tighter">SabiBook<span className="text-primary">AI</span></span>
                  </Link>
                  <p className="text-lg text-[#6b7280] leading-relaxed max-w-md mb-8">
                     The future of Nigerian education is AI-first. We're building tools to help every student reach their full potential.
                  </p>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                        <Globe className="w-5 h-5" />
                     </div>
                     <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                  </div>
               </div>
               
               <div>
                  <h5 className="font-black text-sm uppercase tracking-widest mb-10 text-slate-300">Product</h5>
                  <ul className="space-y-6 text-[15px] font-bold text-[#666666]">
                     <li><Link href="/dashboard" className="hover:text-primary transition-colors">Student Dashboard</Link></li>
                     <li><Link href="#features" className="hover:text-primary transition-colors">AI Features</Link></li>
                  </ul>
               </div>

               <div>
                  <h5 className="font-black text-sm uppercase tracking-widest mb-10 text-slate-300">Legal</h5>
                  <ul className="space-y-6 text-[15px] font-bold text-[#666666]">
                     <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                     <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                     <li><Link href="#" className="hover:text-primary transition-colors">Academic Integrity</Link></li>
                  </ul>
               </div>
            </div>
            
            <div className="pt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black text-[#aaaaaa] uppercase tracking-[0.3em]">
               <p>© 2026 SABIBOOK AI. BUILT BY NINOLA OLADELE (LASUSTECH).</p>
               <p className="flex items-center gap-2 italic">A Computer Science Student Project ❤️</p>
            </div>
         </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}
