import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/great-vibes/400.css'
// Tajik letters (ҳ ҷ қ ғ ӯ ӣ) are missing from Gilroy: Montserrat fills only that range (U+0460–052F).
import '@fontsource/montserrat/cyrillic-ext-400.css'
import '@fontsource/montserrat/cyrillic-ext-500.css'
import '@fontsource/montserrat/cyrillic-ext-600.css'
import '@fontsource/montserrat/cyrillic-ext-700.css'
import '@fontsource/montserrat/cyrillic-ext-900.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
