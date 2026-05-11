"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ChevronRight, UserCircle } from "lucide-react";


export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px] animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl font-serif italic">C</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter">SabiBook<span className="text-primary">AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] mb-2">Welcome back!</h1>
          <p className="text-[#6b7280]">Ready to continue your learning journey?</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-[#eef1f4]">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">Email or Matric Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserCircle className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Matric Number"
                  className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[12px] font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Sign In <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm font-medium text-[#6b7280]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">Create one for free</Link>
        </p>
      </div>
    </div>
  );
}
