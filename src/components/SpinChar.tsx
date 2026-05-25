import { useState, useEffect } from 'react'

export const SPIN_CHARS = ['·', '✢', '✳', '✶', '✻', '✽']
const CHAR_MS = 250

type Props = {
  className?: string
}

export function SpinChar({ className = '' }: Props) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SPIN_CHARS.length), CHAR_MS)
    return () => clearInterval(t)
  }, [])
  return <span className={className}>{SPIN_CHARS[idx]}</span>
}
