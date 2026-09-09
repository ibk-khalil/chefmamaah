import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'

// Every photo in /public/images/gallery, inspected individually so captions match what is actually shown.
const ITEMS = [
  { id: 1, src: '/images/gallery/dish-01.jpeg', alt: 'Chicken jollof-style rice with sweetcorn, a beef stew with mashed potatoes, and a watermelon mocktail' },
  { id: 2, src: '/images/gallery/dish-02.jpeg', alt: 'Sesame bread rolls served with efo and ogbono stew' },
  { id: 3, src: '/images/gallery/dish-03.jpeg', alt: 'Orzo pasta salad and a Caesar salad with croutons and shaved parmesan' },
  { id: 4, src: '/images/gallery/dish-04.jpeg', alt: 'Pan-seared meat in pepper sauce with mashed potatoes and sliced avocado' },
  { id: 5, src: '/images/gallery/dish-05.jpeg', alt: 'Freshly baked sesame-seed bagels' },
  { id: 6, src: '/images/gallery/behind-scenes-01.jpeg', alt: 'Blueberry streusel muffins fresh out of the oven' },
  { id: 7, src: '/images/gallery/behind-scenes-02.jpeg', alt: 'Jollof rice, garden salad, and grilled fish platter with a watermelon mocktail' },
  { id: 8, src: '/images/gallery/classes-flyer.png', alt: 'Sesame bread rolls fresh out of the oven' },
  { id: 9, src: '/images/gallery/class-session-01.png', alt: 'Golden sesame dinner rolls baked in a round pan' },
  { id: 10, src: '/images/gallery/class-session-02.jpeg', alt: 'Spiced rice with roast chicken, vegetable orzo, and a fruit dessert spread' },
  { id: 11, src: '/images/gallery/class-session-03.jpeg', alt: 'Herbed rice with garden salad and grilled beef suya skewers' },
  { id: 12, src: '/images/gallery/event-01.jpeg', alt: 'Global Palate 2-week culinary masterclass flyer, fees 250,000 naira' },
  { id: 13, src: '/images/gallery/event-02.jpeg', alt: 'Global Palate 1-week private culinary masterclass flyer, fees 400,000 naira' },
  { id: 14, src: '/images/gallery/gallery-01.jpeg', alt: 'Global Palate 1-week private culinary masterclass flyer, fees 400,000 naira' },
  { id: 15, src: '/images/gallery/gallery-02.jpeg', alt: 'Chicken jollof-style rice with sweetcorn, a beef stew with mashed potatoes, and a watermelon mocktail' },
  { id: 16, src: '/images/gallery/gallery-03.jpeg', alt: 'Sesame bread rolls served with efo and ogbono stew' },
  { id: 17, src: '/images/gallery/gallery-04.jpeg', alt: 'Orzo pasta salad and a Caesar salad with croutons and shaved parmesan' },
  { id: 18, src: '/images/gallery/gallery-05.jpeg', alt: 'Pan-seared meat in pepper sauce with mashed potatoes and sliced avocado' },
  { id: 19, src: '/images/gallery/gallery-06.jpeg', alt: 'Freshly baked sesame-seed bagels' },
  { id: 20, src: '/images/gallery/gallery-07.jpeg', alt: 'Blueberry streusel muffins fresh out of the oven' },
  { id: 21, src: '/images/gallery/gallery-08.jpeg', alt: 'Jollof rice, garden salad, and grilled fish platter with a watermelon mocktail' },
  { id: 22, src: '/images/gallery/gallery-09.jpeg', alt: 'Sesame bread rolls fresh out of the oven' },
  { id: 23, src: '/images/gallery/gallery-10.jpeg', alt: 'Golden sesame dinner rolls baked in a round pan' },
]

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const openLightbox = (item) => {
    setIsPlaying(false)
    setLightboxIndex(ITEMS.findIndex((i) => i.id === item.id))
  }

  const startSlideshow = () => {
    setLightboxIndex(0)
    setIsPlaying(true)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    setIsPlaying(false)
  }, [])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % ITEMS.length))
  }, [])

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + ITEMS.length) % ITEMS.length))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, next, prev, closeLightbox])

  // Autoplay for slideshow mode
  useEffect(() => {
    if (!isPlaying || lightboxIndex === null) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [isPlaying, lightboxIndex, next])

  const current = lightboxIndex !== null ? ITEMS[lightboxIndex] : null

  return (
    <>
      <PageHeader title="Gallery" crumb="Home / Gallery" />

      <section className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="flex justify-center mb-12">
          <button
            onClick={startSlideshow}
            className="focus-ring rounded-full px-6 py-3 text-sm font-medium bg-champagne text-white hover:brightness-95 inline-flex items-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            View Slideshow
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 [&>*:nth-child(3n+1)]:md:row-span-2">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => openLightbox(item)}
              className="focus-ring aspect-square rounded-lg overflow-hidden group relative"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX / SLIDESHOW */}
      {current && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 text-white/80">
            <p className="text-sm">
              {lightboxIndex + 1} / {ITEMS.length}
              {isPlaying && <span className="ml-2 text-champagne">Slideshow</span>}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="focus-ring rounded p-2 hover:text-white"
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={closeLightbox} className="focus-ring rounded p-2 hover:text-white" aria-label="Close">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-4 md:px-16 pb-6">
            <button
              onClick={prev}
              className="focus-ring absolute left-2 md:left-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <img
              key={current.id}
              src={current.src}
              alt={current.alt}
              className="max-h-[75vh] max-w-full object-contain rounded"
            />

            <button
              onClick={next}
              className="focus-ring absolute right-2 md:right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
