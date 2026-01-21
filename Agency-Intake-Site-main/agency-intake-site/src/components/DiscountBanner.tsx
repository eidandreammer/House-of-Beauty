'use client'

import { motion } from 'framer-motion'
import { BadgePercent, Clock, ArrowRight, X } from 'lucide-react'
import { useBackground } from '@/contexts/BackgroundContext'
import { useEffect, useMemo, useState } from 'react'
import type { DiscountBannerConfig } from '@/lib/discount'

function timeUntil(expiresAt?: string) {
  if (!expiresAt) return ''
  const end = new Date(expiresAt)
  if (isNaN(end.getTime())) return ''
  const diffMs = end.getTime() - Date.now()
  if (diffMs <= 0) return 'Ends soon'
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `Ends in ${days} day${days === 1 ? '' : 's'}`
  if (hours > 0) return `Ends in ${hours} hour${hours === 1 ? '' : 's'}`
  return 'Ends soon'
}

export default function DiscountBanner({ config }: { config: DiscountBannerConfig }) {
  const { getButtonColor, getButtonTextColor } = useBackground()
  const [visible, setVisible] = useState(!!config.enabled)
  const [now, setNow] = useState(Date.now())

  const storageKey = 'discountBannerDismissed'

  useEffect(() => {
    setVisible(!!config.enabled)
  }, [config.enabled])

  useEffect(() => {
    if (!config.dismissible) return
    try {
      const v = localStorage.getItem(storageKey)
      if (v === '1') setVisible(false)
    } catch { }
  }, [config.dismissible])

  useEffect(() => {
    if (!config.expiresAt) return
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [config.expiresAt])

  const countdown = useMemo(() => timeUntil(config.expiresAt), [config.expiresAt, now])

  if (!visible) return null

  const bg = getButtonColor()
  const txt = getButtonTextColor()

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 sm:px-6"
    >
      <div
        className="relative overflow-hidden rounded-xl mt-4 mb-6"
        style={{
          background: `linear-gradient(135deg, #18181b 0%, #09090b 100%)`,
          color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        role="region"
        aria-label="Discount banner"
      >
        <div className="container mx-auto px-4">
          <div className="py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
            <div className="flex items-start md:items-center gap-3">
              <div className="shrink-0">
                <BadgePercent className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
              </div>
              <div>
                <div className="text-base md:text-lg font-semibold leading-snug">
                  {config.headline}
                </div>
                {config.subtext && (
                  <div className="text-sm/5 opacity-90">{config.subtext}</div>
                )}
                {!!countdown && (
                  <div className="mt-1 inline-flex items-center text-xs font-medium opacity-90 whitespace-nowrap">
                    <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                    {countdown}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <a
                href={config.ctaHref || '/start'}
                className="inline-flex items-center px-4 py-2 rounded-lg font-semibold whitespace-nowrap ring-1 ring-white/40 hover:ring-white/60 transition"
                style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                {config.ctaLabel || 'Claim Discount'}
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </a>
              {config.dismissible !== false && (
                <button
                  type="button"
                  aria-label="Dismiss discount banner"
                  className="p-2 rounded-md hover:bg-white/10 transition"
                  onClick={() => {
                    setVisible(false)
                    try { localStorage.setItem(storageKey, '1') } catch { }
                  }}
                  style={{ color: '#fff' }}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

