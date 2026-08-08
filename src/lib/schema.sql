-- ROOM APP — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users)
create table profiles (
  id uuid references auth.users(id) primary key,
  email text not null,
  full_name text not null,
  institution_id text,
  institution text,
  role text default 'student' check (role in ('student','faculty','institution','corporate')),
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- ROOMS
create table rooms (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text default 'class' check (type in ('class','team','project','private')),
  subject text,
  description text,
  owner_id uuid references profiles(id),
  code text unique not null,
  created_at timestamptz default now()
);
alter table rooms enable row level security;
create policy "Members can view rooms" on rooms for select using (
  exists (select 1 from room_members where room_id = rooms.id and user_id = auth.uid())
);
create policy "Authenticated users can create rooms" on rooms for insert with check (auth.uid() = owner_id);
create policy "Owners can update rooms" on rooms for update using (auth.uid() = owner_id);

-- ROOM MEMBERS
create table room_members (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'student' check (role in ('owner','faculty','student','member')),
  institution_id text,
  joined_at timestamptz default now(),
  unique(room_id, user_id)
);
alter table room_members enable row level security;
create policy "Members can view room members" on room_members for select using (
  exists (select 1 from room_members rm where rm.room_id = room_members.room_id and rm.user_id = auth.uid())
);
create policy "Anyone can join rooms" on room_members for insert with check (auth.uid() = user_id);

-- MESSAGES
create table messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id),
  content text,
  file_url text,
  file_name text,
  file_type text,
  created_at timestamptz default now()
);
alter table messages enable row level security;
create policy "Members can view messages" on messages for select using (
  exists (select 1 from room_members where room_id = messages.room_id and user_id = auth.uid())
);
create policy "Members can send messages" on messages for insert with check (
  exists (select 1 from room_members where room_id = messages.room_id and user_id = auth.uid())
);

-- NOTICES
create table notices (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id),
  title text not null,
  body text,
  priority text default 'normal' check (priority in ('normal','high')),
  created_at timestamptz default now()
);
alter table notices enable row level security;
create policy "Members can view notices" on notices for select using (
  exists (select 1 from room_members where room_id = notices.room_id and user_id = auth.uid())
);
create policy "Faculty can create notices" on notices for insert with check (
  exists (select 1 from room_members where room_id = notices.room_id and user_id = auth.uid() and role in ('owner','faculty'))
);

-- NOTICE READS (track who read what)
create table notice_reads (
  notice_id uuid references notices(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  read_at timestamptz default now(),
  primary key (notice_id, user_id)
);
alter table notice_reads enable row level security;
create policy "Users can manage own reads" on notice_reads for all using (auth.uid() = user_id);
create policy "Faculty can view reads" on notice_reads for select using (
  exists (select 1 from notices n join room_members rm on rm.room_id = n.room_id
    where n.id = notice_reads.notice_id and rm.user_id = auth.uid() and rm.role in ('owner','faculty'))
);

-- RESOURCES
create table resources (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id),
  name text not null,
  url text not null,
  size bigint,
  type text,
  pinned boolean default false,
  created_at timestamptz default now()
);
alter table resources enable row level security;
create policy "Members can view resources" on resources for select using (
  exists (select 1 from room_members where room_id = resources.room_id and user_id = auth.uid())
);
create policy "Members can upload resources" on resources for insert with check (
  exists (select 1 from room_members where room_id = resources.room_id and user_id = auth.uid())
);

-- ATTENDANCE
create table attendance (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id),
  session_date date not null,
  topic text,
  status text default 'present' check (status in ('present','absent','late')),
  marked_at timestamptz default now(),
  unique(room_id, user_id, session_date)
);
alter table attendance enable row level security;
create policy "Users can view own attendance" on attendance for select using (auth.uid() = user_id);
create policy "Faculty can view all attendance" on attendance for select using (
  exists (select 1 from room_members where room_id = attendance.room_id and user_id = auth.uid() and role in ('owner','faculty'))
);
create policy "Faculty can mark attendance" on attendance for insert with check (
  exists (select 1 from room_members where room_id = attendance.room_id and user_id = auth.uid() and role in ('owner','faculty'))
);

-- STORAGE BUCKET for resources
insert into storage.buckets (id, name, public) values ('resources', 'resources', true);
create policy "Members can upload" on storage.objects for insert with check (bucket_id = 'resources');
create policy "Anyone can view" on storage.objects for select using (bucket_id = 'resources');

-- Enable Realtime for messages
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notices;
