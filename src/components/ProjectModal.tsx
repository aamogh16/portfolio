import { Modal } from './Modal'
import { GitHubIcon } from './GitHubIcon'
import type { Project } from '../data/content'

type Props = {
  open: boolean
  project: Project | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

export function ProjectModal({ open, project, onClose, onPrev, onNext }: Props) {
  return (
    <Modal
      open={open && project !== null}
      onClose={onClose}
      breadcrumb={project ? `~/projects/${project.name}` : '~/projects'}
      size="prose"
      onPrev={onPrev}
      onNext={onNext}
    >
      {project && (
        <article className="px-6 md:px-10 py-10 md:py-14">
          <div className="font-mono text-xs text-ink-faint">{project.year}</div>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl leading-tight tracking-tight">
            {project.name}
          </h1>
          <p className="mt-6 font-serif italic text-xl text-ink-soft">{project.blurb}</p>

          {(project.href || project.repo) && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-muted hover:text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                >
                  ↗ visit
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-muted hover:text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                >
                  <GitHubIcon className="w-3.5 h-3.5 mr-1" /> source
                </a>
              )}
            </div>
          )}

          <hr className="my-8 border-ink/10" />

          {project.description && project.description.length > 0 ? (
            <div className="font-serif text-lg text-ink-soft space-y-5">
              {project.description.map((p, i) => (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="font-serif text-lg italic text-ink-faint">
              (no description yet)
            </p>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <>
              <h2 className="mt-10 mb-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                what’s interesting
              </h2>
              <ul className="space-y-2 text-ink-soft">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-ink-faint select-none">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.stack && project.stack.length > 0 && (
            <>
              <h2 className="mt-10 mb-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[11px] uppercase tracking-[0.15em] border border-ink/15 px-2 py-1 text-ink-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </article>
      )}
    </Modal>
  )
}
