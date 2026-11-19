import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { colors, fonts, microLabel } from '../theme'
import { useLang } from '../i18n'

/*
 * SAFAROFF preloader. The wordmark rises letter by letter while lime contour
 * "slices" fan out behind it — the same stacked-slice idea as the hero T-Rex.
 * A hairline bar and a 000→100 counter track progress; on exit the screen
 * lifts away like a curtain.
 */

const WORD = 'SAFAROFF'
/** Contour slices behind the solid word. */
const SLICES = 6
/** Offset between slices, em. */
const SLICE_STEP = 0.028
/** Shortest time the loader stays up, and a hard cap so a slow `load` never blocks the page. */
const MIN_VISIBLE_MS = 2600
const MAX_VISIBLE_MS = 6000
const ease = [0.22, 1, 0.36, 1] as const
const curtain = [0.76, 0, 0.24, 1] as const

/** Lock page scroll while the overlay is up. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [active])
}

/** True once the window `load` event has fired. */
function useWindowLoaded() {
  const [loaded, setLoaded] = useState(() => document.readyState === 'complete')
  useEffect(() => {
    if (loaded) return
    const onLoad = () => setLoaded(true)
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [loaded])
  return loaded
}

/**
 * Bar + counter. Progress follows elapsed time up to 92% and only completes once
 * the page has loaded; written straight to the DOM so React doesn't re-render per frame.
 */
function Progress({ loaded }: { loaded: boolean }) {
  const barRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const loadedRef = useRef(loaded)

  useEffect(() => {
    loadedRef.current = loaded
  }, [loaded])

  useEffect(() => {
    let frame = 0
    let shown = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_VISIBLE_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      const target = loadedRef.current ? eased : Math.min(eased, 0.92)
      shown += (target - shown) * 0.12
      if (target === 1 && 1 - shown < 0.004) shown = 1
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`
      if (numRef.current) numRef.current.textContent = String(Math.round(shown * 100)).padStart(3, '0')
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <Box sx={{ position: 'relative', height: '1px', bgcolor: 'rgba(244,241,236,0.12)', overflow: 'hidden' }}>
        <Box
          ref={barRef}
          sx={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            bgcolor: colors.gold,
            boxShadow: `0 0 12px ${colors.gold}`,
          }}
        />
      </Box>
      <Box
        component="span"
        ref={numRef}
        sx={{ fontVariantNumeric: 'tabular-nums', color: colors.text, minWidth: '3ch', textAlign: 'right' }}
      >
        000
      </Box>
    </>
  )
}

/** The solid word: each letter slides up from behind a mask. */
function SolidWord() {
  return (
    <Box component="span" sx={{ position: 'relative', display: 'flex', color: colors.text }}>
      {[...WORD].map((ch, i) => (
        <Box key={i} component="span" sx={{ display: 'block', overflow: 'hidden', pb: '0.06em', mb: '-0.06em' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease }}
          >
            {ch}
          </motion.span>
        </Box>
      ))}
    </Box>
  )
}

export default function Loader({ label, onDone }: { label: string; onDone: () => void }) {
  const reduce = useReducedMotion()
  const loaded = useWindowLoaded()
  const { hero } = useLang().t
  const [minElapsed, setMinElapsed] = useState(false)
  const [maxElapsed, setMaxElapsed] = useState(false)
  // Reduced motion: no loader at all, the page appears immediately.
  const visible = !reduce && !((loaded && minElapsed) || maxElapsed)
  const done = useCallback(() => onDone(), [onDone])

  useEffect(() => {
    if (reduce) return
    const min = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS)
    const max = window.setTimeout(() => setMaxElapsed(true), MAX_VISIBLE_MS)
    return () => {
      window.clearTimeout(min)
      window.clearTimeout(max)
    }
  }, [reduce])

  useEffect(() => {
    if (!visible) done()
  }, [visible, done])

  useScrollLock(visible)

  const caption = { ...microLabel, fontSize: { xs: 9, md: 10 }, letterSpacing: '0.3em', color: colors.muted }

  return (
    <AnimatePresence>
      {visible && (
        <Box
          key="loader"
          component={motion.div}
          role="status"
          aria-live="polite"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1, ease: curtain } }}
          sx={{
            position: 'fixed',
            inset: 0,
            // Above the drawer, below the custom cursor (2000).
            zIndex: 1999,
            display: 'grid',
            placeItems: 'center',
            bgcolor: colors.bg,
            // Soft lime glow behind the word.
            backgroundImage: 'radial-gradient(ellipse 45% 35% at 50% 50%, rgba(196,238,24,0.07), transparent 70%)',
          }}
        >
          <Box component="span" sx={visuallyHidden}>
            {label}
          </Box>

          <Box
            component={motion.div}
            aria-hidden
            exit={{ y: '-12vh', opacity: 0, transition: { duration: 0.8, ease: curtain } }}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: { xs: 3, md: 4 } }}
          >
            <Box
              sx={{
                position: 'relative',
                fontFamily: fonts.sans,
                fontWeight: 900,
                fontSize: 'clamp(48px, 11vw, 168px)',
                letterSpacing: '-0.035em',
                lineHeight: 0.9,
                whiteSpace: 'nowrap',
              }}
            >
              {/* Contour slices fan out down-right behind the word, farther ones dimmer. */}
              {Array.from({ length: SLICES }, (_, k) => SLICES - k).map((n) => (
                <Box
                  key={n}
                  component={motion.span}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x: `${n * SLICE_STEP}em`, y: `${n * SLICE_STEP}em`, opacity: 1 - (n - 1) / SLICES }}
                  transition={{ duration: 1.1, delay: 0.75 + (SLICES - n) * 0.07, ease }}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    color: 'transparent',
                    WebkitTextStroke: `1px ${colors.gold}`,
                  }}
                >
                  {/* Split like SolidWord so the glyph positions match exactly. */}
                  {[...WORD].map((ch, i) => (
                    <span key={i} style={{ display: 'block' }}>
                      {ch}
                    </span>
                  ))}
                </Box>
              ))}
              <SolidWord />
            </Box>

            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: { xs: 2, md: 3 },
                ...caption,
              }}
            >
              <span>{`${hero.signatureLabel} · ${hero.side.est} ${hero.side.year}`}</span>
              <Progress loaded={loaded} />
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  )
}
