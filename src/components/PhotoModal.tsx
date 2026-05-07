import { Modal } from './Modal'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export type ModalPhoto = {
  /** Unique key for breadcrumb (e.g. img-03.jpg). */
  filename: string
  caption: string
  takenAt?: string
  /** Either a real URL (Sanity) or null for placeholder (renders the swatch). */
  src: string | null
  /** CSS background for the placeholder swatch when src is null. */
  swatchBg?: string
  ratio?: 'square' | 'portrait' | 'landscape'
}

type Props = {
  open: boolean
  photo: ModalPhoto | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

const ratioClass = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
} as const

export function PhotoModal({ open, photo, onClose, onPrev, onNext }: Props) {
  return (
    <Modal
      open={open && photo !== null}
      onClose={onClose}
      breadcrumb={photo ? `~/photos/${photo.filename}` : '~/photos'}
      size="wide"
      onPrev={onPrev}
      onNext={onNext}
    >
      {photo && (
        <div className="px-6 md:px-10 py-8 md:py-10">
          <div className="bg-cream-100 border border-ink/10">
            {photo.src ? (
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full max-h-[75vh] object-contain"
              />
            ) : (
              <div
                className={`${ratioClass[photo.ratio ?? 'square']} w-full`}
                style={{ background: photo.swatchBg ?? 'linear-gradient(135deg,#e9dab7,#c9b78b)' }}
                role="img"
                aria-label={photo.caption}
              />
            )}
          </div>
          <figcaption className="mt-5 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6">
            <p className="font-serif italic text-xl text-ink-soft lowercase">{photo.caption}</p>
            {photo.takenAt && (
              <span className="font-mono text-xs text-ink-faint shrink-0">{fmt(photo.takenAt)}</span>
            )}
          </figcaption>
        </div>
      )}
    </Modal>
  )
}
