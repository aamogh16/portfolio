import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import { Modal } from './Modal'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export type ModalThought = {
  slug: string
  title: string
  date: string
  preview: string
  /** Either plain-text paragraphs (placeholder) or Portable Text blocks (Sanity). */
  body?: string[] | PortableTextBlock[]
}

type Props = {
  open: boolean
  thought: ModalThought | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-5 leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="font-serif text-3xl tracking-tight mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl tracking-tight mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-5 border-l-2 border-ink/30 italic text-ink-soft">
        {children}
      </blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
    code: ({ children }) => (
      <code className="font-mono text-[0.95em] bg-cream-100 px-1.5 py-0.5 rounded-sm">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 pl-6 list-disc space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="my-5 pl-6 list-decimal space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
}

function isPortableText(body: unknown): body is PortableTextBlock[] {
  return (
    Array.isArray(body) &&
    body.length > 0 &&
    typeof body[0] === 'object' &&
    body[0] !== null &&
    '_type' in (body[0] as object)
  )
}

export function ThoughtModal({ open, thought, onClose, onPrev, onNext }: Props) {
  return (
    <Modal
      open={open && thought !== null}
      onClose={onClose}
      breadcrumb={thought ? `~/thoughts/${thought.slug}` : '~/thoughts'}
      size="prose"
      onPrev={onPrev}
      onNext={onNext}
    >
      {thought && (
        <article className="px-6 md:px-10 py-10 md:py-14">
          <div className="font-mono text-xs text-ink-faint">{fmt(thought.date)}</div>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl leading-tight tracking-tight">
            {thought.title}
          </h1>
          <p className="mt-6 font-serif italic text-xl text-ink-soft">{thought.preview}</p>
          <hr className="my-8 border-ink/10" />

          <div className="font-serif text-lg text-ink-soft">
            {isPortableText(thought.body) ? (
              <PortableText value={thought.body} components={ptComponents} />
            ) : Array.isArray(thought.body) && thought.body.length > 0 ? (
              (thought.body as string[]).map((p, i) => (
                <p key={i} className="my-5 leading-relaxed">
                  {p}
                </p>
              ))
            ) : (
              <p className="my-5 italic text-ink-faint">
                (no body yet — write the rest in the studio)
              </p>
            )}
          </div>
        </article>
      )}
    </Modal>
  )
}
