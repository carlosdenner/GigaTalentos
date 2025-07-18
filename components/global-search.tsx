"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon, Clock, TrendingUp, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useDebounce } from "@/hooks/use-debounce"

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
}

export default function GlobalSearch({ className, placeholder = "Buscar..." }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 200)

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem('giga-recent-searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`)
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  // Handle search
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem('giga-recent-searches', JSON.stringify(updated))

    // Navigate to search page
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    setShowSuggestions(false)
    setQuery("")
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayedItems = query.length >= 2 ? suggestions : recentSearches.slice(0, 5)
  const showDropdown = showSuggestions && (displayedItems.length > 0 || query.length >= 2)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 bg-[#1a2942] border-none text-white placeholder:text-gray-400"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
        {!isLoading && query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {query.length >= 2 ? (
              <>
                {/* Search for current query */}
                <button
                  onClick={() => handleSearch()}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm"
                >
                  <SearchIcon className="h-4 w-4 text-emerald-600" />
                  <span>Buscar por "<strong>{query}</strong>"</span>
                </button>
                
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs text-gray-500 font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Sugestões
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </>
                )}
              </>
            ) : (
              // Recent searches
              recentSearches.length > 0 && (
                <>
                  <div className="px-3 py-1 text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Buscas Recentes
                  </div>
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
