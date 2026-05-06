export const site = {
  name: 'Amogh Athimamula',
  handle: 'amogh',
  host: 'amogh.dev',
  tagline: 'engineer, occasional writer, full-time tinkerer.',
  email: 'athimamula.a@northeastern.edu',
  socials: [
    { label: 'github', href: 'https://github.com/' },
    { label: 'linkedin', href: 'https://linkedin.com/' },
    { label: 'twitter', href: 'https://twitter.com/' },
  ],
}

export const sections = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'projects', label: 'projects' },
  { id: 'thoughts', label: 'thoughts' },
  { id: 'photos', label: 'photos' },
] as const

export type SectionId = (typeof sections)[number]['id']
