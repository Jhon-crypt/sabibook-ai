"use client";

import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName: string;
  isDeleting: boolean;
}

export default function DeleteCourseModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  courseName,
  isDeleting 
}: DeleteCourseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
       <div 
         className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
         onClick={() => !isDeleting && onClose()}
       />
       <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slide-up">
          <div className="p-10 text-center">
             <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100/50">
                <Trash2 className="w-10 h-10 text-red-500" />
             </div>
             
             <h3 className="text-2xl font-black text-[#1a1a1a] mb-2 tracking-tight">Delete Course?</h3>
             <p className="text-slate-500 text-[13px] leading-relaxed mb-8 max-w-[280px] mx-auto">
                Are you sure you want to delete <span className="font-bold text-red-500">"{courseName}"</span>? This will remove all handouts and study history permanently.
             </p>

             <div className="flex flex-col gap-3">
                <button 
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                   {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Delete Course"}
                </button>
                <button 
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full py-4 bg-slate-50 text-[#1a1a1a] font-bold rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                   Cancel
                </button>
             </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
             <X className="w-5 h-5" />
          </button>
       </div>
    </div>
  );
}
