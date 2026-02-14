'use client';
import { createClient } from '@/lib/supabase'; // Ensure you're using your client creator

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-indigo-100 p-6">
      
      {/* BRANDING DECORATION */}
      <div className="absolute top-10 left-10 hidden lg:block">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Smart <span className="text-blue-600">Bookmark</span>
        </h2>
      </div>

      {/* LOGIN CARD */}
      <div className="relative group p-1 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-[2.5rem] shadow-2xl transition-transform hover:scale-[1.01] duration-500">
        <div className="bg-white/90 backdrop-blur-xl p-10 sm:p-14 rounded-[2.4rem] text-center max-w-md w-full border border-white">
          
          {/* APP ICON / LOGO PLACEHOLDER */}
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-xl shadow-blue-200 mx-auto mb-8 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
             </svg>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Welcome back
          </h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Your personal digital archive. <br />
            Sign in to access your smart timeline.
          </p>
          
          <button
            onClick={handleGoogleLogin}
            className="group/btn flex items-center justify-center gap-4 w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 px-6 rounded-3xl transition-all shadow-xl shadow-slate-200 active:scale-95 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-12 group-hover/btn:translate-y-0 transition-transform duration-300" />
            
            <div className="p-1 bg-white rounded-lg relative z-10">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            </div>
            
            <span className="relative z-10 tracking-widest text-xs uppercase">Continue with Google</span>
          </button>

          <p className="mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Powered by Next.js 15 & Supabase
          </p>
        </div>
      </div>

      {/* FOOTER DECORATION */}
      <footer className="mt-12 text-slate-400 text-sm font-medium">
        &copy; 2026 Smart Bookmark Engine
      </footer>
    </div>
  );
}