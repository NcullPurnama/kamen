-- Create movies table
create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  genre text not null,
  year integer,
  rating decimal(3,1),
  video_url text not null,
  poster_url text,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.movies enable row level security;

-- Anyone can view all movies
create policy "movies_select_all"
  on public.movies for select
  using (true);

-- Only the uploader can insert their own movies
create policy "movies_insert_own"
  on public.movies for insert
  with check (auth.uid() = uploaded_by);

-- Only the uploader can update their own movies
create policy "movies_update_own"
  on public.movies for update
  using (auth.uid() = uploaded_by);

-- Only the uploader can delete their own movies
create policy "movies_delete_own"
  on public.movies for delete
  using (auth.uid() = uploaded_by);

-- Create index for faster queries
create index if not exists movies_genre_idx on public.movies(genre);
create index if not exists movies_uploaded_by_idx on public.movies(uploaded_by);
