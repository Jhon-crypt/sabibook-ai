"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle2, 
  Trophy, 
  Trash2, 
  Loader2,
  Clock,
  MoreHorizontal,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", authUser?.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase
        .from("notifications")
        .delete()
        .eq("id", id);
      
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user?.id);
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const clearAll = async () => {
    if (!confirm("Are you sure you want to clear all notifications?")) return;
    try {
      await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user?.id);
      
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course_complete':
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 'module_complete':
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      default:
        return <Bell className="w-6 h-6 text-primary" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Notifications" 
          description="Stay updated with your learning progress."
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-3">
                  All Notifications
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="px-2.5 py-0.5 bg-primary text-white text-[10px] font-black rounded-full">
                       {notifications.filter(n => !n.is_read).length} NEW
                    </span>
                  )}
               </h2>
               
               <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllRead}
                    className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-slate-50 transition-all border border-[#eef1f4] group"
                    title="Mark all as read"
                  >
                     <Check className="w-5 h-5 group-hover:text-emerald-500" />
                  </button>
                  <button 
                    onClick={clearAll}
                    className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-slate-50 transition-all border border-[#eef1f4] group"
                    title="Clear all"
                  >
                     <Trash2 className="w-5 h-5 group-hover:text-red-500" />
                  </button>
               </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-[#eef1f4]">
                 <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-[#eef1f4] shadow-sm text-center px-10">
                 <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6">
                    <Bell className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-[#1a1a1a] mb-2">All Quiet Here</h3>
                 <p className="text-slate-500 max-w-xs leading-relaxed">
                    You don't have any notifications yet. Start learning to see updates here!
                 </p>
              </div>
            ) : (
              <div className="space-y-4">
                 {notifications.map((n) => (
                   <div 
                     key={n.id}
                     onClick={() => !n.is_read && markAsRead(n.id)}
                     className={`group relative bg-white p-6 md:p-8 rounded-[35px] border transition-all cursor-pointer flex gap-6 ${
                       n.is_read ? 'border-[#eef1f4] opacity-80' : 'border-primary/20 shadow-lg shadow-red-50/50'
                     }`}
                   >
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[25px] flex items-center justify-center shrink-0 shadow-inner ${
                        n.is_read ? 'bg-slate-50 text-slate-400' : 'bg-primary/5 text-primary'
                      }`}>
                         {getIcon(n.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-lg font-black truncate ${n.is_read ? 'text-slate-600' : 'text-[#1a1a1a]'}`}>
                               {n.title}
                            </h4>
                            <div className="flex items-center gap-2 text-slate-400 shrink-0">
                               <Clock className="w-3.5 h-3.5" />
                               <span className="text-[11px] font-bold uppercase tracking-tight">{getTimeAgo(n.created_at)}</span>
                            </div>
                         </div>
                         <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            {n.message}
                         </p>
                         
                         <div className="flex items-center gap-3">
                            {!n.is_read && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline"
                              >
                                 Mark as read
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                              className="text-[10px] font-black uppercase text-slate-300 tracking-widest hover:text-red-500 transition-colors"
                            >
                               Delete
                            </button>
                         </div>
                      </div>
                      
                      {!n.is_read && (
                        <div className="absolute top-6 right-6 w-2 h-2 bg-primary rounded-full" />
                      )}
                   </div>
                 ))}
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
