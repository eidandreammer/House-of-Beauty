export type DiscountBannerConfig = {
  enabled: boolean
  percent?: string
  headline?: string
  subtext?: string
  ctaLabel?: string
  ctaHref?: string
  expiresAt?: string
  dismissible?: boolean
}

export function getDiscountBannerConfig(): DiscountBannerConfig {
  const enabled = (process.env.NEXT_PUBLIC_DISCOUNT_ENABLED || 'false').toLowerCase() === 'true'
  const percent = process.env.NEXT_PUBLIC_DISCOUNT_PERCENT || '15%'
  const headline = process.env.NEXT_PUBLIC_DISCOUNT_HEADLINE || `Limited‑time offer: Save ${percent}`
  const subtext = process.env.NEXT_PUBLIC_DISCOUNT_SUBTEXT || `Get ${percent} off any plan. New clients only.`
  const ctaLabel = process.env.NEXT_PUBLIC_DISCOUNT_CTA_LABEL || 'Claim Discount'
  const ctaHref = process.env.NEXT_PUBLIC_DISCOUNT_CTA_HREF || '/start'
  const expiresAt = process.env.NEXT_PUBLIC_DISCOUNT_EXPIRES_AT || ''
  const dismissible = (process.env.NEXT_PUBLIC_DISCOUNT_DISMISSIBLE || 'true').toLowerCase() === 'true'

  return {
    enabled,
    percent,
    headline,
    subtext,
    ctaLabel,
    ctaHref,
    expiresAt,
    dismissible,
  }
}

