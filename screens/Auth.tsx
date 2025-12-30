
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface Props {
  onLogin: (user: { name: string; email: string }) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Reference to C++ logic in cpp-logic-reference/auth_logic.cpp
  const validatePassword = (pass: string): number => {
    if (pass.length < 8) return 0;
    
    let hasLetter = 0;
    let hasNumber = 0;
    
    for (let i = 0; i < pass.length; i++) {
      const c = pass[i];
      if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
        hasLetter = 1;
      }
      if (c >= '0' && c <= '9') {
        hasNumber = 1;
      }
    }
    
    if (hasLetter === 1 && hasNumber === 1) {
      return 1;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (validatePassword(formData.password) === 0) {
      alert('Password must be at least 8 characters and contain both letters and numbers.');
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
      } else if (data.user) {
        onLogin({ 
          name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'User', 
          email: data.user.email! 
        });
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          }
        }
      });

      if (error) {
        alert(error.message);
      } else {
        alert('Check your email for the confirmation link!');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark p-4 md:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 dark:bg-accent/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl flex bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-200 dark:border-slate-800">
        {/* Branding Side - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden p-12 flex-col justify-between">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
             <div className="bg-white/5 p-2 rounded-xl backdrop-blur-md">
              <img src="/Time-Table-Clash-Detector/logo.png" alt="Logo" className="size-12 object-contain brightness-0 invert" />
            </div>
            <h1 className="text-white text-2xl font-black tracking-tighter">TimeSmart</h1>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white leading-tight tracking-tighter mb-6">Master your academic schedule with ease.</h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed">
              Experience the smarter way to manage classes, avoid scheduling conflicts, and optimize your study hours.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="size-10 rounded-full border-2 border-primary shadow-xl" alt="Testimonial" />
              ))}
            </div>
            <p className="text-white/60 text-sm font-bold tracking-tight">Joined by 2,000+ students this week</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl md:text-4xl font-black text-primary dark:text-white tracking-tighter mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold">
              {isLogin ? 'Sign in to access your dashboard' : 'Create your account to start planning'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary dark:focus:border-white/20 focus:ring-0 rounded-2xl h-14 pl-12 transition-all font-bold text-slate-900 dark:text-white"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="name@university.edu"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary dark:focus:border-white/20 focus:ring-0 rounded-2xl h-14 pl-12 transition-all font-bold text-slate-900 dark:text-white"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">alternate_email</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary dark:focus:border-white/20 focus:ring-0 rounded-2xl h-14 pl-12 transition-all font-bold text-slate-900 dark:text-white"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
              </div>
            </div>

            <button type="submit" className="mt-4 w-full bg-primary hover:bg-secondary text-white h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary dark:text-white hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign up for free' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
