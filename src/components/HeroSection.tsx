"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative h-screen overflow-hidden" style={{ backgroundColor: '#FDF5E6' }}>
      {/* Side vertical text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', color: '#FFB300' }}
        >
          Product Designer
        </p>
      </div>

      {/* Main content grid */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left column - Text content */}
        <div className="flex items-center justify-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-xl w-full space-y-8">
            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extralight tracking-tight" style={{ color: '#8B2323' }}>
                Hello
              </h1>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg font-light max-w-md leading-relaxed" style={{ color: '#6b6b6b' }}>
                I craft meaningful digital experiences through intentional design and thoughtful systems.
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Portrait image */}
        <div className="relative overflow-hidden flex items-end justify-center" style={{ backgroundColor: '#f5e6d3' }}>
          <Image
            src="/soumitri.png"
            alt="Portrait"
            width={400}
            height={500}
            className="w-3/4 lg:w-4/5 max-h-[85%] object-contain grayscale"
            priority
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <a 
        href="#archive"
        className="absolute bottom-8 left-8 flex items-center gap-2 text-xs tracking-widest uppercase animate-bounce hover:opacity-80 transition-opacity cursor-pointer"
        style={{ color: '#FFB300' }}
      >
        <span>Scroll down</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </a>
    </section>
  )
}
