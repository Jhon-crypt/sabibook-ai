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
  LogOut,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
            <span className="text-white font-bold text-xl font-serif italic">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SabiBook<span className="text-[#FF5A5F]">AI</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-slate-400">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-2 mt-8">
        <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-widest pl-3 mb-2">Main Tools</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white border-r border-[#eef1f4] flex-col p-6 space-y-8 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] md:hidden">
           <div 
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
             onClick={onClose}
           />
           <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col p-6 animate-slide-right shadow-2xl">
              {sidebarContent}
           </aside>
        </div>
      )}
    </>
  );
}
