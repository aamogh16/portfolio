import { useEffect, type ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  /** Path-style label shown on the left of the sticky header, e.g. ~/thoughts/cold-mornings */
  breadcrumb: string
  /** prose: ~max-w-2xl, narrower for reading. wide: ~max-w-4xl for photos / projects. */
  size?: 'prose' | 'wide'
  /** Optional left/right arrow handlers for in-modal navigation. */
  onPrev?: () => void
  onNext?: () => void
  children: ReactNode
}

const sizeClass = {
  prose: 'max-w-2xl',
  wide: 'max-w-4xl',
} as const

export function Modal({ open, onClose, breadcrumb, size = 'prose', onPrev, onNext, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, onPrev, onNext])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={breadcrumb}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`my-8 md:my-16 mx-4 w-full ${sizeClass[size]} bg-cream-50 border border-ink/15 shadow-2xl`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-cream-50 px-6 md:px-10 py-3">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted truncate">
            {breadcrumb}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {(onPrev || onNext) && (
              <div className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                <button
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  ← prev
                </button>
                <span className="text-ink-faint/50">·</span>
                <button
                  onClick={onNext}
                  disabled={!onNext}
                  className="hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  next →
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
              aria-label="Close (esc)"
            >
              esc ✕
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
