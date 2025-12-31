"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Upload, AlertCircle, CheckCircle, Cloud } from "lucide-react"

const GENRES = ["Action", "Romance", "Thriller", "Sci-Fi", "Comedy", "Horror", "Fantasy", "Drama", "Documentary"]
const TYPES = ["movie", "series", "bonus episode"]

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "Action",
    type: "movie",
    year: new Date().getFullYear(),
    description: "",
    videoUrl: "",
    posterUrl: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setIsAuthenticated(true)
      setIsChecking(false)
    }

    checkAuth()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validate form
    if (
      !formData.title.trim() ||
      !formData.videoUrl.trim() ||
      !formData.posterUrl.trim() ||
      !formData.description.trim()
    ) {
      setMessage({ type: "error", text: "Harap isi semua field yang wajib" })
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage({ type: "error", text: "Anda harus login untuk upload film" })
        setLoading(false)
        return
      }

      const { error } = await supabase.from("movies").insert({
        title: formData.title.trim(),
        genre: formData.genre,
        type: formData.type,
        year: formData.year,
        description: formData.description.trim(),
        video_url: formData.videoUrl.trim(),
        poster_url: formData.posterUrl.trim(),
        uploaded_by: user.id,
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} "${formData.title}" berhasil diupload!`,
      })

      // Reset form
      setFormData({
        title: "",
        genre: "Action",
        type: "movie",
        year: new Date().getFullYear(),
        description: "",
        videoUrl: "",
        posterUrl: "",
      })

      // Redirect after success
      setTimeout(() => {
        router.push("/films")
      }, 2000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setMessage({ type: "error", text: "Terjadi kesalahan saat mengupload. Coba lagi nanti." })
    } finally {
      setLoading(false)
    }
  }

  if (isChecking) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">Upload Kamen Rider</h1>
          <p className="text-muted-foreground">Bagikan konten Kamen Rider favorit Anda dengan komunitas</p>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6 mb-8">
          <div className="flex gap-4">
            <Cloud className="text-secondary flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Petunjuk Upload</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pastikan Anda memiliki hak untuk membagikan konten tersebut</li>
                <li>• Gunakan URL yang valid untuk video dan poster</li>
                <li>• Berikan deskripsi yang jelas tentang series/movie/bonus episode</li>
                <li>• Pilih tipe konten dengan benar (series, movie, atau bonus episode)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`flex gap-4 rounded-lg p-6 mb-8 border ${
              message.type === "success"
                ? "bg-green-900/20 border-green-500/30 text-green-400"
                : "bg-red-900/20 border-red-500/30 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={24} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={24} className="flex-shrink-0" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
              Judul <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Contoh: Kamen Rider Wizard Episode 1"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
              required
            />
          </div>

          {/* Type, Genre and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-foreground mb-2">
                Tipe <span className="text-primary">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors appearance-none cursor-pointer"
                required
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block text-sm font-semibold text-foreground mb-2">
                Genre <span className="text-primary">*</span>
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors appearance-none cursor-pointer"
                required
              >
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-foreground mb-2">
                Tahun <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
              Deskripsi <span className="text-primary">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Jelaskan tentang series/movie ini, karakter utama, dan cerita singkatnya..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
              required
            />
          </div>

          {/* Video URL */}
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-semibold text-foreground mb-2">
              Link Video <span className="text-primary">*</span>
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/video.mp4"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">Format: MP4, MKV, atau streaming URL yang valid</p>
          </div>

          {/* Poster URL */}
          <div>
            <label htmlFor="posterUrl" className="block text-sm font-semibold text-foreground mb-2">
              Link Poster <span className="text-primary">*</span>
            </label>
            <input
              type="url"
              id="posterUrl"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/poster.jpg"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Format: JPG, PNG. Ukuran poster: 2:3 (contoh: 300x450px)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            {loading ? "Sedang Upload..." : "Upload Konten"}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Hosting Unlimited</h3>
            <p className="text-sm text-muted-foreground">Upload film dengan ukuran tak terbatas tanpa biaya tambahan</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <Upload className="text-secondary" size={24} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Mudah Dibagikan</h3>
            <p className="text-sm text-muted-foreground">
              Film Anda akan langsung tersedia untuk ditonton oleh komunitas
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-accent" size={24} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Aman dan Terpercaya</h3>
            <p className="text-sm text-muted-foreground">Data Anda dilindungi dengan enkripsi tingkat enterprise</p>
          </div>
        </div>
      </div>
    </main>
  )
}
