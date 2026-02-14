import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Await the cookies() promise to get the actual cookie store
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Now that we've awaited cookieStore, .set() is available
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The 'set' method can only be called in Server Actions or Route Handlers
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The 'delete' method can only be called in Server Actions or Route Handlers
          }
        },
      },
    }
  )
}