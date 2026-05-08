import { sections, site } from '../data/site'
import { experience, projects, about, type Project } from '../data/content'

export type FsNode =
  | { type: 'dir'; children: Record<string, FsNode> }
  | { type: 'file'; content: string; action?: 'open'; href?: string }

const join = (lines: string[]) => lines.join('\n')

export type FsThought = {
  slug: string
  title: string
  date: string
  preview: string
}

export type FsPhoto = {
  caption: string
  takenAt?: string
  ratio?: 'square' | 'portrait' | 'landscape'
  /** Optional URL to the full-resolution image. If set, `open` opens it in a new tab. */
  fullSrc?: string
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function aboutFile(): FsNode {
  return {
    type: 'file',
    content: join([
      `# about`,
      '',
      ...about.body,
      '',
      `contact:  ${site.email}`,
      ...site.socials.map((s) => `${s.label.padEnd(8)}  ${s.href}`),
    ]),
  }
}

function experienceFile(): FsNode {
  return {
    type: 'file',
    content: join([
      `# experience`,
      '',
      ...experience.flatMap((j) => [
        `${j.role} @ ${j.company}  (${j.period})${j.tag ? `  [${j.tag}]` : ''}`,
        ...(j.location ? [`  ${j.location}`] : []),
        ...(j.detail ? [`  ${j.detail}`] : []),
        ...(j.bullets ?? []).map((b) => `  • ${b}`),
        ...(j.involvement && j.involvement.length > 0
          ? ['  activities:', ...j.involvement.map((it) => `    · ${it.role} @ ${it.org}`)]
          : []),
        j.stack ? `  stack: ${j.stack.join(', ')}` : '',
        '',
      ]),
    ]),
  }
}

function projectFile(p: Project): FsNode {
  return {
    type: 'file',
    content: join(
      [
        `# ${p.name}  (${p.year})`,
        '',
        p.blurb,
        p.description ? '' : '',
        ...(p.description ?? []),
        '',
        p.highlights && p.highlights.length > 0 ? `what's interesting:` : '',
        ...(p.highlights ?? []).map((h) => `  • ${h}`),
        '',
        p.stack ? `stack: ${p.stack.join(', ')}` : '',
        p.href ? `link:  ${p.href}` : '',
        p.repo ? `repo:  ${p.repo}` : '',
      ].filter((line, i, arr) => !(line === '' && arr[i - 1] === '')),
    ),
    action: p.href ? 'open' : undefined,
    href: p.href,
  }
}

function projectsDir(): FsNode {
  return {
    type: 'dir',
    children: Object.fromEntries(
      projects.map((p) => [`${slugify(p.name)}.md`, projectFile(p)]),
    ),
  }
}

function thoughtsDir(items: FsThought[]): FsNode {
  return {
    type: 'dir',
    children: Object.fromEntries(
      items.map((t) => [
        `${t.slug}.md`,
        {
          type: 'file',
          content: join([`# ${t.title}`, t.date, '', t.preview]),
        } as FsNode,
      ]),
    ),
  }
}

function photosDir(items: FsPhoto[]): FsNode {
  // Build unique filenames; collisions get an incrementing suffix.
  const seen = new Map<string, number>()
  const entries: [string, FsNode][] = items.map((p) => {
    const base = slugify(p.caption) || 'photo'
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    const name = (count === 1 ? base : `${base}-${count}`) + '.jpg'
    const lines = [`[image] ${p.caption}`]
    if (p.takenAt) lines.push(`taken: ${p.takenAt}`)
    if (p.ratio) lines.push(`ratio: ${p.ratio}`)
    if (p.fullSrc) lines.push(`source: ${p.fullSrc}`)
    return [
      name,
      {
        type: 'file',
        content: lines.join('\n'),
        action: p.fullSrc ? 'open' : undefined,
        href: p.fullSrc,
      } as FsNode,
    ]
  })
  return { type: 'dir', children: Object.fromEntries(entries) }
}

function resumeFile(): FsNode {
  return {
    type: 'file',
    content: join([
      `amoghathimamula.pdf — PDF document`,
      '',
      `(this is a binary file. run \`open amoghathimamula.pdf\` to view it in a new tab.)`,
    ]),
    action: 'open',
    href: '/amoghathimamula.pdf',
  }
}

function readme(): FsNode {
  return {
    type: 'file',
    content: join([
      `# ~/${site.handle}`,
      '',
      site.tagline,
      '',
      `type 'help' to see what you can do.`,
      `try: ls, cd projects, cat about.md, open amoghathimamula.pdf`,
    ]),
  }
}

/**
 * Builds the terminal filesystem from the live content shown on the site.
 * Sanity-backed sections (thoughts, photos) pass their resolved data here so
 * `ls` / `cat` / `open` reflect what the user is actually seeing.
 */
export function buildFs({
  thoughts,
  photos,
}: {
  thoughts: FsThought[]
  photos: FsPhoto[]
}): FsNode {
  return {
    type: 'dir',
    children: {
      'about.md': aboutFile(),
      'experience.md': experienceFile(),
      projects: projectsDir(),
      thoughts: thoughtsDir(thoughts),
      photos: photosDir(photos),
      'amoghathimamula.pdf': resumeFile(),
      'README.md': readme(),
    },
  }
}

export const sectionIds = new Set(sections.map((s) => s.id))

export function resolvePath(cwd: string[], target: string): string[] | null {
  const parts =
    target === '~' || target === '/'
      ? []
      : target.startsWith('/')
        ? target.slice(1).split('/').filter(Boolean)
        : target.startsWith('~/')
          ? target.slice(2).split('/').filter(Boolean)
          : [...cwd, ...target.split('/').filter(Boolean)]

  const stack: string[] = []
  for (const p of parts) {
    if (p === '.' || p === '') continue
    if (p === '..') {
      stack.pop()
      continue
    }
    stack.push(p)
  }
  return stack
}

export function getNode(root: FsNode, path: string[]): FsNode | null {
  let node: FsNode = root
  for (const seg of path) {
    if (node.type !== 'dir') return null
    const next = node.children[seg]
    if (!next) return null
    node = next
  }
  return node
}

export function fmtPath(path: string[]): string {
  return '~' + (path.length ? '/' + path.join('/') : '')
}
