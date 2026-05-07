import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import { buildFs, fmtPath, type FsPhoto, type FsThought } from './fs'
import { bannerText, complete, helpText, run, type Line } from './commands'
import { site } from '../data/site'
import {
  thoughts as fallbackThoughts,
  photos as fallbackPhotos,
} from '../data/content'
import { useSanityQuery } from '../lib/useSanityQuery'
import { sanityEnabled, urlFor } from '../lib/sanity'

type SanityThought = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  preview: string
  body?: PortableTextBlock[]
}

type SanityPhoto = {
  _id: string
  caption: string
  ratio?: 'square' | 'portrait' | 'landscape'
  takenAt?: string
  image: { asset: { _ref: string } }
}

const THOUGHTS_QUERY = `*[_type == "thought"] | order(coalesce(order, 9999) asc, date desc) {
  _id, title, slug, date, preview
}`

const PHOTOS_QUERY = `*[_type == "photo" && defined(image)] | order(coalesce(order, 9999) asc, takenAt desc) {
  _id, caption, ratio, takenAt, image
}`

type Props = {
  open: boolean
  onClose: () => void
  theme: import('../lib/theme').Theme
  resolvedTheme: import('../lib/theme').ResolvedTheme
  setTheme: (t: import('../lib/theme').Theme) => void
}

export function Terminal({ open, onClose, theme, resolvedTheme, setTheme }: Props) {
  const [cwd, setCwd] = useState<string[]>([])
  const [lines, setLines] = useState<Line[]>(() => [
    { kind: 'out', text: bannerText() },
    { kind: 'out', text: helpText() },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Pull the same content the page sections do, so `ls` reflects what's visible.
  const { data: liveThoughts } = useSanityQuery<SanityThought[]>(THOUGHTS_QUERY)
  const { data: livePhotos } = useSanityQuery<SanityPhoto[]>(PHOTOS_QUERY)

  const fs = useMemo(() => {
    const thoughts: FsThought[] =
      liveThoughts && liveThoughts.length > 0
        ? liveThoughts.map((t) => ({
            slug: t.slug.current,
            title: t.title,
            date: t.date,
            preview: t.preview,
          }))
        : fallbackThoughts.map((t) => ({
            slug: t.slug,
            title: t.title,
            date: t.date,
            preview: t.preview,
          }))

    const photos: FsPhoto[] =
      sanityEnabled && livePhotos && livePhotos.length > 0
        ? livePhotos.map((p) => ({
            caption: p.caption,
            takenAt: p.takenAt,
            ratio: p.ratio,
            fullSrc: urlFor(p.image).width(2000).fit('max').auto('format').url(),
          }))
        : fallbackPhotos.map((p) => ({
            caption: p.caption,
            ratio: p.ratio,
          }))

    return buildFs({ thoughts, photos })
  }, [liveThoughts, livePhotos])

  const prompt = useMemo(() => `${site.handle}@${site.host}:${fmtPath(cwd)}$`, [cwd])

  useEffect(() => {
    if (open) {
      // Defer to after the modal is in the DOM.
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const print = (...next: Line[]) => setLines((prev) => [...prev, ...next])
  const clear = () => setLines([])

  const submit = async () => {
    const value = input
    setLines((prev) => [...prev, { kind: 'in', cwd: fmtPath(cwd), text: value }])
    setInput('')
    setHistIdx(null)
    if (value.trim()) setHistory((h) => [...h, value])

    if (value.trim() === 'history') {
      print({
        kind: 'out',
        text: history.length
          ? history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`).join('\n')
          : '(no history yet)',
      })
      return
    }

    await run(value, {
      cwd,
      setCwd,
      print,
      clear,
      scrollTo: (id) => {
        const el = id === 'top' ? document.getElementById('top') : document.getElementById(id)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
      openExternal: (href) => window.open(href, '_blank', 'noopener,noreferrer'),
      close: onClose,
      fs,
      theme,
      resolvedTheme,
      setTheme,
    })
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      setInput((cur) => complete(cur, cwd, fs))
      return
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      clear()
      return
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      setLines((prev) => [...prev, { kind: 'in', cwd: fmtPath(cwd), text: input + '^C' }])
      setInput('')
      return
    }
    if (e.key === 'ArrowUp') {
      if (history.length === 0) return
      e.preventDefault()
      const next = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next])
      return
    }
    if (e.key === 'ArrowDown') {
      if (histIdx === null) return
      e.preventDefault()
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(null)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next])
      }
      return
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full md:max-w-3xl h-[78vh] md:h-[70vh] bg-cream-50 border border-ink/15 shadow-2xl flex flex-col font-mono text-sm">
        <div className="flex items-center justify-between border-b border-ink/15 px-4 py-2 bg-cream-100">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-red/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-amber/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-green/70" />
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            {site.handle}@{site.host}
          </div>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
            aria-label="Close terminal (esc)"
          >
            esc ✕
          </button>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 leading-relaxed text-ink"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l, i) => (
            <LineView key={i} line={l} />
          ))}
          <div className="flex">
            <span className="text-ink-muted whitespace-pre">{prompt}&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              className="flex-1 bg-transparent outline-none border-0 text-ink caret-ink"
              aria-label="Terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LineView({ line }: { line: Line }) {
  if (line.kind === 'in') {
    return (
      <div className="whitespace-pre-wrap">
        <span className="text-ink-muted">
          {site.handle}@{site.host}:{line.cwd}${' '}
        </span>
        <span>{line.text}</span>
      </div>
    )
  }
  if (line.kind === 'err') {
    return <pre className="whitespace-pre-wrap text-terminal-red">{line.text}</pre>
  }
  return <pre className="whitespace-pre-wrap">{line.text}</pre>
}
