-- Add type column to movies table
ALTER TABLE public.movies ADD COLUMN type text DEFAULT 'movie';

-- Add constraint to ensure only valid types
ALTER TABLE public.movies ADD CONSTRAINT valid_movie_type 
CHECK (type IN ('series', 'movie', 'bonus episode'));

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS movies_type_idx ON public.movies(type);
