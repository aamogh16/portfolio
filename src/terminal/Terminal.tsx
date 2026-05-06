import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { fmtPath } from './fs'
import { bannerText, complete, helpText, run, type Line } from './commands'
import { site } from '../data/site'

type Props = {
  open: boolean
  onClose: () => void
}

export function Terminal({ open, onClose }: Props) {
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
      setInput((cur) => complete(cur, cwd))
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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 md:p-6"
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
