import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'


export const runtime = 'nodejs'

export default async function FilmDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()
  
  const { data: movie, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (error || !movie) {
    console.error('Error fetching movie:', error)
    notFound()
  }
  
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link 
          href="/films"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali ke Films
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={movie.poster_url || '/placeholder.svg'}
                alt={movie.title}
                className="w-full rounded-lg border border-border shadow-2xl"
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                {movie.type}
              </span>
              <span className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium">
                {movie.genre}
              </span>
              <span className="px-4 py-2 bg-card border border-border rounded-full text-sm">
                {movie.year}
              </span>
            </div>
            
            {movie.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Sinopsis</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.description}
                </p>
              </div>
            )}
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Informasi</h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="font-semibold text-foreground w-32">Judul:</span>
                  <span className="text-muted-foreground">{movie.title}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-foreground w-32">Tipe:</span>
                  <span className="text-muted-foreground capitalize">{movie.type}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-foreground w-32">Genre:</span>
                  <span className="text-muted-foreground">{movie.genre}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-foreground w-32">Tahun:</span>
                  <span className="text-muted-foreground">{movie.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}