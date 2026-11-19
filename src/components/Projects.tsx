import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { colors, contentSx, microLabel, sectionTitleSx } from '../theme'
import { useLang } from '../i18n'
import type { Project } from '../data/content'
import { caseByProject, casePath } from '../data/cases'
import { BASE } from '../utils/base'
import { VariableProximity } from './effects'
import { CroppedImage } from './ProjectCard'

/*
 * Featured projects: every project is an index row that fills with the accent on hover,
 * with a floating preview trailing the pointer on desktop.
 */

const ease = [0.22, 1, 0.36, 1] as const
/** Floating preview size (desktop). */
const PREVIEW_W = 380
const PREVIEW_H = 240

const pad = (n: number) => String(n).padStart(2, '0')
const arrowSx = {
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  border: '1px solid rgba(244,241,236,0.35)',
  transition: 'all .45s cubic-bezier(0.22,1,0.36,1)',
} as const
const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay, ease },
})

/** Index row: fills with the accent from the bottom on hover, text and arrow turn dark. */
function Row({ project, number, onHover }: { project: Project; number: string; onHover: (p: Project | null) => void }) {
  const { lang, t } = useLang()
  const { projects } = t
  // A row opens its case study (Russian only for now), otherwise the project site.
  const study = lang === 'ru' ? caseByProject(project.id) : undefined
  const linkProps = study
    ? { component: 'a' as const, href: BASE + casePath(study.slug), 'aria-label': `${projects.caseLabel}: ${project.title}` }
    : project.url
      ? { component: 'a' as const, href: project.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${projects.openLabel} ${project.title}` }
      : {}

  return (
    <Box
      component={motion.li}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(project)}
      onPointerLeave={() => onHover(null)}
      sx={{ borderBottom: `1px solid ${colors.line}` }}
    >
      <Box
        {...linkProps}
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: { xs: '40px 1fr auto', md: '64px minmax(0, 1.1fr) minmax(0, 1fr) 132px' },
          gridTemplateAreas: { xs: '"num title end" "num desc desc" "num thumb thumb"', md: '"num title desc end"' },
          alignItems: { xs: 'start', md: 'center' },
          columnGap: { xs: 1.5, md: 4 },
          rowGap: 1.25,
          py: { xs: 3, md: 3.5 },
          px: { md: 1 },
          color: colors.text,
          textDecoration: 'none',
          transition: 'padding .4s cubic-bezier(0.22,1,0.36,1)',
          // Accent fill rising from the bottom, under the content.
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: colors.gold,
            transform: 'scaleY(0)',
            transformOrigin: 'bottom',
            transition: 'transform .45s cubic-bezier(0.22,1,0.36,1)',
          },
          '& > *': { position: 'relative', zIndex: 1 },
          '& .row-fill': { transition: 'color .3s, border-color .3s' },
          '&:hover, &:focus-visible': {
            px: { md: 3 },
            '&::before': { transform: 'scaleY(1)' },
            '& .row-fill': { color: colors.bg, borderColor: colors.bg },
            '& .row-arrow': { transform: 'rotate(-45deg)', bgcolor: colors.bg, borderColor: colors.bg, color: colors.gold },
          },
          '&:focus-visible': { outline: 'none' },
        }}
      >
        <Typography className="row-fill" sx={{ gridArea: 'num', fontSize: 14, letterSpacing: '0.12em', color: colors.muted, pt: { xs: 1, md: 0 } }}>
          {number}
        </Typography>
        <Typography
          component="h3"
          className="row-fill"
          sx={{ gridArea: 'title', fontSize: { xs: 26, md: 34, lg: 40 }, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          <VariableProximity text={project.title} />
        </Typography>
        <Box sx={{ gridArea: 'desc', minWidth: 0 }}>
          <Typography className="row-fill" sx={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(244,241,236,0.72)', maxWidth: 420 }}>
            <VariableProximity text={project.description} />
          </Typography>
          <Typography className="row-fill" sx={{ mt: 0.75, fontSize: 13, color: colors.muted }}>
            {project.tags.map((t) => `#${t}`).join('  ')}
          </Typography>
        </Box>
        {/* Phones have no hover: show the preview inline. */}
        <Box
          sx={{
            gridArea: 'thumb',
            display: { xs: 'block', md: 'none' },
            position: 'relative',
            aspectRatio: '16 / 10',
            borderRadius: 1,
            overflow: 'hidden',
            border: `1px solid ${colors.line}`,
            mt: 0.5,
          }}
        >
          <CroppedImage image={project.image} alt="" />
        </Box>
        <Box sx={{ gridArea: 'end', justifySelf: 'end' }}>
          {study || project.url ? (
            <Box className="row-arrow" aria-hidden sx={{ ...arrowSx, width: 44, height: 44 }}>
              <ArrowForward sx={{ fontSize: 18 }} />
            </Box>
          ) : (
            <Box
              component="span"
              className="row-fill"
              sx={{ ...microLabel, display: 'inline-block', whiteSpace: 'nowrap', borderRadius: 999, border: '1px solid currentColor', px: 2, py: 1, color: colors.muted }}
            >
              {project.inDevelopment ? projects.inDevLabel : projects.soonLabel}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function Projects() {
  const { projects } = useLang().t
  const items = projects.items

  // Floating preview that trails the pointer over the list (desktop, fine pointer only).
  const reduce = useReducedMotion()
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 900px)', { noSsr: true })
  const [hovered, setHovered] = useState<Project | null>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(px, { stiffness: 220, damping: 26, mass: 0.5 })
  const y = useSpring(py, { stiffness: 220, damping: 26, mass: 0.5 })
  const follow = (e: React.PointerEvent) => {
    // Clear of the custom cursor ring so the preview never sits on it.
    px.set(e.clientX + 80)
    py.set(e.clientY - PREVIEW_H / 2)
  }

  return (
    <Box component="section" id="work" aria-labelledby="work-title">
      <Box sx={{ ...contentSx, pt: { xs: 8, md: 5.5 }, pb: { xs: 8, md: 6 } }}>
        <Box
          component={motion.div}
          {...revealProps()}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'flex-end' },
            gap: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          <Typography id="work-title" component="h2" sx={sectionTitleSx}>
            <VariableProximity text={projects.title} />
          </Typography>
          <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: colors.muted, maxWidth: 300, pb: { md: 0.5 } }}>
            <VariableProximity text={projects.text} />
          </Typography>
        </Box>

        <Box onPointerMove={canHover ? follow : undefined} sx={{ borderTop: `1px solid ${colors.line}` }}>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {items.map((project, i) => (
              <Row key={project.id} project={project} number={pad(i + 1)} onHover={canHover ? setHovered : () => {}} />
            ))}
          </Box>
        </Box>
      </Box>

      {canHover && (
        <Box
          component={motion.div}
          aria-hidden
          style={{ x, y }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
          transition={{ duration: reduce ? 0 : 0.3, ease }}
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: PREVIEW_W,
            height: PREVIEW_H,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(196,238,24,0.35)',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            zIndex: 1040,
            bgcolor: colors.surface,
          }}
        >
          <AnimatePresence initial={false}>
            {hovered && (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <CroppedImage image={hovered.image} alt="" />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}
    </Box>
  )
}
