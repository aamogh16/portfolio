export const about = {
  body: [
    'Hi, I\’m Amogh, a student at Northeastern University studying CS. I spend a lot of my time building whether its cinecircle or toggo with generate, or something new that interests me (high frequency trading right now). ',
    'Whenever anyone asks me what I want to do, the word *impact* always comes out. I don\'t want to hand someone a solution they could\'ve Googled, I want to use my unique skillset to contribute new ideas and *produce alpha*.',
    'Outside of my IDE, I am a Boston sports fan through and through. I’ve been blessed to grow up with many championships, hopefully we have more coming. I’ve also played, coached, and refereed soccer (my favorite sport, shoutout Leo Messi), and if you\'re ever picking a restaurant, the answer is Italian.',
  ],
}

export type Involvement = {
  role: string
  org: string
  href?: string
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
  /** Activities / clubs / honors — used by the education entry. */
  involvement?: Involvement[]
}

export const experience: Experience[] = [
  {
    role: 'Software Engineer Intern',
    company: 'Chewy',
    href: 'https://chewy.com',
    period: 'Jun 2026 — Present',
    location: 'Boston, MA',
    tag: 'intern',
  },
  {
    role: 'Software Engineer Co-op',
    company: 'Wellington Management',
    href: 'https://www.wellington.com',
    period: 'Jan 2026 — Jun 2026',
    location: 'Boston, MA',
    bullets: [
      'Replaced manual email triage for 20 release engineers by engineering a full-stack alert dashboard surfacing 2,000+ categorized alerts via AWS Lambda, Python, and optimized SQL, auto-flagging critical incidents.',
      'Eliminated third-party BI tool dependency by engineering a scheduled pipeline with Python and SQL to generate interactive HTML dashboards tracking SLA compliance, surfacing breach patterns across Fixed Income systems facilitating billions in daily trading and collaborating with engineering teams to drive remediation.',
      'Shipped CLI disaster recovery tool supporting 150+ stacks with individual stack-level targeting, automating cross-region AWS failover across pre, active, and post-recovery phases, orchestrating ASG/ECS infrastructure and DNS switching with live deviation checks, reducing manual recovery effort by 75%.',
      'Refactored legacy health check utility serving all portfolio applications, optimizing AWS Lambda execution to reduce runtime by 30% through improved resource allocation and code efficiency.',
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
    involvement: [
      { role: 'Honors Scholar', org: 'John Martinson Honors Program' },
      { role: 'Vice President', org: 'NU UTSAV' },
      { role: 'Data Analyst', org: 'IdeaNU' },
      { role: 'Software Engineer', org: 'TEDx Northeastern' },
      { role: 'Developer', org: 'Oasis' },
      { role: 'Research Assistant', org: 'Neuroscience Movement Lab' },
    ],
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
    name: 'Portfolio',
    blurb: 'This site — a terminal-themed personal portfolio with Sanity CMS, dark mode, and a fully interactive command-line.',
    repo: 'https://github.com/aamogh16/portfolio',
    year: 2026,
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Sanity'],
    description: [
      'A personal portfolio built from scratch with a terminal aesthetic. The design uses Playfair Display for a serif warmth alongside JetBrains Mono for code elements, on a cream-and-ink palette with a full warm dark mode.',
      'The interactive terminal (accessible via the > button) has a real command parser — ls, cd, cat, open, theme, and more — with a dynamic filesystem that mirrors live Sanity CMS content. Photos and thoughts are managed through Sanity Studio and rendered via its client SDK.',
    ],
    highlights: [
      'Interactive terminal with real command parser and dynamic filesystem',
      'Sanity CMS for photos and thoughts sections',
      'Warm dark mode with no flash on load via inline theme script',
      'OG/social card image generated with @resvg/resvg-js',
    ],
  },
  {
    name: 'S.H.I.E.L.D.',
    blurb:
      'AI-driven threat-intelligence platform that ingests, classifies, and scores hundreds of news articles per day.',
    href: 'https://shield-threat-analysis.vercel.app/docs',
    repo: 'https://github.com/aamogh16/shield-threat-analysis',
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
    repo: 'https://github.com/GenerateNU/cinecircle',
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
  {
    name: 'LoopPrep',
    blurb:
      'AI mock interview coach. Paste a job description, speak your answers, and get scored on content and delivery by a 6-agent LangGraph pipeline.',
    repo: 'https://github.com/loganravin4/wandb-multi-agent-orchestration',
    year: 2026,
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'FastAPI', 'LangGraph', 'W&B Weave'],
    description: [
      'LoopPrep is a multi-agent interview coach built at the AGI House x W&B Build Day hackathon. Paste a job description and the system parses the JD, researches how that specific company interviews via Tavily web search, and builds a calibrated question queue tuned to the role domain. Quant roles get numerical algorithms, ML roles get model implementation questions.',
      'A six-agent LangGraph pipeline handles the full session: JD Parser, Research Agent, Format Agent, Interviewer Agent, Delivery Agent, and Report Agent. Answers are transcribed via Groq Whisper, then scored in parallel on content (correctness, STAR completeness, or code quality depending on type) and delivery (WPM, filler rate, pacing). Every agent call is individually traced in W&B Weave, with per-question metrics logged to a W&B session dashboard.',
    ],
    highlights: [
      '6-agent LangGraph orchestration with parallel content and delivery evaluation per answer',
      'Groq Whisper transcription with delivery scoring: WPM, filler rate, and qualitative pacing',
      'JD-specific question generation calibrated by role domain and company interview format',
      'Full W&B Weave observability: agent traces, weave.Dataset question queue, and weave.Evaluation session debrief',
    ],
  },
  {
    name: 'RecipeBank',
    blurb:
      'Personal recipe management app with AI-powered import, semantic search, and multi-user support.',
    href: 'https://recipe-bank-lac.vercel.app/',
    repo: 'https://github.com/aamogh16/recipe-bank',
    year: 2026,
    stack: ['Next.js', 'TypeScript', 'Drizzle ORM', 'Neon (pgvector)', 'Gemini API', 'Clerk', 'Tailwind CSS'],
    description: [
      'RecipeBank is a full-stack recipe management app that lets users import recipes from any URL using Gemini for extraction, search their collection by vibe or ingredient using vector embeddings, and plan weekly meals with a drag-and-drop calendar.',
      'The app supports two users with fully isolated data via Clerk auth, a native in-app recipe search powered by Serper.dev, a shopping list with per-ingredient cost calculation, and a spice hub that filters ingredients against a curated master list. Try it out for yourself and import your favorite recipes!',
    ],
    highlights: [
      'AI recipe extraction from any URL using Gemini; TikTok caption extraction via oEmbed API',
      'Semantic search with 3072-dim Gemini embeddings stored in pgvector (Neon)',
      'Drag-and-drop weekly meal planner with breakfast/lunch/dinner slots and auto-assign on recipe import',
      'Shopping mode: per-ingredient store price input with automatic recipe-cost calculation and ratio scaling',
      'Multi-user auth via Clerk with per-user data isolation across recipes, shopping lists, and cook log',
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
