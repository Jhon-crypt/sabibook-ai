"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ChevronRight, User, GraduationCap, School, Book } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const NIGERIAN_UNIVERSITIES = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "Obafemi Awolowo University (OAU)",
  "University of Nigeria, Nsukka (UNN)",
  "Ahmadu Bello University (ABU)",
  "University of Benin (UNIBEN)",
  "Lagos State University (LASU)",
  "Lagos State University of Science and Technology (LASUSTECH)",
  "Covenant University",
  "Babcock University",
  "Federal University of Technology, Akure (FUTA)",
  "Federal University of Technology, Minna (FUTMINNA)",
  "University of Ilorin (UNILORIN)",
  "Nnamdi Azikiwe University (UNIZIK)",
  "Bayero University Kano (BUK)",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    matricNumber: "",
    department: "",
    university: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful signup
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
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] mb-2">
            {step === 1 ? "Create Account" : "Academic Details"}
          </h1>
          <p className="text-[#6b7280]">
            {step === 1 ? "Join thousands of students learning faster today." : "Tell us more about your studies."}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-[#eef1f4]">
          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleNext}>
              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@university.edu.ng"
                    className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <p className="text-[12px] text-[#6b7280] leading-relaxed px-1">
                By signing up, you agree to our <Link href="#" className="text-primary font-bold">Terms</Link> and <Link href="#" className="text-primary font-bold">Academic Integrity Policy</Link>.
              </p>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">Matric Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="matricNumber"
                    value={formData.matricNumber}
                    onChange={handleChange}
                    placeholder="2023/12345"
                    className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">University</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <School className="w-5 h-5" />
                  </div>
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium appearance-none"
                    required
                  >
                    <option value="" disabled>Select your University</option>
                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                    <option value="other">Other / Not Listed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] mb-2 pl-1 uppercase tracking-wider">Department</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Book className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full bg-[#f8f9fa] border border-[#eef1f4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-slate-50 text-[#1a1a1a] border border-[#eef1f4] font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Create Account <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#eef1f4]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3 border border-[#eef1f4] rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold text-[#1a1a1a]">
                  <div className="w-5 h-5 flex items-center justify-center font-black">G</div> Google
                </button>
                <button className="flex items-center justify-center gap-3 py-3 border border-[#eef1f4] rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold text-[#1a1a1a]">
                  <GithubIcon className="w-5 h-5" /> GitHub
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center mt-8 text-sm font-medium text-[#6b7280]">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
