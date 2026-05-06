import { sections, site } from '../data/site'

type Props = {
  onOpenTerminal: () => void
}

export function Nav({ onOpenTerminal }: Props) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-cream-50/70 bg-cream-50/95 border-b border-ink/10">
      <div className="container-prose flex h-14 items-center justify-between">
        <a href="#top" className="font-mono text-sm text-ink">
          <span className="text-ink-muted">~/</span>
          {site.handle}
        </a>
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hover:text-ink transition-colors">
              {s.label}
            </a>
          ))}
        </nav>
        <button
          onClick={onOpenTerminal}
          className="font-mono text-xs uppercase tracking-[0.2em] border border-ink/20 px-3 py-1.5 hover:bg-ink hover:text-cream-50 transition-colors"
          aria-label="Open terminal"
        >
          <span aria-hidden>›_</span> <span className="hidden sm:inline">terminal</span>
        </button>
      </div>
    </header>
  )
}
