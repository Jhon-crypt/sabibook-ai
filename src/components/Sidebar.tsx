"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  ClipboardList, 
  Award, 
  Bell, 
  Settings, 
  LogOut 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Courses", href: "/courses", icon: <BookOpen className="w-5 h-5" /> },
    { label: "AI Assistant", href: "/assistant", icon: <Bot className="w-5 h-5" /> },
    { label: "Assignments", href: "/assignments", icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Certificates", href: "/certificates", icon: <Award className="w-5 h-5" /> },
    { label: "Notifications", href: "/notifications", icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-[#eef1f4] flex flex-col p-6 space-y-8 animate-fade-in h-screen">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
          <span className="text-white font-bold text-xl font-serif italic">C</span>
        </div>
        <span className="text-xl font-bold tracking-tight">SabiBook<span className="text-[#FF5A5F]">AI</span></span>
      </Link>

      <nav className="flex-1 flex flex-col gap-2">
        <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-widest pl-3 mb-2">Main Tools</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                isActive ? 'bg-[#FFF0F0] text-[#FF5A5F]' : 'text-[#666666] hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[14px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2">
         <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-widest pl-3 mb-2">Settings</p>
         <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:bg-slate-50 cursor-pointer">
            <Settings className="w-5 h-5" />
            <span className="text-[14px] font-semibold">Settings</span>
         </div>
         <div 
           onClick={handleLogout}
           className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer transition-all mt-auto"
         >
            <LogOut className="w-5 h-5" />
            <span className="text-[14px] font-semibold">Logout</span>
         </div>
      </div>
    </aside>
  );
}
