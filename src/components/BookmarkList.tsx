'use client';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase';

export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: any[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const supabase = useMemo(() => createClient(), []);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!userId) return;
    supabase.auth.getSession().then((res) => {
  console.log("SESSION:", res.data.session);
});

    const channel = supabase
      .channel(`live-feed-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          console.log('REALTIME EVENT:', payload);

          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => {
              const exists = prev.find((b) => b.id === payload.new.id);
              if (exists) return prev;
              return [payload.new, ...prev];
            });
          }

          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const handleDelete = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-bold tracking-tight">
          Your timeline is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-12">
      <div className="absolute left-1 sm:left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-400 to-slate-200 rounded-full" />

      <ul className="space-y-8">
        {bookmarks.map((b) => (
          <li key={b.id} className="relative group">
            <div className="absolute -left-[25px] sm:-left-[39px] top-8 h-4 w-4 rounded-full border-4 border-slate-50 bg-blue-600 shadow-md z-10 group-hover:scale-125 transition-transform duration-300" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-start gap-4 min-w-0">
                <div className="shrink-0 h-14 w-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    src={getFaviconUrl(b.url) || ''}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="shrink-0 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg tracking-tighter">
                      {new Date(b.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-xl truncate tracking-tight uppercase">
                      {b.title}
                    </h3>
                  </div>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-blue-500 hover:text-indigo-600 hover:underline truncate block italic transition-colors"
                  >
                    {b.url}
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleDelete(b.id)}
                className="self-end sm:self-center p-4 text-slate-300 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-orange-500 rounded-2xl transition-all duration-300 shadow-sm border border-slate-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
