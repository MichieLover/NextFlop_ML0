"use client"

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { HeroCarousel } from '@/components/hero-carousel'
import { ContentCarousel } from '@/components/content-carousel'
import { ContinueWatching } from '@/components/continue-watching'
import { MovieModal } from '@/components/movie-modal'

import { apiFetch } from '@/services/api'

// No mock data — fetch from backend via API Gateway

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recommendedItems, setRecommendedItems] = useState<any[]>([])
  const [trendingItems, setTrendingItems] = useState<any[]>([])
  const [popularItems, setPopularItems] = useState<any[]>([])
  const [acclaimedItems, setAcclaimedItems] = useState<any[]>([])
  const [newReleases, setNewReleases] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [rec, trending, popular, newR, acclaimed] = await Promise.all([
          apiFetch('/api/media/recommended?limit=6'),
          apiFetch('/api/media?limit=6'),
          apiFetch('/api/media/popular?limit=6'),
          apiFetch('/api/media/new-releases?limit=6'),
          apiFetch('/api/media?limit=6&sort=rating'),
        ])

        setRecommendedItems(rec.items || rec.media || rec || [])
        setTrendingItems(trending.items || trending.media || trending || [])
        setPopularItems(popular.items || popular.media || popular || [])
        setNewReleases(newR.items || newR.media || newR || [])
        setAcclaimedItems(acclaimed.items || acclaimed.media || acclaimed || [])
      } catch (err) {
        console.error('Failed to load media lists', err)
      }
    }

    load()
  }, [])

  const handleItemClick = async (id: string) => {
    try {
      const movie = await apiFetch(`/api/media/${id}`)
      setSelectedMovie(movie)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Failed to fetch movie details', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-16">
        <div className="space-y-8 pb-12">
          {/* Hero Carousel - Full width */}
          <HeroCarousel onItemClick={handleItemClick} />

          {/* Content sections with container */}
          <div className="container mx-auto px-4 space-y-8">
            {/* Continue Watching Section */}
              <ContinueWatching onItemClick={handleItemClick} />

            {/* Recommended Section */}
            <ContentCarousel title="Recomendado para ti" items={recommendedItems} onItemClick={handleItemClick} />

            {/* Trending Section */}
            <ContentCarousel title="En tendencia" items={trendingItems} onItemClick={handleItemClick} />

            {/* Popular This Week */}
            <ContentCarousel title="Populares esta semana" items={popularItems} onItemClick={handleItemClick} />

            {/* Acclaimed */}
            <ContentCarousel title="Aclamadas por la crítica" items={acclaimedItems} onItemClick={handleItemClick} />

            {/* New Releases */}
            <ContentCarousel title="Nuevas en la plataforma" items={newReleases} onItemClick={handleItemClick} />
          </div>
        </div>
      </main>

      {/* Movie Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  )
}
