import { useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { AboutSection } from './sections/AboutSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { ThoughtsSection } from './sections/ThoughtsSection'
import { PhotosSection } from './sections/PhotosSection'
import { Terminal } from './terminal/Terminal'
import {
  applyResolved,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  type Theme,
} from './lib/theme'

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme())
  const [resolved, setResolved] = useState(() => resolveTheme(readStoredTheme()))

  // Apply + persist whenever the user changes their preference.
  useEffect(() => {
    const r = resolveTheme(theme)
    setResolved(r)
    applyResolved(r)
    persistTheme(theme)
  }, [theme])

  // Track OS-level changes when in 'system' mode.
  useEffect(() => {
    if (theme !== 'system') return
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const r = resolveTheme('system')
      setResolved(r)
      applyResolved(r)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  // Global shortcut: ` (backtick) or cmd/ctrl+k toggles the terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setTerminalOpen((v) => !v)
        return
      }
      if (e.key === '`' && !typing) {
        e.preventDefault()
        setTerminalOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-full">
      <Nav
        onOpenTerminal={() => setTerminalOpen(true)}
        resolvedTheme={resolved}
        onToggleTheme={() => setThemeState(resolved === 'dark' ? 'light' : 'dark')}
      />
      <main>
        <Hero onOpenTerminal={() => setTerminalOpen(true)} />
        <div className="hairline" />
        <AboutSection />
        <div className="hairline" />
        <ExperienceSection />
        <div className="hairline" />
        <ProjectsSection />
        <div className="hairline" />
        <ThoughtsSection />
        <div className="hairline" />
        <PhotosSection />
      </main>
      <Footer />
      <Terminal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        theme={theme}
        resolvedTheme={resolved}
        setTheme={setThemeState}
      />
      <KeyHint />
    </div>
  )
}

function KeyHint() {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  const mod = isMac ? '⌘K' : 'Ctrl+K'
  return (
    <div className="hidden md:block fixed bottom-4 right-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint bg-cream-100 border border-ink/10 px-3 py-1.5">
      press <kbd className="text-ink">`</kbd> or <kbd className="text-ink">{mod}</kbd> for terminal
    </div>
  )
}
