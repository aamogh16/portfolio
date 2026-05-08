import { Fragment, type ReactNode } from 'react'
import { about } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

// Parse `*emphasis*` markers inline so the about copy can italicize specific words
// without pulling in a markdown library.
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic font-serif">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function AboutSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="about" eyebrow="About" title="who is this guy" />
      <div className="max-w-prose space-y-5 text-lg leading-relaxed text-ink-soft">
        {about.body.map((p, i) => (
          <p key={i}>{inline(p)}</p>
        ))}
      </div>
    </section>
  )
}
