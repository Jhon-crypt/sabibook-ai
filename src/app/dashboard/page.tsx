"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  HelpCircle,
  MoreVertical,
  BarChart3,
  LogOut,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import CreateCourseModal from "@/components/CreateCourseModal";
import Sidebar from "@/components/Sidebar";

import Header from "@/components/Header";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ courses: 0, pdfs: 0, progress: 0 });
  const [activity, setActivity] = useState<{ day: string; hrs: number; height: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Course Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string; suggestedQuestions?: string[] }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      setUser(authUser);

      // 2. Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select(`
          *,
          pdfs (id)
        `)
        .eq("user_id", authUser.id);

      if (coursesError) throw coursesError;

      // 3. Fetch stats
      const { count: pdfCount } = await supabase
        .from("pdfs")
        .select('*', { count: 'exact', head: true })
        .eq("user_id", authUser.id);

      setCourses(coursesData || []);
      setStats({
        courses: coursesData?.length || 0,
        pdfs: pdfCount || 0,
        progress: coursesData?.length ? Math.round(coursesData.reduce((acc, c) => acc + (c.progress || 0), 0) / coursesData.length) : 0
      });

      // 4. Fetch activity data (Study Sessions)
      const { data: sessionData } = await supabase
        .from("study_sessions")
        .select("start_time, total_time_seconds")
        .eq("user_id", authUser.id)
        .gte("start_time", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const activityMap: Record<string, number> = {};
      days.forEach(d => activityMap[d] = 0);

      sessionData?.forEach(s => {
        const dayName = days[new Date(s.start_time).getDay()];
        activityMap[dayName] += (s.total_time_seconds || 0) / 3600; // Convert to hours
      });

      const formattedActivity = days.map(day => {
        const hrs = Math.min(10, activityMap[day]); // Cap at 10h for visual
        return {
          day,
          hrs: Math.round(activityMap[day] * 10) / 10,
          height: `h-[${Math.max(10, Math.round((hrs / 10) * 100))}%]`
        };
      });

      // Shift array so it starts from Monday for the UI
      const mondayStart = [...formattedActivity.slice(1), formattedActivity[0]];
      setActivity(mondayStart);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);
    
    // For now, if no course exists, we might need to handle it or select a default one
    // Let's assume they upload to a "General" course if none is selected
    let courseId = courses[0]?.id;
    if (!courseId) {
      // Create a default course if none exists
      const { data: newCourse } = await supabase
        .from("courses")
        .insert([{ name: "General Notes", user_id: user.id }])
        .select()
        .single();
      courseId = newCourse?.id;
    }
    formData.append("courseId", courseId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "ai", content: `Successfully processed ${file.name}. What would you like to know?` }]);
        fetchData(); // Refresh stats
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
        setMessages(prev => [...prev, { 
          role: "ai", 
          content: data.answer,
          suggestedQuestions: data.suggestedQuestions 
        }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Error: " + (data.error || "Unknown error") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Failed to connect to the AI service." }]);
    } finally {
      setIsAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Dashboard" 
          description="Ready to level up?" 
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 animate-slide-up">
           {/* Stats Row */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: "Courses Created", value: stats.courses.toString(), desc: "Keep expanding your knowledge!", icon: <BookOpen className="w-4 h-4" /> },
                { label: "PDFs Uploaded", value: stats.pdfs.toString(), desc: "Total study materials processed", icon: <FileText className="w-4 h-4" /> },
                { label: "Overall Progress", value: `${stats.progress}%`, desc: "Average across all courses", icon: <BarChart3 className="w-4 h-4" /> }
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

           {/* Activity Chart Section */}
            <div className="p-6 md:p-8 bg-white border border-[#eef1f4] rounded-[28px] shadow-sm">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                     <h3 className="text-[16px] font-bold">Weekly Activity</h3>
                     <p className="text-[11px] text-[#aaaaaa] mt-1">Study hours per day this week</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#FF5A5F] rounded-full" />
                        <span className="text-[11px] font-bold text-[#666666]">Study Time</span>
                     </div>
                     <select className="bg-slate-50 border-none text-[11px] font-bold text-[#666666] rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                        <option>This Week</option>
                        <option>Last Week</option>
                     </select>
                  </div>
               </div>
              
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                 <div className="flex items-end justify-between h-40 gap-3 min-w-[500px] md:min-w-0">
                 {activity.length === 0 ? (
                    <div className="w-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                       No study data for this week yet
                    </div>
                 ) : (
                    activity.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                         <div className="relative w-full flex items-end justify-center h-32">
                            <div className={`w-10 bg-slate-50 rounded-xl group-hover:bg-[#FFF0F0] transition-all relative overflow-hidden h-full`}>
                               <div 
                                 className={`absolute bottom-0 left-0 w-full bg-[#FF5A5F] rounded-xl transition-all duration-1000 opacity-80 group-hover:opacity-100 shadow-lg shadow-red-100`}
                                 style={{ height: d.height.replace('h-[', '').replace(']', '') }}
                               />
                            </div>
                            {/* Tooltip */}
                            <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                               {d.hrs}h
                            </div>
                         </div>
                         <span className="text-[11px] font-bold text-[#aaaaaa] uppercase tracking-wider">{d.day}</span>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>

           {/* Row: My Courses */}
           <div className="grid grid-cols-1 gap-6">
              {/* My Courses List */}
              <div className="p-6 md:p-8 bg-white border border-[#eef1f4] rounded-[28px] flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[16px] font-bold">My Courses</h3>
                    <Link href="/courses" className="text-[12px] font-bold text-[#FF5A5F] hover:underline">View All</Link>
                 </div>
                 
                 <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-6 snap-x snap-mandatory scrollbar-hide">
                    {courses.length === 0 ? (
                      <div className="w-full flex-shrink-0 py-20 flex flex-col items-center justify-center text-center px-6">
                         <div className="w-24 h-24 bg-[#FFF0F0] rounded-[32px] flex items-center justify-center mb-8 shadow-lg shadow-red-50 relative animate-bounce-slow">
                            <BookOpen className="w-10 h-10 text-primary" />
                            <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center">
                               <Plus className="w-4 h-4 text-white" />
                            </div>
                         </div>
                         <h3 className="text-2xl font-black text-[#1a1a1a] mb-3">No courses yet!</h3>
                         <p className="text-slate-400 text-sm max-w-[280px] leading-relaxed mb-10">
                            Create your first course to start uploading your handouts and chatting with our AI.
                         </p>
                         <button 
                           onClick={() => setShowModal(true)}
                           className="px-10 py-4 bg-[#1a1a1a] text-white font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                         >
                            Create Course Now
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div 
                          key={course.id} 
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="min-w-[320px] flex-shrink-0 snap-start group p-6 rounded-[32px] border border-[#f1f3f5] hover:border-[#FF5A5F]/20 hover:bg-[#fff9f9] transition-all cursor-pointer bg-white"
                        >
                           <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-red-50">
                                    <BookOpen className="w-7 h-7 text-slate-400 group-hover:text-[#FF5A5F]" />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-[17px] line-clamp-1">{course.name}</h4>
                                    <p className="text-[12px] text-[#aaaaaa] flex items-center gap-1.5 mt-1">
                                       <FileText className="w-3.5 h-3.5" /> {course.pdfs?.length || 0} Study Materials
                                    </p>
                                 </div>
                              </div>
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                 <MoreVertical className="w-4 h-4 text-[#aaaaaa]" />
                              </button>
                           </div>
                           
                           <div className="mt-auto">
                              <div className="flex justify-between items-end mb-3">
                                 <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Course Mastery</span>
                                 <span className="text-[13px] font-black text-[#FF5A5F]">{course.progress || 0}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                   className="h-full bg-[#FF5A5F] rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(255,90,95,0.3)]" 
                                   style={{ width: `${course.progress || 0}%` }} 
                                 />
                              </div>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Create Course Modal Component */}
      <CreateCourseModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchData}
        userId={user?.id}
      />

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
