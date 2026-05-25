import type { VisionMissionData } from './types'

export const defaultVisionMission: VisionMissionData = {
  visionEnglish:
    '"To be a centre of excellence in education, research and innovation, creating competent professionals with ethical values who contribute to the development of society and the nation."',
  visionHindi:
    '"शिक्षा, अनुसंधान और नवाचार में उत्कृष्टता का केंद्र बनना, नैतिक मूल्यों के साथ सक्षम पेशेवरों का निर्माण करना जो समाज और राष्ट्र के विकास में योगदान दें।"',
  missionPoints: [
    { num: '1', text: 'Provide high-quality technical education through a meticulously designed curriculum, advanced outcome-based teaching-learning methodologies, and state-of-the-art laboratory infrastructure.' },
    { num: '2', text: 'Foster a vibrant ecosystem for high-impact research, pioneering innovation, and student-led entrepreneurship in collaboration with global scientific institutions.' },
    { num: '3', text: 'Cultivate strong industry-academia synergies to drive technology transfer, consultancies, industrial internships, and exceptional student placement programs.' },
    { num: '4', text: 'Inculcate deep-seated ethical values, professional integrity, a sense of social responsibility, and future-ready leadership capabilities.' },
    { num: '5', text: 'Encourage comprehensive and holistic development through outstanding sports facilities, cultural forums, and active community outreach initiatives.' },
  ],
}

export default defaultVisionMission
