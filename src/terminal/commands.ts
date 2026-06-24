import { fmtPath, getNode, resolvePath, sectionIds, type FsNode } from './fs'
import { site, sections } from '../data/site'
import type { ResolvedTheme, Theme } from '../lib/theme'

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
  /** Current theme preference (may be 'system'). */
  theme: Theme
  /** Resolved theme actually in use ('light' or 'dark'). */
  resolvedTheme: ResolvedTheme
  setTheme: (t: Theme) => void
}

const helpRows: Array<[string, string]> = [
  ['ls [path]', 'list contents of a directory'],
  ['cd <path>', 'change directory; section names also scroll the page'],
  ['pwd', 'print working directory'],
  ['cat <file>', 'print the contents of a file'],
  ['open <file|url>', 'open a project link, resume, or external url'],
  ['grep <pat> [path]', 'search file contents for a pattern'],
  ['find [path] [-name <pat>]', 'find files matching a name'],
  ['theme [arg]', 'show or set theme — light | dark | system | toggle'],
  ['whoami', `who is running this shell`],
  ['neofetch', 'display system info'],
  ['contact', 'print contact links'],
  ['skills', 'list technical skills'],
  ['echo <text>', 'print text'],
  ['date', 'print the current date'],
  ['man <cmd>', 'show manual page for a command'],
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

const manPages: Record<string, string> = {
  help: `help(1)  — list commands
─────────────────────────────────
usage:  help

list all available commands with brief descriptions.
for detailed documentation on any command, use \`man <command>\`.`,

  ls: `ls(1)  — list directory contents
─────────────────────────────────
usage:  ls [path]

list the contents of a directory. directories are shown
with a trailing /. defaults to the current directory.

examples:
  ls
  ls projects
  ls ~/`,

  cd: `cd(1)  — change directory
─────────────────────────────────
usage:  cd [path]

change the working directory. also scrolls the page when
the target is a top-level section.

  cd ~   (or cd /)  return to home
  cd ..             go up one level

examples:
  cd projects
  cd ~/experience
  cd ..`,

  pwd: `pwd(1)  — print working directory
─────────────────────────────────
usage:  pwd

print the absolute path of the current directory.`,

  cat: `cat(1)  — print file contents
─────────────────────────────────
usage:  cat <file>

print the contents of a file. use \`ls\` to see available files.

examples:
  cat about.md
  cat README.md
  cat projects/cinecircle.md`,

  open: `open(1)  — open a file or url
─────────────────────────────────
usage:  open <file|section|url>

open a project link, resume, or url in a new tab.
passing a section name scrolls the page instead.

examples:
  open amoghathimamula.pdf
  open projects
  open https://github.com/aamogh16`,

  grep: `grep(1)  — search file contents
─────────────────────────────────
usage:  grep <pattern> [path]

search for a pattern (regex, case-insensitive) in files.
if path is a file, searches that file only. if path is a
directory (or omitted), searches all files recursively.

output format:  file:line: content

examples:
  grep typescript
  grep "react native" projects
  grep 2026 ~/experience.md`,

  find: `find(1)  — find files by name
─────────────────────────────────
usage:  find [path] [-name <pattern>]

find files matching a name glob (* and ? supported).
defaults to the current directory if no path is given.

examples:
  find
  find projects -name "*.md"
  find ~ -name "about*"`,

  theme: `theme(1)  — manage color theme
─────────────────────────────────
usage:  theme [light | dark | system | toggle]

show or change the color theme. with no argument, prints
the current setting. 'system' follows your OS preference.
'toggle' flips between light and dark.

examples:
  theme
  theme dark
  theme toggle`,

  whoami: `whoami(1)  — print current user
─────────────────────────────────
usage:  whoami

print the current user name. (it's always amogh.)`,

  neofetch: `neofetch(1)  — display system info
─────────────────────────────────
usage:  neofetch

display portfolio info in a neofetch-style summary,
including stack, school, theme, and contact.`,

  contact: `contact(1)  — print contact info
─────────────────────────────────
usage:  contact

print email address and social links.
see also: open, cat about.md`,

  skills: `skills(1)  — list technical skills
─────────────────────────────────
usage:  skills

print a categorized summary of languages, frameworks,
cloud platforms, and tools.`,

  echo: `echo(1)  — print text
─────────────────────────────────
usage:  echo <text>

write arguments to the terminal output.

examples:
  echo hello world
  echo "quoted string with spaces"`,

  date: `date(1)  — print the date
─────────────────────────────────
usage:  date

print the current date and time.`,

  banner: `banner(1)  — print welcome banner
─────────────────────────────────
usage:  banner

re-print the welcome banner shown when the terminal opens.`,

  history: `history(1)  — show command history
─────────────────────────────────
usage:  history

list all commands run this session with index numbers.
use ↑ / ↓ arrow keys to navigate through history inline.`,

  clear: `clear(1)  — clear terminal output
─────────────────────────────────
usage:  clear
shortcut:  ctrl+l

erase all lines from the terminal screen.`,

  goto: `goto(1)  — scroll to section
─────────────────────────────────
usage:  goto <section>

scroll the page to a named section.
available sections: ${sections.map((s) => s.id).join(', ')}

see also: cd, open`,

  exit: `exit(1)  — close the terminal
─────────────────────────────────
usage:  exit   (aliases: quit, :q)
shortcut:  esc

close and dismiss the terminal window.`,

  man: `man(1)  — show manual page
─────────────────────────────────
usage:  man <command>

display documentation for a command.

examples:
  man ls
  man grep
  man theme`,

  sudo: `sudo(1)  — execute as superuser
─────────────────────────────────
nice try.`,
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
    case 'theme': {
      const arg = (rest[0] ?? '').toLowerCase()
      if (!arg) {
        const note = ctx.theme === 'system' ? ` (system → ${ctx.resolvedTheme})` : ''
        ctx.print({ kind: 'out', text: `theme: ${ctx.theme}${note}` })
        return
      }
      if (arg === 'toggle') {
        const next = ctx.resolvedTheme === 'dark' ? 'light' : 'dark'
        ctx.setTheme(next)
        ctx.print({ kind: 'out', text: `theme → ${next}` })
        return
      }
      if (arg === 'light' || arg === 'dark' || arg === 'system') {
        ctx.setTheme(arg)
        ctx.print({ kind: 'out', text: `theme → ${arg}` })
        return
      }
      ctx.print({
        kind: 'err',
        text: `theme: unknown argument '${arg}'. usage: theme [light|dark|system|toggle]`,
      })
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
    case 'grep': {
      if (rest.length === 0)
        return ctx.print({ kind: 'err', text: `grep: usage: grep <pattern> [path]` })
      const pattern = rest[0]
      const pathArg = rest[1]

      let regex: RegExp
      try {
        regex = new RegExp(pattern, 'i')
      } catch {
        return ctx.print({ kind: 'err', text: `grep: invalid pattern: ${pattern}` })
      }

      const basePath = pathArg ? (resolvePath(ctx.cwd, pathArg) ?? ctx.cwd) : ctx.cwd
      const baseNode = getNode(ctx.fs, basePath)
      if (!baseNode)
        return ctx.print({ kind: 'err', text: `grep: ${pathArg}: no such file or directory` })

      const results: string[] = []
      const baseDisplay = pathArg ?? fmtPath(ctx.cwd)

      const searchNode = (node: FsNode, display: string) => {
        if (node.type === 'file') {
          node.content.split('\n').forEach((line, i) => {
            if (regex.test(line)) results.push(`${display}:${i + 1}: ${line.trim()}`)
          })
        } else {
          for (const [name, child] of Object.entries(node.children)) {
            searchNode(child, `${display}/${name}`)
          }
        }
      }

      searchNode(baseNode, baseDisplay)

      if (results.length === 0) {
        ctx.print({ kind: 'err', text: `grep: no matches for '${pattern}'` })
      } else {
        ctx.print({ kind: 'out', text: results.join('\n') })
      }
      return
    }
    case 'find': {
      let searchBase = [...ctx.cwd]
      let namePattern: string | null = null
      let i = 0

      if (i < rest.length && !rest[i].startsWith('-')) {
        const resolved = resolvePath(ctx.cwd, rest[i])
        if (resolved) searchBase = resolved
        i++
      }
      while (i < rest.length) {
        if (rest[i] === '-name' && i + 1 < rest.length) {
          namePattern = rest[i + 1]
          i += 2
        } else i++
      }

      const baseNode = getNode(ctx.fs, searchBase)
      if (!baseNode) return ctx.print({ kind: 'err', text: `find: no such directory` })

      const glob = namePattern
        ? new RegExp(
            '^' +
              namePattern
                .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                .replace(/\*/g, '.*')
                .replace(/\?/g, '.') +
              '$',
            'i',
          )
        : null

      const results: string[] = []
      const baseDisplay = fmtPath(searchBase)

      const walk = (node: FsNode, path: string, name: string) => {
        if (!glob || glob.test(name)) results.push(path)
        if (node.type === 'dir') {
          for (const [childName, child] of Object.entries(node.children)) {
            walk(child, `${path}/${childName}`, childName)
          }
        }
      }

      walk(baseNode, baseDisplay || '~', baseDisplay.split('/').pop() ?? '~')

      ctx.print({ kind: 'out', text: results.join('\n') || '(no results)' })
      return
    }
    case 'man': {
      const subject = rest[0]
      if (!subject) return ctx.print({ kind: 'err', text: `man: what manual page do you want?` })
      const page = manPages[subject]
      if (!page) return ctx.print({ kind: 'err', text: `man: no manual entry for '${subject}'` })
      ctx.print({ kind: 'out', text: page })
      return
    }
    case 'neofetch': {
      const themeLabel = ctx.theme === 'system' ? `system (${ctx.resolvedTheme})` : ctx.theme
      const githubHref = site.socials.find((s) => s.label === 'github')?.href ?? ''
      ctx.print({
        kind: 'out',
        text: [
          `  ┌──────────────────┐   ${site.handle} @ ${site.host}`,
          `  │                  │   ${'─'.repeat(site.handle.length + site.host.length + 3)}`,
          `  │      A · A       │   OS       portfolio v2026`,
          `  │    engineer      │   Shell    terminal.ts`,
          `  │     builder      │   Stack    TS · Go · Python · React · SQL`,
          `  │                  │   Theme    ${themeLabel}`,
          `  └──────────────────┘   School   Northeastern · CS '28`,
          `                         GPA      4.0`,
          `                         GitHub   ${githubHref}`,
        ].join('\n'),
      })
      return
    }
    case 'contact': {
      const w = Math.max(...site.socials.map((s) => s.label.length))
      ctx.print({
        kind: 'out',
        text: [
          `email    ${site.email}`,
          ...site.socials.map((s) => `${s.label.padEnd(w + 2)} ${s.href}`),
        ].join('\n'),
      })
      return
    }
    case 'skills':
      ctx.print({
        kind: 'out',
        text: [
          `languages   TypeScript · JavaScript · Python · Go · SQL · Java`,
          `frontend    React · React Native · Expo · Next.js · Tailwind CSS`,
          `backend     Node.js · Express · FastAPI · REST APIs · WebSockets`,
          `cloud       AWS (Lambda · EC2 · S3 · CloudWatch) · Neon · Supabase`,
          `data        PostgreSQL · Redis · Prisma · Drizzle ORM · pgvector`,
          `tools       Git · Docker · Vite · LangGraph · Sanity CMS`,
        ].join('\n'),
      })
      return
    case 'vim':
    case 'nvim':
      ctx.print({
        kind: 'out',
        text: `${cmd}: entering vim... just kidding. you can actually leave this terminal (esc).`,
      })
      return
    case 'nano':
      ctx.print({
        kind: 'out',
        text: `nano: a perfectly reasonable choice. nothing to edit here, though.`,
      })
      return
    case 'git': {
      const sub = rest[0]
      if (sub === 'log') {
        ctx.print({
          kind: 'out',
          text: [
            `commit 491b1e4  (HEAD → main, origin/main)`,
            `    added new project`,
            ``,
            `commit ed0fe55`,
            `    fix: typo in description`,
            ``,
            `commit 5fae986`,
            `    adding claude style thinking animation`,
            ``,
            `...`,
            ``,
            `hint: \`open ${site.socials.find((s) => s.label === 'github')?.href}/portfolio\` to browse the real repo`,
          ].join('\n'),
        })
        return
      }
      if (sub === 'status') {
        ctx.print({
          kind: 'out',
          text: `On branch main\nnothing to commit, working tree clean`,
        })
        return
      }
      if (sub === 'blame') {
        ctx.print({ kind: 'out', text: `amogh — all of it. every line.` })
        return
      }
      ctx.print({
        kind: 'err',
        text: `git: '${sub ?? ''}' is not available here. try \`open ${site.socials.find((s) => s.label === 'github')?.href}\` to browse repos.`,
      })
      return
    }
    case 'curl':
      ctx.print({
        kind: 'out',
        text: `curl: no network access in this shell. use \`open <url>\` to visit a link.`,
      })
      return
    case 'ssh':
      ctx.print({
        kind: 'err',
        text: `ssh: connection refused — this is a static site, not a server.`,
      })
      return
    case 'ping':
      ctx.print({ kind: 'out', text: `PING ${site.host}: 0ms — i'm right here.` })
      return
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
  'grep',
  'find',
  'man',
  'theme',
  'whoami',
  'echo',
  'date',
  'neofetch',
  'contact',
  'skills',
  'banner',
  'history',
  'clear',
  'exit',
  'goto',
  'git',
  'vim',
  'ping',
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
