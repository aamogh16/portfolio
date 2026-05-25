import { site } from '../data/site'
import { SpinChar } from './SpinChar'

export function Footer() {
  return (
    <footer className="hairline">
      <div className="container-prose pt-10 pb-2 flex justify-center">
        <SpinChar className="text-accent text-base" />
      </div>
      <div className="container-prose py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-mono text-xs text-ink-muted">
        <div>
          © {new Date().getFullYear()} {site.name}. <span className="text-ink-faint">— exit 0</span>
        </div>
        <div className="flex gap-4">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-ink">
              {s.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="hover:text-ink">
            email
          </a>
        </div>
      </div>
    </footer>
  )
}
