-- ============================================
-- LORD Community — Supabase Schema (all-in-one)
-- ============================================

create extension if not exists "pgcrypto";

create table if not exists members (
  member_id text primary key default ('FP-' || floor(random()*9000+1000)::int),
  full_name text not null,
  age int,
  game_id text not null,
  username text not null,
  position text not null check (position in ('CB','CM','WF','ST')),
  whatsapp text,
  avatar_url text,
  qr_code text,
  status text default 'offline',
  join_date timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  nickname text,
  message text,
  created_at timestamptz default now()
);

create table if not exists stats (
  id int primary key default 1,
  total_members int default 0,
  online_members int default 0,
  new_members_today int default 0,
  activity_today int default 0,
  cb_count int default 0,
  cm_count int default 0,
  wf_count int default 0,
  st_count int default 0
);
insert into stats (id) values (1) on conflict (id) do nothing;

create table if not exists chats (
  conversation_id text primary key default ('CHAT-' || substr(md5(random()::text),1,10)),
  visitor_name text default 'Pengunjung',
  status text default 'open',
  admin_unread int default 0,
  visitor_unread int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text references chats(conversation_id) on delete cascade,
  sender text check (sender in ('admin','visitor')),
  sender_name text,
  text text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table chats;
alter publication supabase_realtime add table members;
alter publication supabase_realtime add table activities;
alter publication supabase_realtime add table stats;

alter table members enable row level security;
alter table activities enable row level security;
alter table stats enable row level security;
alter table chats enable row level security;
alter table chat_messages enable row level security;

create policy "public read members" on members for select using (true);
create policy "public insert members" on members for insert with check (true);
create policy "public read activities" on activities for select using (true);
create policy "public insert activities" on activities for insert with check (true);
create policy "public read stats" on stats for select using (true);
create policy "public update stats" on stats for update using (true);
create policy "public all chats" on chats for all using (true) with check (true);
create policy "public all chat_messages" on chat_messages for all using (true) with check (true);
