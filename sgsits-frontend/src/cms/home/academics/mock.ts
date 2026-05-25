import type { AcademicsSectionConfig } from './types'

export const defaultAcademicsConfig: AcademicsSectionConfig = {
  label: 'Academics',
  heading: 'ACADEMIC',
  accentText: 'PROGRAMS',
  description: 'Rigorous, comprehensive, and outcome-oriented educational journeys designed to cultivate leaders.',
  programs: [
    {
      id: 'prog-ug',
      iconName: 'BookOpen',
      title: 'Undergraduate Programs',
      description: 'Four-year B.Tech and B.Pharm degrees built on core engineering principles, practical lab exposure, and direct industry research.',
      to: '/academics/courses/ug',
      ctaLabel: 'Explore UG Degrees',
    },
    {
      id: 'prog-pg',
      iconName: 'GraduationCap',
      title: 'Postgraduate Programs',
      description: 'M.Tech, M.E., MBA, and MCA programs designed for deeper industrial expertise, technical leadership, and practical analytical mastery.',
      to: '/academics/courses/pg',
      ctaLabel: 'Explore PG Degrees',
    },
    {
      id: 'prog-phd',
      iconName: 'Microscope',
      title: 'Doctoral & Research',
      description: 'Rigorous Ph.D. programs across technical sciences supported by advanced laboratories, instrumentation centres, and government grants.',
      to: '/academics/courses/phd',
      ctaLabel: 'Explore Research Paths',
    },
  ],
  enabled: true,
  order: 4,
}

export default defaultAcademicsConfig
