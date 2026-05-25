import type { GoverningBodyData, AcademicCouncilData } from './types'

export const defaultGoverningBody: GoverningBodyData = {
  description:
    'The Governing Body is the highest decision-making authority of the institute. It comprises representatives from the government, affiliated universities, regulatory bodies, industry, and the institute faculty. The body provides strategic direction and oversees the overall administration and academic affairs.',
  members: [
    { role: 'Chairman',             name: 'Nominee of Govt. of Madhya Pradesh',  category: 'Government' },
    { role: 'Member Secretary',     name: 'Director, SGSITS Indore',             category: 'Institute' },
    { role: 'Member',               name: 'Nominee of RGPV, Bhopal',             category: 'University' },
    { role: 'Member',               name: 'Nominee of DAVV, Indore',             category: 'University' },
    { role: 'Member',               name: 'Nominee of AICTE, New Delhi',         category: 'Regulatory' },
    { role: 'Member',               name: 'Nominee of DTE, Madhya Pradesh',      category: 'Government' },
    { role: 'Member',               name: 'Industry Representative – I',          category: 'Industry' },
    { role: 'Member',               name: 'Industry Representative – II',         category: 'Industry' },
    { role: 'Member',               name: 'Senior Professor – I',                 category: 'Faculty' },
    { role: 'Member',               name: 'Senior Professor – II',                category: 'Faculty' },
    { role: 'Member',               name: 'Registrar, SGSITS (Ex-Officio)',       category: 'Institute' },
  ],
}

export const defaultAcademicCouncil: AcademicCouncilData = {
  description:
    'The Academic Council is the apex academic body of the institute. It is responsible for the maintenance of standards of teaching, examination and research in the institute. It exercises such other powers and performs such other duties and functions as may be prescribed.',
  members: [
    { sno: 1,  name: 'Director, SGSITS',                designation: 'Ex-Officio Chairman',  category: 'Ex-Officio' },
    { sno: 2,  name: 'Deputy Director, SGSITS',         designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 3,  name: 'Dean (Academics), SGSITS',        designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 4,  name: 'Dean (Student Welfare), SGSITS',  designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 5,  name: 'Dean (R&D), SGSITS',              designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 6,  name: 'All Heads of Departments',        designation: 'Ex-Officio Members',   category: 'Ex-Officio' },
    { sno: 7,  name: 'Nominee of RGPV, Bhopal',         designation: 'University Nominee',   category: 'University' },
    { sno: 8,  name: 'Nominee of DAVV, Indore',         designation: 'University Nominee',   category: 'University' },
    { sno: 9,  name: 'Industry Expert – I',              designation: 'Special Invitee',      category: 'Industry' },
    { sno: 10, name: 'Industry Expert – II',             designation: 'Special Invitee',      category: 'Industry' },
    { sno: 11, name: 'Registrar, SGSITS',               designation: 'Member Secretary',     category: 'Ex-Officio' },
  ],
}
