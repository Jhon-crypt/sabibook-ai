"use client";

import { useState, useEffect, use } from "react";
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  HelpCircle,
  ArrowLeft,
  Loader2,
  Lock,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function CourseBoard({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [mobileContentPage, setMobileContentPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      // Fetch course details
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      
      setCourse(courseData);

      // Fetch modules
      const { data: modulesData } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      setModules(modulesData || []);
    } catch (err) {
      console.error("Error fetching course board:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async (index: number) => {
    const module = modules[index];
    
    // Calculate Score for this module (1 point per correct answer)
    let currentScore = 0;
    module.quiz_questions?.forEach((q: any, qIdx: number) => {
       if (selectedAnswers[qIdx] === q.correctAnswer) {
          currentScore += 1;
       }
    });

    try {
      const { error } = await supabase
        .from("course_modules")
        .update({ is_completed: true, quiz_score: currentScore })
        .eq("id", module.id);

      if (error) throw error;

      const newModules = [...modules];
      newModules[index].is_completed = true;
      newModules[index].quiz_score = currentScore;
      setModules(newModules);

      // Update course progress based on total score / total possible questions
      let totalQuestions = 0;
      let totalScore = 0;
      newModules.forEach(m => {
        const qCount = m.quiz_questions?.length || 0;
        totalQuestions += qCount;
        if (m.is_completed) {
           totalScore += (m.quiz_score || 0);
        }
      });
      
      const progress = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      
      await supabase
        .from("courses")
        .update({ progress })
        .eq("id", courseId);

      // Move to next module if available
      if (index < modules.length - 1) {
        setActiveModuleIndex(index + 1);
        setShowQuiz(false);
        setQuizSubmitted(false);
        setSelectedAnswers({});
        setMobileContentPage(0);
      }
    } catch (err) {
      console.error("Error completing module:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f8fafc] items-center justify-center">
         <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const activeModule = modules[activeModuleIndex];
  
  // Mobile Pagination Logic
  const paragraphs = activeModule?.content?.split('\n').filter((p: string) => p.trim() !== '') || [];
  const itemsPerPage = 2; // Show 2 paragraphs per "page" on mobile
  const totalPages = Math.ceil(paragraphs.length / itemsPerPage);
  const visibleParagraphs = paragraphs.slice(mobileContentPage * itemsPerPage, (mobileContentPage + 1) * itemsPerPage);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
       
       <main className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={course?.name || "Course Board"}
            description="Master this module to advance."
            user={user}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          
          <div className="flex-1 overflow-y-auto p-8">
             <div className="max-w-5xl mx-auto">
                {/* Back Link */}
                <Link href="/courses" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                   <span className="text-sm font-bold uppercase tracking-wider">Back to Library</span>
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                   {/* Main Content */}
                   <div className="flex-1 overflow-hidden">
                      {/* Mobile Course Path Tabs */}
                      <div className="lg:hidden w-full flex overflow-x-auto gap-3 pb-2 mb-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                         {modules.map((mod, index) => (
                            <button
                               key={`mobile-tab-${mod.id}`}
                               onClick={() => {
                                 setActiveModuleIndex(index);
                                 setShowQuiz(false);
                                 setQuizSubmitted(false);
                                 setMobileContentPage(0);
                               }}
                               className={`snap-start shrink-0 px-6 py-3.5 rounded-[20px] font-bold text-sm transition-all border-2 flex items-center gap-2.5 ${
                                 activeModuleIndex === index 
                                   ? 'bg-primary/5 border-primary text-primary shadow-sm shadow-red-100/50' 
                                   : mod.is_completed 
                                     ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                     : 'bg-white border-[#eef1f4] text-slate-500 hover:border-slate-200'
                               }`}
                            >
                               {mod.is_completed ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <PlayCircle className="w-4 h-4 shrink-0" />}
                               <span className="whitespace-nowrap">Module {index + 1}</span>
                            </button>
                         ))}
                      </div>

                      {activeModule ? (
                        <div className="bg-white rounded-[40px] border border-[#eef1f4] shadow-sm overflow-hidden">
                           <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                              <div className="flex items-center gap-3 mb-4">
                                 <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                                    Module {activeModuleIndex + 1}
                                 </span>
                                 {activeModule.is_completed && (
                                   <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                   </span>
                                 )}
                              </div>
                              <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-2">
                                 {activeModule.title}
                              </h1>
                           </div>

                           <div className="p-10">
                              {!showQuiz ? (
                                 <>
                                  {/* Desktop View - Full Content */}
                                  <div className="hidden md:block prose prose-slate max-w-none mb-12">
                                     {paragraphs.map((line: string, i: number) => (
                                       <p key={`desktop-${i}`} className="text-slate-600 leading-relaxed text-lg mb-6">
                                          {line}
                                       </p>
                                     ))}
                                  </div>

                                  {/* Mobile View - Paginated Content */}
                                  <div className="md:hidden mb-12">
                                     <div className="prose prose-slate max-w-none min-h-[250px]">
                                        {visibleParagraphs.map((line: string, i: number) => (
                                          <p key={`mobile-${mobileContentPage}-${i}`} className="text-slate-600 leading-relaxed text-lg mb-6 animate-fade-in">
                                             {line}
                                          </p>
                                        ))}
                                     </div>
                                     
                                     {totalPages > 1 && (
                                       <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                                          <button 
                                            onClick={() => setMobileContentPage(p => Math.max(0, p - 1))}
                                            disabled={mobileContentPage === 0}
                                            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-50 text-slate-600 hover:bg-slate-100"
                                          >
                                             Previous
                                          </button>
                                          <div className="flex items-center gap-1.5">
                                             {Array.from({ length: totalPages }).map((_, i) => (
                                                <div 
                                                  key={i} 
                                                  className={`h-2 rounded-full transition-all ${mobileContentPage === i ? 'w-4 bg-primary' : 'w-2 bg-slate-200'}`}
                                                />
                                             ))}
                                          </div>
                                          <button 
                                            onClick={() => setMobileContentPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={mobileContentPage === totalPages - 1}
                                            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-primary/10 text-primary hover:bg-primary/20"
                                          >
                                             Next
                                          </button>
                                       </div>
                                     )}
                                  </div>

                                  {/* Take Quiz Button */}
                                  <button 
                                    onClick={() => setShowQuiz(true)}
                                    className={`w-full py-5 text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group ${
                                       totalPages > 1 && mobileContentPage < totalPages - 1 ? 'hidden md:flex bg-[#1a1a1a]' : 'flex bg-[#1a1a1a]'
                                    }`}
                                  >
                                     Take Module Quiz
                                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                  </button>
                                 </>
                               ) : (
                                <div className="animate-fade-in">
                                   <h3 className="text-2xl font-black text-[#1a1a1a] mb-8 flex items-center gap-3">
                                      <HelpCircle className="w-7 h-7 text-primary" />
                                      Knowledge Check
                                   </h3>
                                   
                                   <div className="space-y-10">
                                      {activeModule.quiz_questions?.map((q: any, qIdx: number) => (
                                        <div key={qIdx} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                           <p className="text-lg font-bold text-[#1a1a1a] mb-6">{q.question}</p>
                                           <div className="grid grid-cols-1 gap-3">
                                              {q.options?.map((option: string, oIdx: number) => (
                                                <button 
                                                  key={oIdx}
                                                  onClick={() => !quizSubmitted && setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                                  className={`p-5 rounded-2xl text-left font-bold transition-all border-2 ${
                                                    selectedAnswers[qIdx] === oIdx 
                                                      ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-red-100/50' 
                                                      : 'bg-white border-white text-slate-500 hover:border-slate-200'
                                                  } ${
                                                    quizSubmitted && oIdx === q.correctAnswer ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : ''
                                                  } ${
                                                    quizSubmitted && selectedAnswers[qIdx] === oIdx && oIdx !== q.correctAnswer ? 'bg-red-50 border-red-500 text-red-600' : ''
                                                  }`}
                                                >
                                                   {option}
                                                </button>
                                              ))}
                                           </div>
                                        </div>
                                      ))}
                                   </div>

                                   {!quizSubmitted ? (
                                     <button 
                                       onClick={() => setQuizSubmitted(true)}
                                       className="w-full mt-10 py-5 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                     >
                                        Check Answers
                                     </button>
                                   ) : (
                                     <div className="mt-10 animate-fade-in">
                                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between mb-4 shadow-sm">
                                           <span className="font-bold text-emerald-800 uppercase tracking-wider text-sm">Your Score</span>
                                           <span className="text-2xl font-black text-emerald-600">
                                              {activeModule.quiz_questions?.reduce((acc: number, q: any, idx: number) => acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0), 0)} / {activeModule.quiz_questions?.length || 0}
                                           </span>
                                        </div>
                                        <button 
                                          onClick={() => handleCompleteModule(activeModuleIndex)}
                                          className="w-full py-5 bg-emerald-500 text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                           Continue to Next Module
                                           <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                     </div>
                                   )}
                                </div>
                              )}
                           </div>
                        </div>
                      ) : (
                        <div className="bg-white p-20 rounded-[40px] text-center border border-[#eef1f4]">
                           <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100/50">
                              <Trophy className="w-12 h-12 text-emerald-500" />
                           </div>
                           <h2 className="text-4xl font-black text-[#1a1a1a] mb-4">Course Completed!</h2>
                           <p className="text-slate-400 text-lg max-w-sm mx-auto mb-10">You've mastered all the modules in this course. Great job!</p>
                           <Link href="/courses" className="inline-flex py-4 px-10 bg-[#1a1a1a] text-white font-bold rounded-2xl hover:scale-[1.05] transition-all">
                              Return to Library
                           </Link>
                        </div>
                      )}
                   </div>

                   {/* Module Navigation Sidebar */}
                   <div className="w-full lg:w-80 flex flex-col gap-6 lg:sticky lg:top-0 h-fit">
                      <div className="hidden lg:block bg-white p-8 rounded-[40px] border border-[#eef1f4] shadow-sm">
                         <h3 className="text-lg font-black text-[#1a1a1a] mb-6">Course Path</h3>
                         <div className="space-y-4">
                            {modules.map((mod, index) => (
                              <button 
                                key={mod.id}
                                onClick={() => {
                                  setActiveModuleIndex(index);
                                  setShowQuiz(false);
                                  setQuizSubmitted(false);
                                  setMobileContentPage(0);
                                }}
                                className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex items-center gap-4 ${
                                  activeModuleIndex === index 
                                    ? 'bg-primary/5 border-primary shadow-lg shadow-red-100/50' 
                                    : 'bg-slate-50/50 border-transparent hover:bg-slate-50'
                                }`}
                              >
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                   mod.is_completed ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'
                                 }`}>
                                    {mod.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                 </div>
                                 <div className="overflow-hidden">
                                    <p className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${
                                      activeModuleIndex === index ? 'text-primary' : 'text-[#aaaaaa]'
                                    }`}>Module {index + 1}</p>
                                    <p className="text-xs font-bold text-[#1a1a1a] line-clamp-1">{mod.title}</p>
                                 </div>
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="bg-[#1a1a1a] p-8 rounded-[40px] text-white overflow-hidden relative group">
                         <div className="relative z-10">
                            <h3 className="text-lg font-black mb-2">Need Help?</h3>
                            <p className="text-slate-400 text-xs mb-6 leading-relaxed">Stuck on a concept? Our AI tutor is always here to help you explain things further.</p>
                            <Link href="/dashboard" className="inline-flex py-3 px-6 bg-primary text-white text-xs font-bold rounded-xl hover:bg-white hover:text-[#1a1a1a] transition-all">
                               Chat with AI
                            </Link>
                         </div>
                         <BookOpen className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </main>
    </div>
  );
}
