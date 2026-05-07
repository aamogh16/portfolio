import { sections } from '../data/site'
import { experience, projects, thoughts, photos, about } from '../data/content'
import { site } from '../data/site'

export type FsNode =
  | { type: 'dir'; children: Record<string, FsNode> }
  | { type: 'file'; content: string; action?: 'open'; href?: string }

const join = (lines: string[]) => lines.join('\n')

const aboutFile: FsNode = {
  type: 'file',
  content: join([`# about`, '', ...about.body, '', `contact: ${site.email}`]),
}

const experienceFile: FsNode = {
  type: 'file',
  content: join([
    `# experience`,
    '',
    ...experience.flatMap((j) => [
      `${j.role} @ ${j.company}  (${j.period})${j.tag ? `  [${j.tag}]` : ''}`,
      ...(j.detail ? [`  ${j.detail}`] : []),
      ...(j.bullets ?? []).map((b) => `  • ${b}`),
      j.stack ? `  stack: ${j.stack.join(', ')}` : '',
      '',
    ]),
  ]),
}

const projectsDir: FsNode = {
  type: 'dir',
  children: Object.fromEntries(
    projects.map((p) => [
      `${p.name}.md`,
      {
        type: 'file',
        content: join([
          `# ${p.name}  (${p.year})`,
          '',
          p.blurb,
          p.stack ? `\nstack: ${p.stack.join(', ')}` : '',
          p.href ? `link:  ${p.href}` : '',
          p.repo ? `repo:  ${p.repo}` : '',
        ]),
        action: p.href ? 'open' : undefined,
        href: p.href,
      } as FsNode,
    ]),
  ),
}

const thoughtsDir: FsNode = {
  type: 'dir',
  children: Object.fromEntries(
    thoughts.map((t) => [
      `${t.slug}.md`,
      {
        type: 'file',
        content: join([`# ${t.title}`, t.date, '', t.preview]),
      } as FsNode,
    ]),
  ),
}

const photosDir: FsNode = {
  type: 'dir',
  children: Object.fromEntries(
    photos.map((p, i) => [
      `img-${String(i + 1).padStart(2, '0')}.jpg`,
      { type: 'file', content: `[image] ${p.caption}` } as FsNode,
    ]),
  ),
}

const resumeFile: FsNode = {
  type: 'file',
  content: join([
    `# amoghathimamula.pdf`,
    '',
    `(this is a placeholder — drop a real PDF in /public/amoghathimamula.pdf and update site.ts)`,
  ]),
  action: 'open',
  href: '/amoghathimamula.pdf',
}

export const root: FsNode = {
  type: 'dir',
  children: {
    'about.md': aboutFile,
    'experience.md': experienceFile,
    projects: projectsDir,
    thoughts: thoughtsDir,
    photos: photosDir,
    'amoghathimamula.pdf': resumeFile,
    'README.md': {
      type: 'file',
      content: join([
        `# ~/${site.handle}`,
        '',
        site.tagline,
        '',
        `type 'help' to see what you can do.`,
        `try: ls, cd projects, cat about.md, open thoughts/serif-on-the-web.md`,
      ]),
    },
  },
}

export const sectionIds = new Set(sections.map((s) => s.id))

export function resolvePath(cwd: string[], target: string): string[] | null {
  const parts =
    target === '~' || target === '/' ? [] : target.startsWith('/')
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

export function getNode(path: string[]): FsNode | null {
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
