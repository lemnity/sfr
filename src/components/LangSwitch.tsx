import { useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import Check from '@mui/icons-material/Check'
import { colors, fonts, microLabel } from '../theme'
import { LANGS, type Lang } from '../data/content'
import { useLang } from '../i18n'

interface Props {
  /** `large` is used inside the drawer. */
  size?: 'small' | 'large'
}

/** Short label on the button and in the menu. Tajik shows the country code most readers know. */
const SHORT: Record<Lang, string> = { ru: 'RU', en: 'EN', tg: 'TJ' }

/** Language dropdown: a button with the current code that opens a menu of all languages. */
export default function LangSwitch({ size = 'small' }: Props) {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const large = size === 'large'

  const choose = (code: Lang) => {
    setOpen(false)
    setLang(code)
  }

  return (
    <>
      <ButtonBase
        ref={anchor}
        aria-label={`${t.langSwitch.label}: ${t.langSwitch.names[lang]}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        sx={{
          ...microLabel,
          fontSize: large ? 13 : 11,
          letterSpacing: '0.2em',
          gap: 0.5,
          pl: large ? 1.75 : 1.25,
          pr: large ? 1.25 : 0.75,
          minHeight: large ? 44 : 36,
          borderRadius: 999,
          border: `1px solid ${open ? colors.gold : 'rgba(244,241,236,0.18)'}`,
          color: colors.gold,
          flexShrink: 0,
          transition: 'border-color .3s ease, color .3s ease',
          '&:hover': { borderColor: 'rgba(196,238,24,0.6)' },
          '&.Mui-focusVisible': { outline: `2px solid ${colors.gold}`, outlineOffset: '2px' },
        }}
      >
        <span lang={lang}>{SHORT[lang]}</span>
        <KeyboardArrowDown
          aria-hidden
          sx={{
            fontSize: large ? 18 : 16,
            color: colors.muted,
            transition: 'transform .35s cubic-bezier(0.22,1,0.36,1)',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </ButtonBase>

      <Menu
        id={menuId}
        anchorEl={anchor.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock
        slotProps={{
          // Above the drawer, below the loader (1999) and the custom cursor (2000).
          root: { sx: { zIndex: 1990 } },
          paper: {
            sx: {
              mt: 1,
              minWidth: 190,
              bgcolor: colors.surface,
              backgroundImage: 'none',
              border: `1px solid ${colors.line}`,
              borderRadius: 3,
              boxShadow: '0 24px 48px -16px rgba(0,0,0,0.8)',
            },
          },
          list: { sx: { py: 0.75 } },
        }}
      >
        {LANGS.map((code) => {
          const active = code === lang
          return (
            <MenuItem
              key={code}
              lang={code}
              selected={active}
              onClick={() => choose(code)}
              sx={{
                gap: 1.5,
                mx: 0.75,
                px: 1.5,
                py: 1.1,
                borderRadius: 2,
                fontFamily: fonts.sans,
                color: active ? colors.gold : colors.text,
                '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'rgba(196,238,24,0.08)' },
                '&:hover': { bgcolor: 'rgba(244,241,236,0.06)' },
              }}
            >
              <Box component="span" sx={{ ...microLabel, fontSize: 11, letterSpacing: '0.2em', minWidth: 26, color: active ? colors.gold : colors.muted }}>
                {SHORT[code]}
              </Box>
              <Box component="span" sx={{ fontSize: 15, flex: 1 }}>
                {t.langSwitch.names[code]}
              </Box>
              {active && <Check aria-hidden sx={{ fontSize: 16, color: colors.gold }} />}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
