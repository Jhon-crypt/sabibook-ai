import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  description: string;
  user: any;
  onMenuClick?: () => void;
  children?: React.ReactNode;
}

export default function Header({ title, description, user, onMenuClick, children }: HeaderProps) {
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  return (
    <header className="h-20 bg-white border-b border-[#eef1f4] flex items-center justify-between px-4 md:px-10 animate-fade-in shrink-0 relative z-50">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div>
          <h2 className="text-lg md:text-[20px] font-bold">{title}</h2>
          <p className="hidden sm:block text-[12px] text-[#888888]">
            {title === "Dashboard" ? `Welcome back, ${firstName}! ${description}` : description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
         <div className="hidden lg:block">
            {children}
         </div>
         <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-slate-100 group cursor-pointer">
            <div className="text-right hidden sm:block">
               <p className="text-[15px] font-black text-[#1a1a1a] leading-none group-hover:text-primary transition-colors tracking-tight">
                  {user?.user_metadata?.full_name || "Student User"}
               </p>
               <p className="text-[9px] font-black text-primary mt-1.5 uppercase tracking-[0.3em]">Academic Profile</p>
            </div>
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-[14px] bg-slate-50 flex items-center justify-center border border-[#eef1f4] shadow-sm text-primary font-black text-[13px] group-hover:bg-primary/5 transition-all">
               {user?.user_metadata?.full_name 
                 ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) 
                 : "S"}
            </div>
         </div>
      </div>
    </header>
  );
}
