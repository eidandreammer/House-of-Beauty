import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

import AnimatedText from './AnimatedText'
import './Masonry.css'

const useMedia = (queries, values, defaultValue) => {
  const get = () => values[queries.findIndex((query) => matchMedia(query).matches)] ?? defaultValue
  const [value, setValue] = useState(get)

  useEffect(() => {
    const handler = () => setValue(get)

    queries.forEach((query) => matchMedia(query).addEventListener('change', handler))

    return () => {
      queries.forEach((query) => matchMedia(query).removeEventListener('change', handler))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries])

  return value
}

const useMeasure = () => {
  const ref = useRef(null)
  const [size, setSize] = useState({ height: 0, width: 0 })

  useLayoutEffect(() => {
    if (!ref.current) {
      return undefined
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { height, width } = entry.contentRect
      setSize({ height, width })
    })

    resizeObserver.observe(ref.current)

    return () => resizeObserver.disconnect()
  }, [])

  return [ref, size]
}

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        }),
    ),
  )
}

function Masonry({
  animateFrom = 'bottom',
  blurToFocus = true,
  colorShiftOnHover = false,
  duration = 0.6,
  ease = 'power3.out',
  hoverScale = 0.95,
  items,
  scaleOnHover = true,
  stagger = 0.05,
}) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1,
  )
  const [containerRef, { width }] = useMeasure()
  const [imagesReady, setImagesReady] = useState(false)
  const hasMounted = useRef(false)

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (!containerRect) {
      return { x: item.x, y: item.y }
    }

    let direction = animateFrom

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right']
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 }
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 }
      case 'left':
        return { x: -200, y: item.y }
      case 'right':
        return { x: window.innerWidth + 200, y: item.y }
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useEffect(() => {
    let isCurrent = true

    preloadImages(items.map((item) => item.img)).then(() => {
      if (isCurrent) {
        setImagesReady(true)
      }
    })

    return () => {
      isCurrent = false
    }
  }, [items])

  const grid = useMemo(() => {
    if (!width) {
      return []
    }

    const colHeights = new Array(columns).fill(0)
    const columnWidth = width / columns

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const height = child.height / 2
      const y = colHeights[col]

      colHeights[col] += height

      return { ...child, h: height, w: columnWidth, x, y }
    })
  }, [columns, items, width])

  const listHeight = grid.reduce((height, item) => Math.max(height, item.y + item.h), 0)

  useLayoutEffect(() => {
    if (!imagesReady) {
      return
    }

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const animationProps = {
        height: item.h,
        width: item.w,
        x: item.x,
        y: item.y,
      }

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item)
        const initialState = {
          height: item.h,
          opacity: 0,
          width: item.w,
          x: initialPos.x,
          y: initialPos.y,
          ...(blurToFocus && { filter: 'blur(10px)' }),
        }

        gsap.fromTo(selector, initialState, {
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          delay: index * stagger,
          duration: 0.8,
          ease: 'power3.out',
          opacity: 1,
        })
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: 'auto',
        })
      }
    })

    hasMounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateFrom, blurToFocus, duration, ease, grid, imagesReady, stagger])

  const handleMouseEnter = (event, item) => {
    const element = event.currentTarget
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, {
        duration: 0.3,
        ease: 'power2.out',
        scale: hoverScale,
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')

      if (overlay) {
        gsap.to(overlay, {
          duration: 0.3,
          opacity: 0.3,
        })
      }
    }
  }

  const handleMouseLeave = (event, item) => {
    const element = event.currentTarget
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, {
        duration: 0.3,
        ease: 'power2.out',
        scale: 1,
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')

      if (overlay) {
        gsap.to(overlay, {
          duration: 0.3,
          opacity: 0,
        })
      }
    }
  }

  return (
    <div ref={containerRef} className="list" style={{ height: listHeight }}>
      {grid.map((item) => (
        <a
          key={item.id}
          aria-label={item.ariaLabel ?? (item.title ? `View ${item.title} on the menu` : 'View item')}
          className="item-wrapper"
          data-key={item.id}
          href={item.url}
          onMouseEnter={(event) => handleMouseEnter(event, item)}
          onMouseLeave={(event) => handleMouseLeave(event, item)}
        >
          <span className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && <span className="color-overlay" />}
            {item.title ? (
              <span className="item-label">
                <AnimatedText text={item.title} />
              </span>
            ) : null}
          </span>
        </a>
      ))}
    </div>
  )
}

export default Masonry
