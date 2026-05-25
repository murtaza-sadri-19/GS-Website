import type { HomeCampusLifeConfig } from './types'

export const defaultHomeCampusLifeConfig: HomeCampusLifeConfig = {
  label: 'Student Experience',
  heading: 'CAMPUS',
  accentText: 'LIFE',
  description: 'A vibrant community balancing rigorous technical education with diverse cultural and athletic pursuits.',
  facilities: [
    {
      id: 'fac-library',
      title: 'Central Library',
      description: 'Over 50,000 volumes, e-journals, and digital resources. Access to IEEE, Elsevier, Springer, DELNET.',
      iconName: 'BookOpen',
      imageUrl: 'https://picsum.photos/seed/sgslib/600/400',
      to: '/facilities/library',
    },
    {
      id: 'fac-computer',
      title: 'Computer Center',
      description: 'High-speed internet, 500+ computers, servers, 24×7 network access for students and faculty.',
      iconName: 'Microscope',
      imageUrl: 'https://picsum.photos/seed/sgslab/600/400',
      to: '/facilities/computer-center',
    },
    {
      id: 'fac-sports',
      title: 'Sports Complex',
      description: 'Cricket, football, basketball, badminton, table tennis, and a fully equipped gymnasium.',
      iconName: 'Users',
      imageUrl: 'https://picsum.photos/seed/sgssports/600/400',
      to: '/facilities/sports',
    },
    {
      id: 'fac-activities',
      title: 'Student Activities',
      description: 'IEEE, Coding Club, Robotics, and literary clubs nurturing talent beyond academics.',
      iconName: 'Users',
      imageUrl: 'https://picsum.photos/seed/sgsclubs/600/400',
      to: '/students/activities',
    },
    {
      id: 'fac-hostel',
      title: 'Hostel Facilities',
      description: 'Separate Boys and Girls hostels with Wi-Fi, mess, laundry, common rooms — a home away from home.',
      iconName: 'Building',
      imageUrl: 'https://picsum.photos/seed/sgshostel/600/400',
      to: '/facilities/hostel/boys',
    },
    {
      id: 'fac-idea-lab',
      title: 'AICTE IDEA Lab',
      description: '3D printers, laser cutters, AR/VR headsets, IoT kits and electronics prototyping — fostering maker culture.',
      iconName: 'FileText',
      imageUrl: 'https://picsum.photos/seed/sgsaudi/600/400',
      to: '/facilities/idea-lab',
    },
  ],
  enabled: true,
  order: 7,
}

export default defaultHomeCampusLifeConfig
