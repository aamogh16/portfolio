type Props = {
  id: string
  eyebrow: string
  title: string
  pathHint?: string
}

export function SectionHeading({ id, eyebrow, title, pathHint }: Props) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="section-eyebrow">
        $ cd ~/{pathHint ?? id}
      </div>
      <h2 id={id} className="section-heading mt-3 scroll-mt-24">
        {eyebrow} <span className="text-ink-muted italic font-normal">— {title}</span>
      </h2>
    </div>
  )
}
