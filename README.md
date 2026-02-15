Smart Bookmark App

Live URL:
https://smart-bookmark-app-six-phi.vercel.app/

Overview

Smart Bookmark App is a full-stack web application that allows users to securely manage personal bookmarks with Google authentication, private data access, and real-time synchronization across browser tabs.

Built using Next.js App Router, Supabase, and Tailwind CSS, and deployed on Vercel.

Features:

Google OAuth authentication (no email/password)

Add bookmarks (title + URL)

Delete bookmarks

Private data per user using Row Level Security (RLS)

Real-time updates without page refresh

Fully deployed on Vercel

Tech Stack

Frontend:

Next.js (App Router)

React

Tailwind CSS

Backend:

Supabase

Auth (Google OAuth)

PostgreSQL Database

Realtime subscriptions

Deployment:
Vercel
Database Schema
Table: bookmarks
Column	Type	Description
id	uuid (PK)	Unique bookmark ID
title	text	Bookmark title
url	text	Bookmark URL
user_id	uuid	References auth.users
created_at	timestamp	Auto-generated
Security (Row Level Security)
RLS is enabled on the bookmarks table.
Policies:

SELECT
USING (auth.uid() = user_id)

INSERT
WITH CHECK (auth.uid() = user_id)

DELETE
USING (auth.uid() = user_id)


This ensures:

Users can only see their own bookmarks

Users cannot access or modify other users’ data

Real-Time Implementation

Supabase Realtime is used to listen for database changes.

Subscription:

supabase
  .channel(`bookmarks-user-${user.id}`)
  .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bookmarks',
      filter: `user_id=eq.${user.id}`
  }, handler)
  .subscribe()


Behavior:

If a bookmark is added in one tab, it appears instantly in another tab.

If a bookmark is deleted, it disappears instantly.

No manual refresh required.

Problems Faced & Solutions
1. Realtime Not Triggering

Problem:
Subscription connected but no realtime events were received.

Cause:
Realtime filter did not match RLS policy, so Supabase silently blocked events.

Solution:
Added:

filter: `user_id=eq.${user.id}`


This aligned the subscription with the RLS policy.

2. RLS Blocking Data

Problem:
Users could not see inserted rows during testing.

Cause:
Missing RLS policies for SELECT and INSERT.

Solution:
Explicitly defined policies using:

auth.uid() = user_id

3. OAuth Redirect Issues in Production

Problem:
Google login failed after Vercel deployment.

Solution:

Added production URL to Supabase Redirect URLs

Added Vercel domain to Google Cloud OAuth settings

Configured environment variables in Vercel

Running Locally

Clone repository

git clone <repo-url>
cd smart-bookmark-app


Install dependencies

npm install


Create .env.local

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key


Start development server

npm run dev

Conclusion:
This project demonstrates:
Secure authentication using OAuth
Proper database access control with RLS
Real-time data synchronization

Full-stack integration using Next.js and Supabase

Production deployment with environment configuration
