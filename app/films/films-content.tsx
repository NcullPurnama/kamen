"use client"

import { useState, useMemo, useEffect } from "react"
import MovieCard from "@/components/movie-card"
import { Search, Filter, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Movie {
  id: string
  title: string
  poster_url: string
  genre: string
  type: string
  year: number
}

const GENRES = ["All", "Action", "Romance", "Thriller", "Sci-Fi", "Comedy", "Horror", "Fantasy", "Drama", "Documentary"]
const TYPES = ["All", "movie", "series", "bonus episode"]

export default function FilmsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [showFilters, setShowFilters] = useState(true)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setMovies(data || [])
      } catch (err) {
        console.error("[v0] Error fetching movies:", err)
        setError("Gagal memuat konten. Coba refresh halaman.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Filter movies based on search, genre, and type
  const filteredMovies = useMemo(() => {
    let result = movies

    // Filter by type
    if (selectedType !== "All") {
      result = result.filter((movie) => movie.type === selectedType)
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      result = result.filter((movie) => movie.genre === selectedGenre)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return result
  }, [searchQuery, selectedGenre, selectedType, movies])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedGenre("All")
    setSelectedType("All")
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">Kamen Rider Collection</h1>
            <p className="text-muted-foreground">Jelajahi koleksi Kamen Rider terlengkap</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <p className="text-muted-foreground">Loading konten...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">Kamen Rider Collection</h1>
          <p className="text-muted-foreground">Jelajahi koleksi Kamen Rider terlengkap</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <div className="sticky top-20 bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-muted-foreground hover:text-foreground"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Tipe</h3>
                <div className="space-y-2">
                  {TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                        selectedType === type
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {type === "All" ? "Semua" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Genre</h3>
                <div className="space-y-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                        selectedGenre === genre
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedGenre !== "All" || selectedType !== "All") && (
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari Kamen Rider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground font-medium hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              Show Filters
            </button>

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
              <p className="text-muted-foreground">
                Menampilkan <span className="font-bold text-foreground">{filteredMovies.length}</span> konten
                {selectedType !== "All" && ` • Tipe: ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
                {selectedGenre !== "All" && ` • Genre: ${selectedGenre}`}
              </p>
            </div>

            {error ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Reload Page
                </button>
              </div>
            ) : filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMovies.map((movie) => (
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
              <div className="flex flex-col items-center justify-center py-16">
                <Search size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Tidak ada konten ditemukan</h3>
                <p className="text-muted-foreground text-center mb-6">Coba ubah filter atau pencarian Anda</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
