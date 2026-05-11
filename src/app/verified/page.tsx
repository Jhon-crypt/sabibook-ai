"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, PartyPopper, Sparkles, Rocket, Bot, Zap } from "lucide-react";

export default function VerifiedPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 font-sans overflow-hidden">
      <div className={`w-full max-w-[550px] transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-slate-200 border border-[#eef1f4] text-center relative overflow-hidden">
           {/* Decorative Background Elements */}
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
           <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
           
           <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100/50 animate-bounce-slow">
              <PartyPopper className="w-10 h-10 text-green-500" />
           </div>
           
           <h1 className="text-4xl font-black text-[#1a1a1a] mb-4 tracking-tight leading-tight">
             Email Confirmed! <br />
             <span className="text-green-500">You're all set.</span>
           </h1>
           
           <p className="text-lg text-[#6b7280] mb-12 max-w-md mx-auto leading-relaxed">
             Your account is now fully activated. Get ready to transform how you study with SabiBook AI.
           </p>

           <div className="grid grid-cols-1 gap-4 text-left mb-12">
              {[
                { icon: <Bot className="w-5 h-5 text-indigo-500" />, title: "Personal AI Tutor", desc: "Your notes are now interactive brains." },
                { icon: <Zap className="w-5 h-5 text-amber-500" />, title: "Speed Revision", desc: "Summarize chapters in seconds." },
                { icon: <Rocket className="w-5 h-5 text-teal-500" />, title: "Grade Booster", desc: "Track progress and ace your tests." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-[#f1f3f5] hover:border-green-500/20 transition-all group">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {feature.icon}
                   </div>
                   <div>
                      <h4 className="font-bold text-[#1a1a1a] text-sm">{feature.title}</h4>
                      <p className="text-[12px] text-[#888888] mt-1">{feature.desc}</p>
                   </div>
                </div>
              ))}
           </div>
           
           <button
             onClick={() => router.push("/dashboard")}
             className="w-full py-5 bg-[#1a1a1a] text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
           >
             Go to Dashboard 
             <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
           
           <p className="mt-8 text-[11px] font-bold text-[#aaaaaa] uppercase tracking-[0.3em]">Welcome to the future of learning</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
