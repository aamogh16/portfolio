import { site } from '../data/site'

type Props = {
  onOpenTerminal: () => void
}

export function Hero({ onOpenTerminal }: Props) {
  return (
    <section id="top" className="container-prose pt-16 md:pt-28 pb-20 md:pb-28">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-6">
        $ whoami
      </div>
      <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
        {site.name}.
      </h1>
      <p className="mt-6 max-w-prose text-xl md:text-2xl font-serif italic text-ink-soft">
        {site.tagline}
      </p>
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
            ↗ {s.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`} className="hover:text-ink transition-colors">
          ↗ email
        </a>
      </div>
    </section>
  )
}
