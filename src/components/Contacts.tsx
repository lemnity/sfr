import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import MailOutline from '@mui/icons-material/MailOutlined'
import Telegram from '@mui/icons-material/Telegram'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import { colors, contentSx, microLabel, sectionTitleSx } from '../theme'
import { useLang } from '../i18n'
import { contacts } from '../data/content'
import { Reveal, VariableProximity } from './effects'
import FeedbackForm from './feedback/FeedbackForm'

const telegramHandle = '@' + contacts.telegram.replace(/^https?:\/\/t\.me\//, '').replace(/\/$/, '')

/** One contact line: icon, small label and the value; a link when `href` is set. */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof MailOutline
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const body = (
    <>
      <Box
        aria-hidden
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          border: `1px solid ${colors.line}`,
          color: colors.gold,
          transition: 'all .4s cubic-bezier(0.22,1,0.36,1)',
          '.contact-row:hover &': { bgcolor: colors.gold, color: colors.bg, borderColor: colors.gold },
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ ...microLabel, fontSize: 10, letterSpacing: '0.22em', color: colors.muted }}>{label}</Typography>
        <Typography
          sx={{
            mt: 0.5,
            fontSize: { xs: 18, md: 22 },
            letterSpacing: '-0.01em',
            color: colors.text,
            overflowWrap: 'anywhere',
            transition: 'color .3s ease',
            '.contact-row:hover &': { color: colors.goldLight },
          }}
        >
          {value}
        </Typography>
      </Box>
      {href && (
        <ArrowOutward
          aria-hidden
          sx={{
            fontSize: 20,
            color: colors.muted,
            transition: 'transform .4s cubic-bezier(0.22,1,0.36,1), color .3s ease',
            '.contact-row:hover &': { transform: 'translate(3px, -3px)', color: colors.gold },
          }}
        />
      )}
    </>
  )
  const rowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 2.5,
    py: 2.5,
    borderBottom: `1px solid ${colors.line}`,
    color: 'inherit',
    textDecoration: 'none',
    '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: '4px', borderRadius: 1 },
  } as const
  return href ? (
    <Box
      component="a"
      className="contact-row"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      sx={rowSx}
    >
      {body}
    </Box>
  ) : (
    <Box sx={rowSx}>{body}</Box>
  )
}

export default function Contacts() {
  const { contactSection: c, feedback } = useLang().t
  // The inline form reuses the dialog copy but with this section's own heading.
  const copy = { ...feedback, title: c.formTitle, subtitle: c.formSubtitle }

  return (
    <Box component="section" id="contact" aria-labelledby="contact-title">
      <Box
        sx={{
          ...contentSx,
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1.05fr)' },
          gap: { xs: 6, md: 8, lg: 12 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: { md: 'sticky' }, top: { md: 120 } }}>
          <Reveal>
            <Typography id="contact-title" component="h2" sx={sectionTitleSx}>
              {c.title.map((line, i) => (
                <Box key={line} component="span" sx={{ display: 'block', color: i === c.title.length - 1 ? colors.gold : undefined }}>
                  <VariableProximity text={line} />
                  {i < c.title.length - 1 && ' '}
                </Box>
              ))}
            </Typography>
          </Reveal>
          <Reveal delay={0.1}>
            <Typography sx={{ mt: 3, maxWidth: 440, fontSize: { xs: 16, md: 17 }, lineHeight: 1.6, color: 'rgba(244,241,236,0.72)' }}>
              {c.text}
            </Typography>
          </Reveal>
          <Reveal delay={0.15}>
            <Stack sx={{ mt: { xs: 4, md: 5 }, borderTop: `1px solid ${colors.line}` }}>
              <ContactRow icon={MailOutline} label={c.emailLabel} value={contacts.email} href={`mailto:${contacts.email}`} />
              <ContactRow icon={Telegram} label={c.telegramLabel} value={telegramHandle} href={contacts.telegram} external />
              <ContactRow icon={PlaceOutlined} label={c.locationLabel} value={c.location} />
            </Stack>
          </Reveal>
        </Box>

        <Reveal delay={0.1}>
          <Box
            sx={{
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: 4,
              border: `1px solid ${colors.line}`,
              bgcolor: colors.surface,
              boxShadow: '0 40px 100px -40px rgba(0,0,0,0.8)',
              backgroundImage: 'radial-gradient(ellipse 70% 50% at 100% 0%, rgba(196,238,24,0.07), transparent 70%)',
            }}
          >
            <FeedbackForm open onClose={() => {}} copy={copy} variant="inline" idPrefix="contact-form" againLabel={c.again} />
          </Box>
        </Reveal>
      </Box>
    </Box>
  )
}
