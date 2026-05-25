import type { HomeDirectorConfig } from './types'

export const defaultHomeDirectorConfig: HomeDirectorConfig = {
  label: 'Leadership Message',
  heading: "DIRECTOR'S",
  accentText: 'CORNER',
  name: 'Prof. Neetesh Purohit',
  photo: '/director.jpeg',
  bio: 'Prof. Neetesh Purohit has taken over charge as Director, SGSITS Indore with effect from the forenoon of 15th February, 2024. Under his leadership the institute continues to scale new heights in research, placements and academic excellence.',
  readMoreLabel: 'Read Message',
  readMoreTo: '/about/director-message',
  enabled: true,
  order: 2, // Coupled visually with about preview
}

export default defaultHomeDirectorConfig
