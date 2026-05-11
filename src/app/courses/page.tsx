"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  BookOpen, 
  Search, 
  MoreVertical, 
  FileText, 
  ChevronRight,
  Loader2,
  BarChart3,
  TrendingUp,
  Clock
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import CreateCourseModal from "@/components/CreateCourseModal";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "@/components/Header";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      setUser(authUser);

      const { data: coursesData } = await supabase
        .from("courses")
        .select(`
          *,
          pdfs (id)
        `)
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      setCourses(coursesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.progress === 100).length,
    avgProgress: courses.length ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0
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
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="My Courses" 
          description="Manage your academic library and track your progress." 
          user={user}
        >
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/20 w-64 transition-all"
                />
             </div>
             <button 
               onClick={() => setShowModal(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A5F] text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100"
             >
                <Plus className="w-4 h-4" /> Create Course
             </button>
          </div>
        </Header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 animate-slide-up">
           {/* Stats Row */}
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Total Courses", value: stats.total, icon: <BookOpen className="text-blue-500" />, bg: "bg-blue-50" },
                { label: "Completed", value: stats.completed, icon: <TrendingUp className="text-green-500" />, bg: "bg-green-50" },
                { label: "Average Progress", value: `${stats.avgProgress}%`, icon: <BarChart3 className="text-amber-500" />, bg: "bg-amber-50" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] border border-[#eef1f4] shadow-sm flex items-center gap-6">
                   <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                      {stat.icon}
                   </div>
                   <div>
                      <p className="text-[11px] font-bold text-[#aaaaaa] uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl font-black text-[#1a1a1a]">{stat.value}</h3>
                   </div>
                </div>
              ))}
           </div>

           {/* Courses Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full py-20 bg-white border border-[#eef1f4] rounded-[40px] flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                      <BookOpen className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-bold text-[#1a1a1a]">No courses found</h3>
                   <p className="text-slate-400 text-sm mt-2">Try a different search or create a new course.</p>
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <div key={course.id} className="group bg-white p-8 rounded-[32px] border border-[#eef1f4] hover:border-primary/20 hover:shadow-xl hover:shadow-red-50/50 transition-all cursor-pointer relative overflow-hidden">
                     {/* Decorative background circle */}
                     <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                     
                     <div className="flex justify-between items-start mb-8 relative">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                           <BookOpen className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="mb-8 relative">
                        <h4 className="text-lg font-black text-[#1a1a1a] line-clamp-1 group-hover:text-primary transition-colors">{course.name}</h4>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#aaaaaa]">
                              <FileText className="w-3.5 h-3.5" /> {course.pdfs?.length || 0} PDFs
                           </span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full" />
                           <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#aaaaaa]">
                              <Clock className="w-3.5 h-3.5" /> Updated {new Date(course.updated_at).toLocaleDateString()}
                           </span>
                        </div>
                     </div>

                     <div className="relative">
                        <div className="flex justify-between items-end mb-2.5">
                           <span className="text-[12px] font-bold text-[#666666]">Study Progress</span>
                           <span className="text-[12px] font-black text-primary">{course.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                           <div 
                             className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,90,95,0.3)]" 
                             style={{ width: `${course.progress || 0}%` }} 
                           />
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </main>

      <CreateCourseModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchData}
        userId={user?.id}
      />
    </div>
  );
}
