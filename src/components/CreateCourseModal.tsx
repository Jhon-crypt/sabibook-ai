"use client";

import { useState } from "react";
import { 
  Plus, 
  X, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ChevronRight 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function CreateCourseModal({ isOpen, onClose, onSuccess, userId }: CreateCourseModalProps) {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle || !userId) return;

    setCreating(true);
    setUploadProgress(0);
    try {
      // 1. Create Course
      const { data: newCourse, error: courseError } = await supabase
        .from("courses")
        .insert([{ 
          name: `${courseCode}: ${courseTitle}`, 
          user_id: userId 
        }])
        .select()
        .single();

      if (courseError) throw courseError;

      // 2. Upload PDF if selected
      if (selectedFile && newCourse) {
        await new Promise<void>(async (resolve, reject) => {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("userId", userId);
          formData.append("courseId", newCourse.id);

          const xhr = new XMLHttpRequest();
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;

          xhr.open("POST", "/api/upload", true);
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }

          let intervalId: any;

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              // Scale upload to 30% of total progress
              const percent = Math.round((event.loaded / event.total) * 30);
              setUploadProgress(percent);
              
              if (percent === 30 && !intervalId) {
                 // Simulate AI generation progress from 30% to 95%
                 let currentProgress = 30;
                 intervalId = setInterval(() => {
                    currentProgress += 1;
                    if (currentProgress > 95) {
                       clearInterval(intervalId);
                    } else {
                       setUploadProgress(currentProgress);
                    }
                 }, 400); // Slower interval for AI generation
              }
            }
          };

          xhr.onload = () => {
            if (intervalId) clearInterval(intervalId);
            setUploadProgress(100);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error("Upload failed"));
            }
          };

          xhr.onerror = () => {
            if (intervalId) clearInterval(intervalId);
            reject(new Error("Network error"));
          };
          xhr.send(formData);
        });
      }

      setCourseCode("");
      setCourseTitle("");
      setSelectedFile(null);
      setUploadProgress(0);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setCreating(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
       <div 
         className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
         onClick={() => !creating && onClose()}
       />
       <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slide-up">
          <div className="p-10">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#1a1a1a]">New Course</h3>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                   <X className="w-5 h-5" />
                </button>
             </div>

             <form onSubmit={handleCreateCourse} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[11px] font-black text-[#aaaaaa] uppercase tracking-widest mb-2 pl-1">Course Code</label>
                      <input 
                        type="text" 
                        placeholder="GST 101"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:border-primary/20 transition-all"
                        required
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-[#aaaaaa] uppercase tracking-widest mb-2 pl-1">Course Title</label>
                      <input 
                        type="text" 
                        placeholder="Use of English"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:border-primary/20 transition-all"
                        required
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-[11px] font-black text-[#aaaaaa] uppercase tracking-widest mb-2 pl-1">Upload First PDF (Optional)</label>
                   <div 
                     onClick={() => !creating && document.getElementById('modal-pdf-comp')?.click()}
                     className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                        selectedFile ? 'border-green-500 bg-green-50/30' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                     }`}
                   >
                      <input 
                        type="file" 
                        id="modal-pdf-comp"
                        className="hidden" 
                        accept=".pdf" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      {selectedFile ? (
                         <>
                           <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                           <span className="text-xs font-bold text-green-600 truncate max-w-[80%]">{selectedFile.name}</span>
                           
                           {/* Progress Overlay */}
                           {creating && uploadProgress > 0 && (
                             <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 animate-fade-in">
                               <div className="w-full max-w-[200px]">
                                 <div className="flex justify-between items-end mb-2">
                                   <span className="text-[10px] font-black text-primary uppercase">
                                      {uploadProgress >= 30 && uploadProgress < 100 ? "Analyzing AI..." : uploadProgress === 100 ? "Complete!" : "Uploading..."}
                                   </span>
                                   <span className="text-[10px] font-black text-primary">
                                      {`${uploadProgress}%`}
                                   </span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                                   <div 
                                     className="h-full bg-primary transition-all duration-300" 
                                     style={{ width: `${uploadProgress}%` }}
                                   />
                                   {uploadProgress >= 30 && uploadProgress < 100 && (
                                     <div className="absolute inset-0 bg-white/30 animate-pulse" />
                                   )}
                                 </div>
                               </div>
                             </div>
                           )}
                         </>
                      ) : (
                         <>
                           <FileText className="w-8 h-8 text-slate-300 mb-2" />
                           <span className="text-[11px] font-bold text-slate-400">Click to select handout</span>
                         </>
                      )}
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={creating}
                  className="w-full py-5 bg-[#1a1a1a] text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {creating ? (
                     <>
                       <Loader2 className="w-6 h-6 animate-spin" />
                       <span className="text-sm">
                         {uploadProgress >= 30 && uploadProgress < 100 ? `Generating AI Curriculum (${uploadProgress}%)` : uploadProgress === 100 ? "Finalizing..." : uploadProgress > 0 ? `Uploading PDF (${uploadProgress}%)` : "Initializing..."}
                       </span>
                     </>
                   ) : (
                     <>
                       <span>Create Course</span>
                       <ChevronRight className="w-5 h-5" />
                     </>
                   )}
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}
