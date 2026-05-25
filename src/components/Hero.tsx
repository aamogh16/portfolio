import { useState, useEffect } from 'react'
import { site } from '../data/site'
import { SpinChar } from './SpinChar'

type Props = {
  onOpenTerminal: () => void
}

const PHRASES = [
  'Generating alpha',
  'Kicking the ball around',
  'Throwing the pig skin',
  'Building',
  'Saving pets',
  'Waiting for the pipes to turn green',
  'Debugging at 2am',
  'Watching film',
  'Reading the tape',
  'Cooking Italian',
  'Arguing about serifs',
]

const PHRASE_MS = 2800
const FADE_MS = 200

function ThinkingEffect() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setPhraseIdx((i) => (i + 1) % PHRASES.length)
        setVisible(true)
      }, FADE_MS)
    }, PHRASE_MS)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex items-center gap-2 font-mono text-sm text-ink-faint mt-3">
      <SpinChar className="text-accent" />
      <span style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}>
        {PHRASES[phraseIdx]}
      </span>
    </div>
  )
}

export function Hero({ onOpenTerminal }: Props) {
  return (
    <section id="top" className="container-prose pt-16 md:pt-28 pb-20 md:pb-28">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-6">
        <span className="text-accent">$</span> whoami
      </div>
      <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
        {site.name}.
      </h1>
      <p className="mt-6 max-w-prose text-xl md:text-2xl font-serif italic text-ink-soft">
        {site.tagline}
      </p>
      <ThinkingEffect />
      <p className="mt-10 max-w-prose text-base md:text-lg text-ink-muted">
        This site is a single page. Scroll, or use the{' '}
        <button
          onClick={onOpenTerminal}
          className="font-mono text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          terminal
        </button>{' '}
        to navigate. Try{' '}
        <code className="font-mono text-sm bg-cream-100 px-1.5 py-0.5 rounded-sm">help</code>,{' '}
        <code className="font-mono text-sm bg-cream-100 px-1.5 py-0.5 rounded-sm">ls</code>, or{' '}
        <code className="font-mono text-sm bg-cream-100 px-1.5 py-0.5 rounded-sm">cd projects</code>.
      </p>

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-ink-muted">
        {site.socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            <span className="text-accent">↗</span> {s.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`} className="hover:text-ink transition-colors">
          <span className="text-accent">↗</span> email
        </a>
      </div>
    </section>
  )
}
