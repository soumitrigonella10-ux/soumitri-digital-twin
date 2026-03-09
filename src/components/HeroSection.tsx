"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

/* Inline SVG for the wavy underline beneath "system" */
function WavyUnderline() {
  return (
    <svg
      className="manifesto-wavy"
      viewBox="0 0 120 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 4 C10 0, 20 8, 30 4 S50 0, 60 4 S80 8, 90 4 S110 0, 120 4"
        stroke="#8B2323"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

/* Fingerprint icon — a delicate digital-seal accent */
function FingerprintIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-300"
    >
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
      <path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6 1.7 0 3.2.7 4.3 1.8" />
      <path d="M12 10a2 2 0 0 0-2 2c0 3-1.5 6-3 7.5" />
      <path d="M20 8.5c.7 1 1 2.2 1 3.5 0 4-1 7-2.5 9" />
      <path d="M14 12c0 2.5-.5 5-1.5 7" />
      <path d="M17.5 12c0 1-.5 3.5-1.5 6" />
    </svg>
  )
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [showTelugu, setShowTelugu] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => setShowTelugu((v) => !v), 3000)
    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) return null

  return (
    <section className="relative h-screen overflow-hidden" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Main content grid */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-2">

        {/* ─── Left column — Manifesto ─── */}
        <div className="relative flex items-center px-10 lg:px-16 xl:px-24 overflow-hidden">

          {/* Background Telugu glyph — cultural watermark */}
          <span
            className="absolute select-none pointer-events-none font-serif"
            style={{
              fontSize: 'clamp(320px, 40vw, 520px)',
              lineHeight: 1,
              color: 'rgba(139, 35, 35, 0.04)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -55%)',
            }}
            aria-hidden="true"
          >
            సౌ
          </span>

          {/* Fingerprint — digital seal of authenticity */}
          <div className="absolute top-8 right-8 opacity-60">
            <FingerprintIcon />
          </div>

          {/* Text content */}
          <div className="relative z-10 max-w-xl w-full">

            {/* Greeting line */}
            <p
              className="font-serif italic text-lg sm:text-xl lg:text-2xl tracking-wide"
              style={{ color: '#999' }}
            >
              Hello! You are looking at&hellip;
            </p>

            {/* Subject — animated toggle between English & Telugu */}
            <h1
              className="font-serif font-medium text-3xl sm:text-4xl lg:text-5xl mt-2 tracking-tight relative"
              style={{ color: '#2d2d2d', lineHeight: 1.4, height: '1.4em' }}
            >
              <span
                className="absolute left-0 top-0 inline-block transition-all duration-700 ease-in-out whitespace-nowrap"
                style={{
                  opacity: showTelugu ? 0 : 1,
                  transform: showTelugu ? 'translateY(-40%)' : 'translateY(0)',
                }}
              >
                Soumitri Digital Twin
              </span>
              <span
                className="absolute left-0 top-0 inline-block transition-all duration-700 ease-in-out whitespace-nowrap"
                style={{
                  opacity: showTelugu ? 1 : 0,
                  transform: showTelugu ? 'translateY(0)' : 'translateY(40%)',
                }}
              >
                సౌమిత్రి డిజిటల్ ట్విన్
              </span>
            </h1>

            {/* Archival rule */}
            <hr
              className="my-6 border-0"
              style={{ height: '1px', background: 'rgba(0,0,0,0.10)' }}
            />

            {/* Manifesto body */}
            <div className="space-y-5 font-editorial text-2xl sm:text-3xl lg:text-[2.1rem] font-light leading-relaxed" style={{ color: '#3a3a3a' }}>
              <p>
                I could have maintained a {' '}
                <span
                  className="font-serif italic font-medium"
                  style={{ color: '#8B2323' }}
                >
                  journal.
                </span>
              </p>

              <p>
                I could have made spreadsheets. BUT!
              </p>

              <p className="font-editorial font-black text-4xl sm:text-5xl lg:text-[3.25rem] leading-tight" style={{ color: '#1a1a1a' }}>
                I built a{' '}
                <span className="relative inline-block">
                  system.
                  <WavyUnderline />
                </span>
              </p>
            </div>

            {/* Coda — optional quiet closer */}
            <p
              className="mt-10 font-serif italic text-base sm:text-lg tracking-wide"
              style={{ color: '#bbb' }}
            >
              Why make my thoughts only a me problem.
            </p>
          </div>
        </div>

        {/* ─── Right column — Portrait (UNTOUCHED) ─── */}
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
