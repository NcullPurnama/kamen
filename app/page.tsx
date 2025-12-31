"use client"

import { useState, useEffect } from "react"
import MovieCard from "@/components/movie-card"
import { Play, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Movie {
  id: string
  title: string
  poster_url: string
  genre: string
  year: number
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from("movies").select("*").order("created_at", { ascending: false }).limit(8)

        setMovies(data || [])
      } catch (error) {
        console.error("[v0] Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-96 bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(166,85,255,0.1) 100%), url('/movie-cinema-backdrop.jpg')`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-4 text-foreground">Kamen Rider Hub</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            Tonton semua series, movie, dan bonus episode Kamen Rider terlengkap
          </p>
          <a
            href="/films"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto w-fit"
          >
            <Play size={24} />
            Jelajahi Koleksi
          </a>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-primary" size={28} />
          <h2 className="text-3xl font-bold text-foreground">Konten Terbaru</h2>
        </div>

        {/* Movie Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading konten...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={movie.poster_url}
                genre={movie.genre}
                rating={8}
                year={movie.year}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada konten yang diupload</p>
            <a href="/upload" className="inline-block text-primary hover:underline font-medium">
              Upload konten Kamen Rider sekarang
            </a>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Punya Koleksi Kamen Rider?</h3>
          <p className="text-lg text-muted-foreground mb-8">Upload series, movie, atau bonus episode favorit Anda</p>
          <a
            href="/upload"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Upload Sekarang
          </a>
        </div>
      </section>
    </main>
  )
}
