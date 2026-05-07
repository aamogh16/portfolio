import { experience, type Experience } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

export function ExperienceSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="experience" eyebrow="Experience" title="what I’ve been up to" />
      <ol className="space-y-12">
        {experience.map((job, i) => (
          <Row key={i} job={job} />
        ))}
      </ol>
    </section>
  )
}

function Row({ job }: { job: Experience }) {
  const isEdu = job.kind === 'edu'
  return (
    <li className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-10">
      <div className="font-mono text-sm text-ink-muted pt-1">
        {isEdu && (
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1">
            education
          </div>
        )}
        {job.period}
      </div>
      <div>
        <h3 className="font-serif text-2xl tracking-tight">
          {job.role}{' '}
          <span className="text-ink-muted italic font-normal">@ </span>
          {job.href ? (
            <a
              href={job.href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
            >
              {job.company}
            </a>
          ) : (
            <span>{job.company}</span>
          )}
          {job.tag && (
            <span className="ml-3 align-middle inline-block font-mono text-[10px] uppercase tracking-[0.15em] border border-ink/20 px-2 py-0.5 text-ink-muted">
              {job.tag}
            </span>
          )}
        </h3>
        {job.location && (
          <div className="font-mono text-xs text-ink-faint mt-1">{job.location}</div>
        )}

        {job.detail && (
          <p className="mt-4 text-ink-soft max-w-prose leading-relaxed">{job.detail}</p>
        )}

        {job.involvement && job.involvement.length > 0 && (
          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-2">
              activities
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-ink-soft">
              {job.involvement.map((it, k) => (
                <li key={k} className="flex gap-3 text-sm">
                  <span className="font-mono text-ink-faint select-none">·</span>
                  <span>
                    <span className="text-ink">{it.role}</span>
                    <span className="text-ink-muted"> @ </span>
                    {it.href ? (
                      <a
                        href={it.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                      >
                        {it.org}
                      </a>
                    ) : (
                      <span>{it.org}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.bullets && job.bullets.length > 0 && (
          <ul className="mt-4 space-y-2 text-ink-soft">
            {job.bullets.map((b, j) => (
              <li key={j} className="flex gap-3">
                <span className="font-mono text-ink-faint select-none">›</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {job.stack && job.stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[11px] uppercase tracking-[0.15em] border border-ink/15 px-2 py-1 text-ink-muted"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}
