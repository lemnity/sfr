import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useReducedMotion } from 'motion/react'
import { useIntroReady } from '../intro'
import { TREX_LAYERS } from './trexLayers'

/*
 * 3D T-Rex built from stacked SVG slices, each pushed to its own depth with translateZ.
 * Adapted from "3D CSS & SVG T-REX" by Noah Blon (MIT) — see 3d-css/ —
 * recoloured to the site accent and sized to its container (container query units)
 * instead of the viewport.
 *
 * Geometry keeps the pen's proportions, scaled to the slice height H (in cqh, 1% of the
 * container height): slices 2.5% of H apart, the nearest 56.25% of H in front of the
 * stage plane at most (the farthest ~1.4×H behind it), perspective 375% of H.
 * Slice 0 is the farthest and faintest; the last one is the nearest, fully opaque.
 */

const COUNT = TREX_LAYERS.length
/** Slice height, cqh. */
const H = 62
/** Slot of the original 33-step depth scale that the first slice occupies. */
const DEPTH_STEPS = 33
const FILTER_ID = 'trexDropShadow'
/** Resting tilt, matching the pen. */
const REST = 'rotateX(10deg) rotateY(0deg)'

/** Depth (cqh) and opacity of slice `i` (0 = farthest). */
function layerStyle(i: number) {
  const n = i + 1
  const z = H * (0.5625 - 0.025 * (DEPTH_STEPS - n))
  const alpha = Math.min(1, (2.25 / DEPTH_STEPS) * n)
  return { z, alpha }
}

export default function HeroTrex({ label }: { label: string }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const ready = useIntroReady()
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery('(pointer: fine)', { noSsr: true })
  const follow = !reduce && finePointer

  // Turn toward the pointer; the long springy transition does the easing.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !follow) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
        const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
        stage.style.transform = `rotateX(${ny * -15 + 10}deg) rotateY(${nx * 28}deg)`
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      stage.style.transform = REST
    }
  }, [follow])

  return (
    <Box
      role="img"
      aria-label={label}
      sx={{ position: 'absolute', inset: 0, containerType: 'size' }}
    >
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <filter id={FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="-1" dy="-1" result="offsetblur" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>
      <Box
        ref={stageRef}
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          perspective: `${H * 3.75}cqh`,
          transformStyle: 'preserve-3d',
          transform: REST,
          transition: 'transform 2000ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          // Touch / no hover: a slow idle sway instead of pointer tracking.
          ...(!follow && !reduce
            ? {
                '@keyframes trexSway': {
                  '0%': { transform: 'rotateX(10deg) rotateY(-18deg)' },
                  '100%': { transform: 'rotateX(6deg) rotateY(18deg)' },
                },
                animation: 'trexSway 7s ease-in-out infinite alternate',
              }
            : {}),
        }}
      >
        {TREX_LAYERS.map((d, i) => {
          const { z, alpha } = layerStyle(i)
          return (
            <Box
              key={i}
              component="svg"
              viewBox="0 0 43.21 67.14"
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                height: `${H}cqh`,
                width: 'auto',
                aspectRatio: '43.21 / 67.14',
                overflow: 'visible',
                transform: `translate(-50%, -50%) rotateZ(180deg) translateZ(${z}cqh)`,
                // Deep olive → site lime toward the back so the silhouette reads on #030303.
                fill: `hsla(74, ${40 + (i / COUNT) * 35}%, ${18 + (i / COUNT) * 22}%, ${alpha})`,
                opacity: reduce ? 1 : 0,
                ...(reduce
                  ? {}
                  : {
                      '@keyframes trexIn': { to: { opacity: 1 } },
                      animation: ready ? `trexIn .75s ${0.25 + i * 0.05}s forwards` : 'none',
                    }),
                '& path': { filter: `url(#${FILTER_ID})` },
              }}
            >
              <path d={d} />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
