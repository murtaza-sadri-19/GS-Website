export interface Professor {
  slug: string;
  name: string;
  year: string;
  department: string;
  image: string;
  profileText: string;
  achievements: string[];
}

export const instituteProfessors: Professor[] = [
  {
    slug: 'junjhunwala-ashok',
    name: 'Junjhunwala Ashok',
    year: '2014',
    department: 'Electrical Engineering',
    image: '/assets/professors/junjhunwala-ashok.svg',
    profileText:
      'Professor Junjhunwala Ashok is recognized for long-standing contributions to electrical engineering education, applied systems research, and institution building. His guidance has shaped student innovation culture and interdisciplinary academic collaboration.',
    achievements: [
      'Led high-impact academic programs in electrical engineering.',
      'Mentored student and faculty research in core and applied domains.',
      'Contributed to institutional academic planning and quality improvement.',
    ],
  },
  {
    slug: 'pradeep-t',
    name: 'Pradeep T',
    year: '2015',
    department: 'Chemistry',
    image: '/assets/professors/pradeep-t.svg',
    profileText:
      'Professor Pradeep T is known for his work in chemistry research, curriculum strengthening, and student mentorship. His academic initiatives have supported advanced laboratory learning and cross-disciplinary problem solving.',
    achievements: [
      'Advanced research activity in chemistry and materials-related studies.',
      'Developed outcome-focused academic and laboratory frameworks.',
      'Supported multiple student research and innovation cohorts.',
    ],
  },
  {
    slug: 'murty-b-s',
    name: 'Murty B S',
    year: '2016',
    department: 'Metallurgical and Materials Engineering',
    image: '/assets/professors/murty-b-s.svg',
    profileText:
      'Professor Murty B S has made notable contributions to metallurgy and materials engineering through sustained research, mentoring, and leadership in advanced technical programs. His work continues to inspire high-quality engineering scholarship.',
    achievements: [
      'Strengthened advanced materials engineering research pathways.',
      'Guided faculty and postgraduate research collaborations.',
      'Contributed to national and international academic visibility.',
    ],
  },
  {
    slug: 'krishnakumar-r',
    name: 'Krishnakumar R',
    year: '2017',
    department: 'Engineering Design',
    image: '/assets/professors/krishnakumar-r.svg',
    profileText:
      'Professor Krishnakumar R has significantly contributed to engineering design education, systems thinking, and practice-oriented pedagogy. His work reflects a strong blend of academic depth and industry relevance.',
    achievements: [
      'Promoted design-led engineering education and project culture.',
      'Helped build structured mentorship for design innovation teams.',
      'Supported collaborations linking academics with real-world applications.',
    ],
  },
];

export function getProfessorBySlug(slug: string): Professor | undefined {
  return instituteProfessors.find((professor) => professor.slug === slug);
}
