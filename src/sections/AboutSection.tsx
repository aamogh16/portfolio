import { about } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'

export function AboutSection() {
  return (
    <section className="container-prose py-20 md:py-28">
      <SectionHeading id="about" eyebrow="About" title="who is this guy" />
      <div className="max-w-prose space-y-5 text-lg leading-relaxed text-ink-soft">
        {about.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}
