export const about = {
  body: [
    'Hi, I’m Amogh — a student, builder, and notorious over-thinker of small details. I spend most of my time writing software, sketching out side projects late at night, and trying to make tools I actually want to use.',
    'I’m drawn to systems that are fast, quiet, and a little bit opinionated. I like the seams where design meets engineering, where a thoughtful interface can make a complicated thing feel calm.',
    'Outside of code, I read a lot, take too many photos, and keep a running list of cafés ranked by how loud their espresso machines are.',
  ],
}

export type Experience = {
  role: string
  company: string
  href?: string
  period: string
  location?: string
  bullets: string[]
  stack?: string[]
}

export const experience: Experience[] = [
  {
    role: 'Software Engineer Intern',
    company: 'Placeholder Co.',
    href: 'https://example.com',
    period: 'May 2025 — Aug 2025',
    location: 'Boston, MA',
    bullets: [
      'Built a thing that did a thing, faster than the previous thing.',
      'Owned a sub-system end to end — design, ship, monitor, iterate.',
      'Wrote internal tooling that other engineers actually used (rare).',
    ],
    stack: ['TypeScript', 'React', 'Postgres', 'AWS'],
  },
  {
    role: 'Research Assistant',
    company: 'Some Lab @ Northeastern',
    period: 'Jan 2025 — Apr 2025',
    location: 'Boston, MA',
    bullets: [
      'Prototyped a small system to explore an even smaller idea.',
      'Cleaned data, ran experiments, made graphs that survived peer review.',
    ],
    stack: ['Python', 'PyTorch'],
  },
  {
    role: 'Software Developer',
    company: 'A Student Org',
    period: 'Sep 2024 — Present',
    bullets: [
      'Shipped a member-facing dashboard used by ~200 people each week.',
      'Set up the boring stuff: CI, types, lint, deploys — so it stayed boring.',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase'],
  },
]

export type Project = {
  name: string
  blurb: string
  href?: string
  repo?: string
  year: number
  stack?: string[]
  /** Optional long-form description shown in the project modal. */
  description?: string[]
  /** Optional bullet highlights shown in the modal under "what's interesting". */
  highlights?: string[]
}

export const projects: Project[] = [
  {
    name: 'lorem',
    blurb: 'A tiny CLI for generating placeholder text that doesn’t feel like placeholder text.',
    href: '#',
    repo: '#',
    year: 2025,
    stack: ['Rust'],
    description: [
      'I got tired of every placeholder generator giving me the same eight Latin sentences. lorem is a CLI that produces text that reads like real prose — tuned to your domain (essay, product copy, code comments) and length.',
      'It’s about 600 lines of Rust, ships as a single static binary, and does one thing: print convincingly fake words to stdout. No config, no flags you have to memorize, no plugins.',
    ],
    highlights: [
      '600 lines of Rust, single static binary',
      'Domain modes: essay / product / comments',
      'Reads stdin to mimic the cadence of an existing piece of text',
    ],
  },
  {
    name: 'cafe-rank',
    blurb: 'A self-hosted ranking app for cafés, scored on noise, light, wifi, and vibes.',
    href: '#',
    year: 2025,
    stack: ['Next.js', 'Postgres'],
    description: [
      'A small private app I keep on my phone. I rate every café I work from on four axes — noise, light, wifi, vibe — and the app sorts them so I always know where to go when I need to think.',
      'Yes, this is silly. No, I will not stop using it.',
    ],
    highlights: [
      'Four-axis 1–5 scoring (noise, light, wifi, vibe)',
      'Private, single-user; deployed on Vercel + Neon',
      'Apple Maps integration so the right café is always one tap away',
    ],
  },
  {
    name: 'mono',
    blurb: 'A monospace blog engine. Markdown in, static site out, no surprises.',
    repo: '#',
    year: 2024,
    stack: ['TypeScript', 'Vite'],
    description: [
      'mono is the smallest blog engine I could justify writing. You drop markdown files into a folder, run the build, and it spits out a static site that looks like a man page on purpose.',
      'I wrote it because every off-the-shelf option made me read 40 pages of docs to change a font size.',
    ],
    highlights: [
      'No JS in the output, ever',
      'Build is one TypeScript file',
      'Theming is a ~30 line CSS variable block',
    ],
  },
  {
    name: 'tide',
    blurb: 'Personal habit-tracker that grades a week from A to F. Mostly Fs so far.',
    year: 2024,
    stack: ['Swift'],
    description: [
      'I do not need another habit app to gently encourage me. I need an app that gives me a letter grade at the end of the week and makes me feel something.',
      'tide is a SwiftUI app I built in a weekend. You define what counts as a "good" week. It grades you. That is the whole pitch.',
    ],
    highlights: [
      'Letter grades for the week (and a quiet shame counter)',
      'All on-device — no servers, no accounts',
      'Live activity widget that does one thing: judges you',
    ],
  },
]

export type Thought = {
  slug: string
  title: string
  date: string
  preview: string
  /**
   * Plain-text paragraphs for the placeholder version. Sanity-backed thoughts
   * use Portable Text instead — see ThoughtsSection.
   */
  body?: string[]
}

export const thoughts: Thought[] = [
  {
    slug: 'on-small-tools',
    title: 'On the quiet joy of small tools',
    date: '2026-04-22',
    preview:
      'A short essay on why the most-used software in my life is the stuff I built in an afternoon and never touched again.',
    body: [
      'There’s a particular kind of software I love that nobody talks about. It’s the script you wrote on a Tuesday because you were tired of doing the same task by hand. It runs in seven lines, takes one argument, has no tests, no readme, and no future. You will use it every day for the next six years.',
      'These tools have a specific flavor — they are not products. They were not designed. They were grown the way moss grows: a little at a time, in response to the conditions around them. Small tools are honest. They never pretend to be more than they are.',
      'I think about this a lot when I’m starting something new. The temptation is always to build the cathedral. But almost everything I’ve built that mattered started as a snippet I copied from one terminal to another for two weeks before bothering to make it permanent.',
    ],
  },
  {
    slug: 'serif-on-the-web',
    title: 'Serifs belong on the web',
    date: '2026-03-09',
    preview:
      'On reading screens, the texture of letterforms, and why I keep dragging Playfair into projects it has no business being in.',
    body: [
      'Sans-serif won the web a long time ago, and for good reasons — early displays were terrible at rendering small letterforms, and serifs disappeared into a smudge of grey. That’s not the world we live in anymore. Modern displays are good. Hinting is good. The web has caught up.',
      'What we lost, when we picked sans for everything, was texture. Serifs slow you down in a particular way. They give a paragraph cadence. They make a long block of text feel like something you want to sit with instead of skim.',
      'Of course, you can’t just slap Playfair on a checkout button and call it a day. But for personal sites — the kind that are mostly someone trying to say something — I’ll take a serif every time.',
    ],
  },
  {
    slug: 'cold-mornings',
    title: 'Cold mornings, warm terminals',
    date: '2026-01-14',
    preview:
      'Notes on a winter spent rewriting my dotfiles for the third time, and what I learned from doing nothing useful.',
    body: [
      'There’s a window in January where I get nothing done and feel great about it. The sun comes in flat and yellow at 9am, the apartment is freezing, and I sit at my desk in two sweaters rewriting my dotfiles for the third time.',
      'It is, by any reasonable measure, a waste of time. I am not faster afterwards. The new shell prompt is functionally identical to the old shell prompt. The new keybindings will be re-learned and forgotten by March.',
      'But the thing about messing with your tools is that you are, briefly, just a person making something for one user — yourself. There is nobody to ship to. No bug report. No standup. The reward is the doing.',
    ],
  },
]

export type Photo = {
  src: string
  caption: string
  ratio?: 'square' | 'portrait' | 'landscape'
}

// Placeholder images use solid blocks rendered in CSS — see PhotosSection.
export const photos: Photo[] = [
  { src: '#a', caption: 'rooftop, boston — march', ratio: 'landscape' },
  { src: '#b', caption: 'kitchen window, 7am', ratio: 'portrait' },
  { src: '#c', caption: 'someone’s bookshelf', ratio: 'square' },
  { src: '#d', caption: 'a long train', ratio: 'landscape' },
  { src: '#e', caption: 'tea, again', ratio: 'square' },
  { src: '#f', caption: 'snow on the fire escape', ratio: 'portrait' },
]
