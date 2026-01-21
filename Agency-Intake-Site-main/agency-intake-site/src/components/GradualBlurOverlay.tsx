'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import GradualBlur from '@/Animations/GradualBlur/GradualBlur';

type GradualBlurOverlayProps = Readonly<{
  className?: string;
}>;

const GradualBlurOverlay = ({ className }: GradualBlurOverlayProps) => {
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Create a fixed container once so the blur can span the viewport without affecting SSR markup.
    const node = document.createElement('div');
    node.className = 'gradual-blur-overlay-container';
    node.style.position = 'fixed';
    node.style.left = '0';
    node.style.right = '0';
    node.style.top = '0';
    node.style.bottom = '0';
    node.style.pointerEvents = 'none';
    // Keep the portal above the main content z-index (set to 1 in globals.css) while staying below interactive nav layers.
    node.style.zIndex = '1000';

    document.body.appendChild(node);
    setPortalNode(node);

    return () => {
      document.body.removeChild(node);
      setPortalNode(null);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      const current = Math.min(Math.max(window.scrollY || window.pageYOffset, 0), maxScroll);
      const next = current / maxScroll;

      setScrollProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    };

    updateProgress();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  if (!portalNode) {
    return null;
  }

  const clampedProgress = Math.min(1, Math.max(0, scrollProgress));
  const fadeFactor = 1 - clampedProgress;
  const dynamicStrength = 5 * fadeFactor;
  const dynamicDivCount = Math.max(0, Math.round(10 * fadeFactor));
  const dynamicOpacity = fadeFactor;

  return createPortal(
    <GradualBlur
      className={className}
      position="bottom"
      target="parent"
      exponential
      strength={dynamicStrength}
      divCount={dynamicDivCount}
      opacity={dynamicOpacity}
    />,
    portalNode,
  );
};

export default GradualBlurOverlay;
