'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'
import { useBackground } from '@/contexts/BackgroundContext'
import GradientText from '@/TextAnimations/GradientText/GradientText'
import '@/TextAnimations/GradientText/GradientText.css'
import { Fredoka } from 'next/font/google'
import ThemeToggle from './ThemeToggle'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
})

interface BackgroundSliderProps {
  value: number
  onChange: (value: number) => void
  max: number
  labels: string[]
  textColors: {
    primary: string
    secondary: string
    accent: string
    slider?: string
  }
}

export default function BackgroundSlider({
  value,
  onChange,
  max,
  labels,
  textColors
}: BackgroundSliderProps) {
  const { getButtonColor, getButtonTextColor } = useBackground()

  const buttonColor = getButtonColor()
  const buttonTextColor = getButtonTextColor()

  // Important: don't read from document during initial render to avoid SSR/CSR mismatch
  const [isDark, setIsDark] = useState<boolean>(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const update = () => setIsDark((root.dataset.theme === 'dark') || root.classList.contains('dark'))

    update()
    const observer = new MutationObserver(() => update())
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => observer.disconnect()
  }, [])

  const clampedValue = useMemo(() => {
    const upper = Math.max(0, Math.min(max, value))
    return upper
  }, [value, max])

  return (
    <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto px-4">
      <motion.div
        className="relative rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
        style={{
          backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative background glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${buttonColor}, transparent 70%)`
          }}
        />

        {/* Theme toggle in top-right */}
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className={`${fredoka.className} text-2xl sm:text-3xl font-extrabold mb-2 text-center`}>
              <GradientText animationSpeed={6}>Customize Background</GradientText>
            </div>
            <p className={`text-sm sm:text-base font-medium opacity-80 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose the perfect atmosphere
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {labels.map((label, index) => {
              const isActive = index === clampedValue
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => onChange(index)}
                  className="relative group overflow-hidden rounded-xl p-3 text-sm font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: isActive
                      ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
                      : 'transparent',
                    color: isDark ? '#fff' : '#1f2937'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active Background Fill with Gradient */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 opacity-100"
                      style={{ backgroundColor: buttonColor }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Border for inactive items */}
                  {!isActive && (
                    <div className={`absolute inset-0 border-2 border-transparent group-hover:border-gray-300/50 rounded-xl transition-colors ${isDark ? 'group-hover:border-white/20' : ''}`} />
                  )}

                  <span className="relative z-10 flex items-center justify-center gap-2"
                    style={{ color: isActive ? buttonTextColor : 'inherit' }}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-current"
                      />
                    )}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
