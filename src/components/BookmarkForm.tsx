'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function BookmarkForm() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('bookmarks').insert([{ title, url }]);

    if (error) {
      console.error(error.message);
      alert('Failed to add bookmark.');
    } else {
      setTitle('');
      setUrl('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
            Content Title
          </label>
          <input
            type="text"
            placeholder="e.g. Next.js Docs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
            Resource URL
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400"
            required
          />
        </div>
        
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Broadcasting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add to Timeline
          </>
        )}
      </button>
    </form>
  );
}