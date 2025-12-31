"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface User {
  email: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user ? { email: user.email || "" } : null)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
    window.location.href = "/"
  }

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">CineWox</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/films" className="text-foreground hover:text-primary transition-colors font-medium">
              Films
            </Link>
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <Link
                      href="/upload"
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Upload
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/films"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Films
            </Link>
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground border-t border-border mt-2 pt-4">
                      {user.email}
                    </div>
                    <Link
                      href="/upload"
                      className="block px-4 py-2 text-primary font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Upload Film
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-primary font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
