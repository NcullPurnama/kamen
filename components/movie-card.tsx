import Link from "next/link"

interface MovieCardProps {
  id: string
  title: string
  poster: string
  genre: string
  rating: number
  year: number
}

export default function MovieCard({ id, title, poster, genre, rating, year }: MovieCardProps) {
  return (
    <Link href={`/films/${id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
        {/* Poster Image */}
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={poster || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-primary text-sm font-semibold mb-1">Watch Now</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-foreground line-clamp-2 mb-2 text-pretty">{title}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{genre}</span>
            <span className="text-sm font-semibold text-accent">{rating}/10</span>
          </div>
          <p className="text-xs text-muted-foreground">{year}</p>
        </div>
      </div>
    </Link>
  )
}
