-- Run once against the database to set up tables.
-- See scripts/init-db.mjs for how this gets applied.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  token uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pet_type text not null,
  description text not null,
  price numeric not null,
  status text not null default 'open' check (status in ('open', 'claimed')),
  poster_id uuid not null references users (id),
  poster_name text not null,
  poster_contact text not null,
  responder_id uuid references users (id),
  responder_name text,
  responder_contact text,
  created_at timestamptz not null default now()
);

create index if not exists requests_poster_id_idx on requests (poster_id);
create index if not exists sessions_user_id_idx on sessions (user_id);
