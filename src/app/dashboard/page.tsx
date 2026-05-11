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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ courses: 0, pdfs: 0, progress: 0 });
  const [activity, setActivity] = useState<{ day: string; hrs: number; height: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-10 h-10 text-primary animate-spin" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading your sabi-space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#eef1f4] flex flex-col p-6 space-y-8 animate-fade-in">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
            <span className="text-white font-bold text-xl font-serif italic">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SabiBook<span className="text-[#FF5A5F]">AI</span></span>
        </Link>

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
           <div 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer transition-all mt-auto"
           >
              <LogOut className="w-5 h-5" />
              <span className="text-[14px] font-semibold">Logout</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-[#eef1f4] flex items-center justify-between px-10 animate-fade-in">
          <div>
            <h2 className="text-[20px] font-bold">Dashboard</h2>
            <p className="text-[12px] text-[#888888]">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Maxwell'}! Ready to level up?</p>
          </div>
          
          <div className="flex items-center gap-4">
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
           <div className="p-8 bg-white border border-[#eef1f4] rounded-[28px] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-[16px] font-bold">Weekly Activity</h3>
                    <p className="text-[11px] text-[#aaaaaa] mt-1">Study hours per day this week</p>
                 </div>
                 <div className="flex items-center gap-4">
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
              
              <div className="flex items-end justify-between h-40 gap-2 px-4">
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

           {/* Second Row: Courses and AI Assistant */}
           <div className="grid grid-cols-3 gap-6">
              {/* My Courses List */}
              <div className="col-span-2 p-8 bg-white border border-[#eef1f4] rounded-[28px] flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[16px] font-bold">My Courses</h3>
                    <button className="text-[12px] font-bold text-[#FF5A5F] hover:underline">View All</button>
                 </div>
                 
                 <div className="space-y-6">
                    {courses.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center px-6">
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
                           onClick={() => {
                             const name = prompt("Enter Course Name (e.g. GST 101):");
                             if (name) {
                               supabase.from("courses").insert([{ name, user_id: user.id }]).then(() => fetchData());
                             }
                           }}
                           className="px-10 py-4 bg-[#1a1a1a] text-white font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                         >
                            Create Course Now
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div key={course.id} className="group p-5 rounded-2xl border border-[#f1f3f5] hover:border-[#FF5A5F]/20 hover:bg-[#fff9f9] transition-all cursor-pointer">
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                                    <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-[#FF5A5F]" />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-[15px]">{course.name}</h4>
                                    <p className="text-[11px] text-[#aaaaaa] flex items-center gap-1.5 mt-1">
                                       <FileText className="w-3 h-3" /> {course.pdfs?.length || 0} PDFs uploaded • Created {new Date(course.created_at).toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                 <MoreVertical className="w-4 h-4 text-[#aaaaaa]" />
                              </button>
                           </div>
                           
                           <div>
                              <div className="flex justify-between items-end mb-2">
                                 <span className="text-[11px] font-bold text-[#888888]">Progress</span>
                                 <span className="text-[11px] font-black text-[#FF5A5F]">{course.progress || 0}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                   className="h-full bg-[#FF5A5F] rounded-full transition-all duration-1000" 
                                   style={{ width: `${course.progress || 0}%` }} 
                                 />
                              </div>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
              </div>

              {/* AI Study Assistant Feature Box */}
              <div className="p-8 bg-white border border-[#eef1f4] rounded-[28px] flex flex-col h-full min-h-[500px]">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold">AI Assistant</span>
                    <div className="flex items-center gap-2">
                       <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept=".pdf" />
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="text-[11px] font-bold text-[#FF5A5F] px-4 py-2 bg-[#FFF0F0] rounded-full hover:bg-[#FFD9D9] transition-all flex items-center gap-1.5"
                       >
                         <Plus className="w-3 h-3" />
                         {isUploading ? "..." : "Upload"}
                       </button>
                    </div>
                 </div>

                 {/* Feature Buttons */}
                 <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { id: "summary", label: "Summarize", icon: <Zap className="w-3 h-3" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
                      { id: "quiz", label: "Quiz", icon: <ClipboardList className="w-3 h-3" />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                      { id: "simple", label: "Explain", icon: <Bot className="w-3 h-3" />, color: "bg-teal-50 text-teal-600 border-teal-100" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          if (btn.id === "summary") setQuestion("Can you summarize my uploaded notes into key bullet points?");
                          if (btn.id === "quiz") setQuestion("Generate 5 practice exam questions from these notes.");
                          if (btn.id === "simple") setQuestion("Explain this simply for a 100 level student.");
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
                          <div className={`p-4 rounded-2xl text-[13px] max-w-[95%] ${
                            msg.role === "user" ? "bg-[#FF5A5F] text-white shadow-md shadow-red-100" : "bg-slate-50 border border-slate-100 text-slate-700"
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
           </div>

           {/* Results and Schedule Section */}
           <div className="grid grid-cols-3 gap-6">
              {/* Recently Studied Results Table */}
              <div className="col-span-2 p-8 bg-white border border-[#eef1f4] rounded-[28px]">
                 <h3 className="text-[14px] font-bold mb-6">Study History</h3>
                 <div className="overflow-hidden text-center py-10 opacity-40">
                    <Clock className="w-10 h-10 mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">No recent sessions recorded</p>
                 </div>
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
                            <span className="text-[12px] font-bold">{item.task}</span>
                            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }} />
                         </div>
                      </div>
                    ))}
                 </div>
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
