export const about = {
  body: [
    'Hi, I\'m Amogh, a student, builder, and someone who will never turn down a plate of pasta. I spend most of my time writing software, sketching out side projects late at night, and trying to make tools I actually want to use.',
    'I\'m drawn to the kind of work where you can tell someone cared. Fast, clean, built with a little bit of intention. I like the seams where design meets engineering, where a good interface makes something complicated feel effortless.',
    'Outside of code, I\'m probably watching Drake Maye carve up a secondary, running the Barca highlights back for the third time, or playing a Drake album I\'ve heard a hundred times like I just discovered it. And if you ever need a dinner spot, the answer is Italian. It\'s always Italian.',
  ],
}

export type Experience = {
  kind?: 'work' | 'edu'
  role: string
  company: string
  href?: string
  period: string
  location?: string
  bullets?: string[]
  stack?: string[]
  /** Optional inline paragraph (used by education for GPA + coursework). */
  detail?: string
  /** Small badge (e.g. "incoming", "co-op"). */
  tag?: string
}

export const experience: Experience[] = [
  {
    role: 'Software Engineer Intern',
    company: 'Chewy',
    href: 'https://chewy.com',
    period: 'Jun 2026 — Aug 2026',
    location: 'Boston, MA',
    tag: 'incoming',
  },
  {
    role: 'Software Engineer Co-op',
    company: 'Wellington Management',
    href: 'https://www.wellington.com',
    period: 'Jan 2026 — Present',
    location: 'Boston, MA',
    tag: 'co-op',
    bullets: [
      'Engineered a full-stack alert monitoring dashboard surfacing 2,000+ classified alerts via AWS Lambda and optimized SQL — auto-flagging critical and unknown incidents with supplemental log enrichment, replacing manual email triage for 20 release engineers.',
      'Refactored a legacy health-check utility serving every portfolio application, cutting AWS Lambda runtime by 30% through better resource allocation and tighter code paths.',
      'Building a CLI disaster-recovery tool to streamline critical system restoration workflows, expanding access for engineers across teams.',
      'Leveraged AWS (Lambda, CloudWatch, EC2) to keep 99.9%+ uptime for trading systems managing billions in assets.',
    ],
    stack: ['AWS Lambda', 'CloudWatch', 'EC2', 'SQL', 'Python'],
  },
  {
    role: 'Software Engineer',
    company: 'Generate — Product Development Studio',
    href: 'https://www.generatenu.com',
    period: 'Sep 2025 — Present',
    location: 'Boston, MA',
    bullets: [
      'Building Toggo, a full-stack group travel-planning mobile app, with a 6-person team using Expo, React Native, Go, PostgreSQL, Redis, WebSockets, and AWS S3 — weekly Agile sprints toward a client-driven MVP.',
      'Architected and shipped an Expo push-notification service using the Go SDK supporting 4 notification types, with bulk multi-user delivery, device-token persistence, and mock-tested external service integration.',
      'Built the end-to-end trip-pitch feature: 5 REST endpoints with pagination, S3 audio storage via presigned URLs, and automated push notifications triggering on pitch creation for every group member.',
    ],
    stack: ['React Native', 'Expo', 'Go', 'PostgreSQL', 'Redis', 'WebSockets', 'AWS S3'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Wind River Environmental',
    href: 'https://www.wrenvironmental.com/',
    period: 'Jun 2023 — Aug 2024',
    location: 'Marlborough, MA',
    bullets: [
      'Cleaned 25,000+ customer profiles in the database, merging and deactivating accounts to prevent unnecessary messaging and reduce costs.',
      'Developed frontend UI improvements and 2+ responsive pages in HTML/CSS/JavaScript, supporting a 15% increase in online inquiries while collaborating with a 12-person IT team in an Agile environment.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    kind: 'edu',
    role: 'B.S. Computer Science, Minor in Business Admin.',
    company: 'Northeastern University · Khoury College of Computer Science',
    href: 'https://www.khoury.northeastern.edu',
    period: 'Aug 2024 — May 2028',
    location: 'Boston, MA',
    detail:
      '4.0 GPA. Coursework: Object Oriented Design, Databases, Data Structures + Algorithms, Fundamentals of Computer Science I/II, Cloud Computing, Foundations of Data Science, Intro to Cybersecurity.',
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
    name: 'S.H.I.E.L.D.',
    blurb:
      'AI-driven threat-intelligence platform that ingests, classifies, and scores hundreds of news articles per day.',
    year: 2025,
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Gemini API', 'SQLite', 'Pydantic'],
    description: [
      'S.H.I.E.L.D. is a threat-monitoring platform that pulls 300+ news articles per day from NewsAPI, runs them through Gemini for classification and severity scoring, and exposes the results behind a clean REST API for downstream consumers.',
      'The pipeline handles the unglamorous parts of an LLM-backed system: deduplication, batched calls to stay within rate limits, scheduled hourly processing, and a human-review path for ambiguous flags.',
    ],
    highlights: [
      'Processes 300+ articles per day with deduplication and batched LLM calls',
      'REST API with 8+ endpoints for retrieval, filtering, and human review',
      'APScheduler-based hourly monitoring; 15–20 articles per run with 1–10 severity scoring',
      'Strict request/response validation with Pydantic',
    ],
  },
  {
    name: 'CineCircle',
    blurb:
      'Mobile-first social space for Indian cinema discussions, built with a 6-person team for the South Asian student community on campus.',
    year: 2025,
    stack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express.js', 'Prisma', 'Supabase'],
    description: [
      'CineCircle is a full-stack mobile app where people can discover, discuss, and rate Indian films. It pulls movie data from TMDB and layers a social graph on top so conversation actually happens around what people are watching.',
      'I built much of the backend: a 15+ endpoint REST API with Express and TypeScript, a Prisma data layer over Supabase, and the search + movie-detail flows on the client. We shipped against weekly Agile sprints with a 6-person team for campus deployment.',
    ],
    highlights: [
      '15+ REST endpoints (Express + TypeScript) backed by Prisma + Supabase',
      'TMDB integration for movie data; comprehensive search and detail screens',
      'CRUD across users, posts, reviews, and movie metadata',
      'Shipped through weekly Agile sprints with a 6-person team',
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
