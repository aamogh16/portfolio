import { fmtPath, getNode, resolvePath, sectionIds, type FsNode } from './fs'
import { site, sections } from '../data/site'

export type Line =
  | { kind: 'in'; cwd: string; text: string }
  | { kind: 'out'; text: string }
  | { kind: 'err'; text: string }

export type CmdContext = {
  cwd: string[]
  setCwd: (next: string[]) => void
  print: (...lines: Line[]) => void
  clear: () => void
  scrollTo: (id: string) => void
  openExternal: (href: string) => void
  close: () => void
  /** The live filesystem, built from page content. */
  fs: FsNode
}

const helpRows: Array<[string, string]> = [
  ['ls [path]', 'list contents of a directory'],
  ['cd <path>', 'change directory; section names also scroll the page'],
  ['pwd', 'print working directory'],
  ['cat <file>', 'print the contents of a file'],
  ['open <file|url>', 'open a project link, resume, or external url'],
  ['whoami', `who is running this shell`],
  ['echo <text>', 'print text'],
  ['date', 'print the current date'],
  ['banner', 're-print the welcome banner'],
  ['history', 'show recent commands'],
  ['clear', 'clear the screen  (ctrl+l)'],
  ['exit', 'close the terminal  (esc)'],
  ['help', 'show this help'],
]

export function helpText(): string {
  const w = Math.max(...helpRows.map(([c]) => c.length))
  return helpRows.map(([c, d]) => `  ${c.padEnd(w + 2)}${d}`).join('\n')
}

export function bannerText(): string {
  return [
    `${site.name} — ${site.host}`,
    `welcome. type 'help' for a list of commands.`,
  ].join('\n')
}

export async function run(input: string, ctx: CmdContext): Promise<void> {
  const trimmed = input.trim()
  if (!trimmed) return
  const [cmd, ...rest] = tokenize(trimmed)
  const arg = rest.join(' ')

  switch (cmd) {
    case 'help':
      ctx.print({ kind: 'out', text: helpText() })
      return
    case 'banner':
      ctx.print({ kind: 'out', text: bannerText() })
      return
    case 'whoami':
      ctx.print({ kind: 'out', text: site.handle })
      return
    case 'pwd':
      ctx.print({ kind: 'out', text: fmtPath(ctx.cwd) })
      return
    case 'echo':
      ctx.print({ kind: 'out', text: arg })
      return
    case 'date':
      ctx.print({ kind: 'out', text: new Date().toString() })
      return
    case 'clear':
      ctx.clear()
      return
    case 'exit':
    case 'quit':
    case ':q':
      ctx.close()
      return
    case 'ls': {
      const target = rest[0] ?? '.'
      const path = resolvePath(ctx.cwd, target)
      if (!path) return ctx.print({ kind: 'err', text: `ls: no such path: ${target}` })
      const node = getNode(ctx.fs, path)
      if (!node) return ctx.print({ kind: 'err', text: `ls: no such path: ${target}` })
      if (node.type === 'file') return ctx.print({ kind: 'out', text: target })
      const entries = Object.entries(node.children)
        .map(([name, n]) => (n.type === 'dir' ? `${name}/` : name))
        .sort()
      ctx.print({ kind: 'out', text: entries.join('  ') || '(empty)' })
      return
    }
    case 'cd': {
      const target = rest[0]
      if (!target || target === '~' || target === '/') {
        ctx.setCwd([])
        ctx.scrollTo('top')
        return
      }
      const path = resolvePath(ctx.cwd, target)
      if (!path) return ctx.print({ kind: 'err', text: `cd: no such directory: ${target}` })
      const node = getNode(ctx.fs, path)
      if (!node) return ctx.print({ kind: 'err', text: `cd: no such directory: ${target}` })
      if (node.type !== 'dir')
        return ctx.print({ kind: 'err', text: `cd: not a directory: ${target}` })
      ctx.setCwd(path)
      // If the target maps to a top-level section, scroll to it.
      const head = path[0]
      if (path.length === 1 && head && sectionIds.has(head as never)) {
        ctx.scrollTo(head)
      }
      return
    }
    case 'cat': {
      const target = rest[0]
      if (!target) return ctx.print({ kind: 'err', text: `cat: missing file operand` })
      const path = resolvePath(ctx.cwd, target)
      if (!path) return ctx.print({ kind: 'err', text: `cat: ${target}: no such file` })
      const node = getNode(ctx.fs, path)
      if (!node) return ctx.print({ kind: 'err', text: `cat: ${target}: no such file` })
      if (node.type !== 'file')
        return ctx.print({ kind: 'err', text: `cat: ${target}: is a directory` })
      ctx.print({ kind: 'out', text: node.content })
      return
    }
    case 'open': {
      const target = rest[0]
      if (!target) return ctx.print({ kind: 'err', text: `open: missing operand` })
      if (/^https?:\/\//i.test(target)) {
        ctx.openExternal(target)
        ctx.print({ kind: 'out', text: `opening ${target} ...` })
        return
      }
      // Section shorthand: 'open about' scrolls.
      if (sectionIds.has(target as never)) {
        ctx.scrollTo(target)
        ctx.print({ kind: 'out', text: `→ scrolled to #${target}` })
        return
      }
      const path = resolvePath(ctx.cwd, target)
      if (!path) return ctx.print({ kind: 'err', text: `open: ${target}: not found` })
      const node = getNode(ctx.fs, path)
      if (!node) return ctx.print({ kind: 'err', text: `open: ${target}: not found` })
      if (node.type === 'file' && node.action === 'open' && node.href) {
        ctx.openExternal(node.href)
        ctx.print({ kind: 'out', text: `opening ${node.href} ...` })
        return
      }
      ctx.print({ kind: 'err', text: `open: ${target}: nothing to open` })
      return
    }
    case 'sudo':
      ctx.print({ kind: 'err', text: `nice try.` })
      return
    case 'rm':
      ctx.print({ kind: 'err', text: `rm: refusing to delete the nice things i made.` })
      return
    case 'goto': {
      const target = rest[0]
      if (!target || !sectionIds.has(target as never))
        return ctx.print({
          kind: 'err',
          text: `goto: unknown section. try one of: ${sections.map((s) => s.id).join(', ')}`,
        })
      ctx.scrollTo(target)
      return
    }
    default:
      ctx.print({
        kind: 'err',
        text: `${cmd}: command not found. type 'help' for a list of commands.`,
      })
  }
}

function tokenize(input: string): string[] {
  // Simple tokenizer with quoted-string support.
  const out: string[] = []
  let cur = ''
  let quote: '"' | "'" | null = null
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null
      else cur += ch
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (/\s/.test(ch)) {
      if (cur) {
        out.push(cur)
        cur = ''
      }
    } else cur += ch
  }
  if (cur) out.push(cur)
  return out
}

// Tab completion: complete the last token against fs entries + commands.
const allCommands = [
  'help',
  'ls',
  'cd',
  'pwd',
  'cat',
  'open',
  'whoami',
  'echo',
  'date',
  'banner',
  'history',
  'clear',
  'exit',
  'goto',
]

export function complete(input: string, cwd: string[], fs: FsNode): string {
  const tokens = tokenize(input)
  if (tokens.length === 0) return input
  const isFirst = tokens.length === 1 && !/\s$/.test(input)
  const last = tokens[tokens.length - 1]

  if (isFirst) {
    const matches = allCommands.filter((c) => c.startsWith(last))
    if (matches.length === 1) return matches[0] + ' '
    return input
  }

  // Resolve directory of current token, then complete leaf name.
  const slash = last.lastIndexOf('/')
  const dirPart = slash >= 0 ? last.slice(0, slash + 1) : ''
  const leaf = slash >= 0 ? last.slice(slash + 1) : last

  const baseTarget = dirPart ? dirPart : '.'
  const basePath = resolvePath(cwd, baseTarget)
  if (!basePath) return input
  const baseNode = getNode(fs, basePath) ?? fs
  if (baseNode.type !== 'dir') return input
  const names = Object.entries(baseNode.children).map(([n, child]) =>
    child.type === 'dir' ? n + '/' : n,
  )
  const matches = names.filter((n) => n.startsWith(leaf))
  if (matches.length !== 1) return input
  const completed = dirPart + matches[0]
  const head = tokens.slice(0, -1).join(' ')
  return (head ? head + ' ' : '') + completed
}
