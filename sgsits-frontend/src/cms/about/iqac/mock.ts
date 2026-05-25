import type { IQACData } from './types'

export const defaultIQACData: IQACData = {
  about:
    'The Internal Quality Assurance Cell (IQAC) of SGSITS was established as per the guidelines of the National Assessment and Accreditation Council (NAAC). It serves as a driving force for planning, guiding, and implementing quality-enhancing and sustaining measures to achieve academic excellence.',
  vision:
    'To develop a system for conscious, consistent and catalytic action to improve the academic and administrative performance of the institution.',
  objectives: [
    'To ensure timely, efficient and progressive performance of academic, administrative and financial tasks.',
    'To promote research and consultancy through optimization of existing infrastructure and resources.',
    'To ensure the adequacy, maintenance and proper allocation of support structure and services.',
    'To ensure timely feedback response, research and its outcome and related activities.',
    'To promote the quality culture through faculty development programmes, workshops and seminars.',
  ],
  recentActivities: [
    { title: 'NAAC Peer Team Visit',         description: 'NAAC peer team conducted a 3-day institutional review for re-accreditation. The institute was awarded A+ grade.',    date: 'November 2025' },
    { title: 'Annual Quality Report (AQAR)', description: 'Submission of the Annual Quality Assurance Report for the academic year 2024-25.',                                   date: 'October 2025'  },
    { title: 'Faculty Development Programme',description: 'Two-day FDP on OBE (Outcome-Based Education) and NEP 2020 implementation.',                                         date: 'August 2025'   },
    { title: 'Student Satisfaction Survey',  description: 'Institute-wide student satisfaction survey conducted across all departments.',                                       date: 'April 2026'    },
  ],
  chairpersonName:   'Prof. (Dr.) Rakesh Kumar Bajaj',
  chairpersonTitle:  'Director, SGSITS',
  coordinatorName:   'Prof. R.K. Pandit',
  coordinatorTitle:  'IQAC Coordinator',
  coordinatorEmail:  'iqac@sgsits.ac.in',
  coordinatorPhone:  '0731-2582103',
}

export default defaultIQACData
