import { NextResponse } from 'next/server';
// Import the async server client we created in lib/server.ts
import { createClient } from '@/lib/server'; 

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // 1. Create the server client (Awaiting it because cookies() is async in Next.js 15)
    const supabase = await createClient(); 
    
    // 2. Exchange the temporary code for a permanent session
    // This helper automatically sets the cookies for you
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 3. Success! Send the user to the home page or the 'next' destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page if the exchange fails
  // It's helpful to redirect back to login with an error message
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}