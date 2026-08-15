-- Run this SQL in your Supabase SQL Editor to create the tables required for Quiz India

-- Create a table for User Profiles and Stats
create table if not exists public.user_profiles (
  id uuid references auth.users not null primary key,
  name text not null,
  class_level text,
  language text default 'en',
  xp integer default 0,
  level integer default 1,
  best_streak integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.user_profiles enable row level security;

-- Create Policies so users can only read/write their own profiles
create policy "Users can view their own profile."
  on user_profiles for select
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on user_profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on user_profiles for update
  using ( auth.uid() = id );

-- Set up Realtime (Optional, for future multiplayer)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table user_profiles;
