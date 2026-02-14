import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import LogoutButton from '@/components/LogoutButton'; // Import the new button

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: initialBookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Updated Header with Logout Button */}
        <header className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Smart <span className="text-slate-800">Bookmark</span>
            </h1>
            <p className="text-slate-500 font-medium">Smart Bookmark Engine</p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full inline-block mb-1 tracking-widest">
                ACTIVE SESSION
              </div>
              <p className="text-sm text-slate-700 font-bold">{user.email}</p>
            </div>
            
            {/* CALLING THE LOGOUT BUTTON HERE */}
            <LogoutButton />
          </div>
        </header>

        <section className="bg-white/80 backdrop-blur-lg p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Capture Link</h2>
          <BookmarkForm />
        </section>

        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Feed</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Timeline Active</span>
            </div>
          </div>
          <BookmarkList initialBookmarks={initialBookmarks || []} userId={user.id} />
        </section>
      </div>
    </main>
  );
}