export const site = {
  name: 'Amogh Athimamula',
  handle: 'amogh',
  host: 'amoghathimamula.com',
  tagline: 'engineer, soccer player, claude coder.',
  email: 'amoghrecruiting@gmail.com',
  socials: [
    { label: 'github', href: 'https://github.com/aamogh16' },
    { label: 'linkedin', href: 'https://linkedin.com/in/amoghathimamula' }
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
