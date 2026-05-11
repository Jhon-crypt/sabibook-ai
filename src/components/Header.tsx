"use client";

import Image from "next/image";

interface HeaderProps {
  title: string;
  description: string;
  user: any;
  children?: React.ReactNode;
}

export default function Header({ title, description, user, children }: HeaderProps) {
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  return (
    <header className="h-20 bg-white border-b border-[#eef1f4] flex items-center justify-between px-10 animate-fade-in shrink-0">
      <div>
        <h2 className="text-[20px] font-bold">{title}</h2>
        <p className="text-[12px] text-[#888888]">
          {title === "Dashboard" ? `Welcome back, ${firstName}! ${description}` : description}
        </p>
      </div>
      
      <div className="flex items-center gap-6">
         {children}
         <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
            <div className="text-right">
               <p className="text-[13px] font-bold text-[#1a1a1a] leading-none">{user?.user_metadata?.full_name || "User"}</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Level 100</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-[#eef1f4] relative shadow-sm">
               <Image 
                 src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200" 
                 alt="Avatar" 
                 fill 
                 className="object-cover" 
                 unoptimized 
               />
            </div>
         </div>
      </div>
    </header>
  );
}
