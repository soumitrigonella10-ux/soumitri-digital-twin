"use client"

import { useEffect, useState } from "react"

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
        <div className="relative overflow-hidden" style={{ backgroundColor: '#f5e6d3' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Placeholder for portrait - replace with actual image */}
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f5e6d3, #e8d5b7, #dbc4a0)' }}>
              <div className="text-center" style={{ color: '#8B2323' }}>
                <svg
                  className="w-32 h-32 mx-auto mb-4 opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm font-light tracking-wider uppercase opacity-40">Portrait Image</p>
              </div>
            </div>
            {/* Replace above with actual image: */}
            {/* <img
              src="/images/portrait.jpg"
              alt="Portrait"
              className="w-full h-full object-cover grayscale"
            /> */}
          </div>
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
