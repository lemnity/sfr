import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Close from '@mui/icons-material/Close'
import { colors, outlinedIconButtonSx } from '../../theme'
import { useLang } from '../../i18n'
import { privacy } from '../../data/privacy'

interface Props {
  open: boolean
  onClose: () => void
}

/** Privacy policy, opened from the consent checkbox of the feedback form. */
export default function PrivacyDialog({ open, onClose }: Props) {
  const { lang } = useLang()
  const copy = privacy[lang]
  const fullScreen = useMediaQuery('(max-width:599.95px)')
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      scroll="paper"
      aria-labelledby="privacy-title"
      slotProps={{
        backdrop: { sx: { background: 'rgba(3,3,3,0.82)', backdropFilter: 'blur(8px)' } },
        paper: {
          sx: {
            width: '100%',
            maxWidth: { sm: 640 },
            bgcolor: colors.surface,
            backgroundImage: 'none',
            border: { xs: 'none', sm: `1px solid ${colors.line}` },
            borderRadius: { xs: 0, sm: 3 },
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: '20px', sm: '32px 40px 40px' } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Typography id="privacy-title" component="h2" sx={{ fontSize: { xs: 28, sm: 34 }, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {copy.title}
          </Typography>
          <IconButton aria-label={copy.closeLabel} onClick={onClose} sx={{ ...outlinedIconButtonSx, flexShrink: 0 }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>
        <Typography sx={{ mt: 1, fontSize: 13, color: colors.muted }}>{copy.updated}</Typography>
        {copy.sections.map((s) => (
          <section key={s.heading}>
            <Typography component="h3" sx={{ mt: 3.5, fontSize: 17, fontWeight: 600, color: colors.text }}>
              {s.heading}
            </Typography>
            {s.paragraphs.map((p) => (
              <Typography key={p} sx={{ mt: 1.25, fontSize: 15, lineHeight: 1.65, color: 'rgba(244,241,236,0.78)' }}>
                {p}
              </Typography>
            ))}
          </section>
        ))}
      </DialogContent>
    </Dialog>
  )
}
