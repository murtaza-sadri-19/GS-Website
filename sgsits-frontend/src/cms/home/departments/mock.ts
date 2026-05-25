import type { HomeDepartmentsConfig } from './types'

export const defaultHomeDepartmentsConfig: HomeDepartmentsConfig = {
  label: 'Departments & Schools',
  heading: 'ACADEMIC',
  accentText: 'DEPARTMENTS',
  showAllLink: '/departments',
  items: [
    { name: 'Computer Engineering',          slug: 'computer-engineering' },
    { name: 'Information Technology',        slug: 'information-technology' },
    { name: 'Civil Engineering',             slug: 'civil-engineering' },
    { name: 'Mechanical Engineering',        slug: 'mechanical-engineering' },
    { name: 'Electrical Engineering',        slug: 'electrical-engineering' },
    { name: 'Electronics & Instrumentation', slug: 'electronics-instrumentation' },
    { name: 'Electronics & Telecomm.',       slug: 'electronics-telecommunication' },
    { name: 'Industrial & Production',       slug: 'industrial-production' },
    { name: 'Applied Physics',               slug: 'applied-physics' },
    { name: 'Applied Chemistry',             slug: 'applied-chemistry' },
    { name: 'Applied Mathematics',           slug: 'applied-mathematics' },
    { name: 'Pharmacy',                      slug: 'pharmacy' },
  ],
  enabled: true,
  order: 5,
}

export default defaultHomeDepartmentsConfig
