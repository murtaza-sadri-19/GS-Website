/**
 * MOCK: Chatbot Configuration & Knowledge Base
 * Replace with: GET /api/chatbot/config
 *
 * Consumed ONLY through src/services/chatbotService.ts
 *
 * Admin panel can:
 *  - Edit bot name, avatar, welcome message
 *  - Add / remove / edit response categories
 *  - Edit keyword lists per category
 *  - Edit reply text per category
 *  - Edit the fallback message
 *  - Edit quick prompt suggestions
 *  - Update stale data (fees, packages, contact info)
 */

export interface ChatbotResponseItem {
  id: string
  category: string
  keywords: string[]
  reply: string
}

export interface ChatbotConfig {
  botName: string
  avatarUrl: string
  welcomeMessage: string
  inputPlaceholder: string
  fallbackMessage: string
  quickPrompts: string[]
  responses: ChatbotResponseItem[]
}

export const mockChatbotConfig: ChatbotConfig = {
  botName: 'SGSITS Assistant',
  avatarUrl: '/assets/image.png',
  welcomeMessage: 'Hello! I\'m the **SGSITS Virtual Assistant**.\n\nI can help you with:\n• Admissions & Eligibility\n• Courses & Departments\n• Fee Structure & Scholarships\n• Placements & Recruiters\n• Hostel & Campus Life\n• Contact & Location\n\nWhat would you like to know?',
  inputPlaceholder: 'Ask about admissions, fees, placements...',
  fallbackMessage: '🤔 I\'m not sure about that. I can help with:\n• Admissions & Eligibility\n• Fee Structure\n• Departments & Courses\n• Placements\n• Hostel & Campus Life\n• Contact Information\n\nTry asking about any of these topics!',
  quickPrompts: [
    'How do I apply for admission?',
    'What is the fee structure?',
    'Tell me about placements',
    'Hostel facilities?',
    'Contact information',
  ],
  responses: [
    {
      id: 'admission',
      category: 'Admissions',
      keywords: ['admission', 'apply', 'application', 'eligibility', 'jee', 'entrance'],
      reply: '🎓 **Admissions at SGSITS** are conducted through JEE Main (for B.Tech) and state-level counseling (MPDTE). Key points:\n• B.Tech: JEE Main + MPDTE counseling\n• M.Tech / MBA / MCA: MAT / GATE / MP PET\n• Ph.D: Departmental entrance test\n\nVisit the Admissions section on our website for the latest schedule!',
    },
    {
      id: 'fees',
      category: 'Fee Structure',
      keywords: ['fee', 'fees', 'tuition', 'cost', 'scholarship'],
      reply: '💰 **Fee Structure**:\n• B.Tech (General): As per university norms/year\n• M.Tech: As per university norms/year\n\nScholarships available:\n• Government post-matric scholarships\n• Institute merit scholarships\n• SC/ST fee waivers\n\nPlease visit the Admissions page or contact the office for the current year fee details.',
    },
    {
      id: 'departments',
      category: 'Departments',
      keywords: ['department', 'branch', 'courses', 'program', 'cse', 'it', 'civil', 'mechanical', 'electrical'],
      reply: '🏛️ **Departments at SGSITS**:\n• Computer Engineering\n• Information Technology\n• Civil Engineering\n• Mechanical Engineering\n• Electrical Engineering\n• Electronics & Instrumentation\n• Electronics & Telecommunication\n• Industrial & Production Engineering\n• Applied Chemistry, Mathematics, Physics\n• Biomedical Engineering\n• Pharmacy, MBA and more\n\nWhich department would you like to know more about?',
    },
    {
      id: 'placement',
      category: 'Placements',
      keywords: ['placement', 'job', 'recruit', 'package', 'company', 'campus'],
      reply: '💼 **Placements at SGSITS**:\n• Consistently strong placement records year after year\n• 300+ Recruiters visit annually\n• Top Recruiters include: TCS, Infosys, Wipro, L&T, Amazon, and many more!\n\nPlease visit the Placement section for current year statistics.',
    },
    {
      id: 'hostel',
      category: 'Hostel',
      keywords: ['hostel', 'accommodation', 'stay', 'pg', 'room'],
      reply: '🏠 **Hostel Facilities**:\n• Separate hostels for boys and girls\n• 24/7 security and Wi-Fi connectivity\n• Mess with nutritious meals\n• Recreation rooms and sports facilities\n\nVisit the Facilities section for more details.',
    },
    {
      id: 'contact',
      category: 'Contact',
      keywords: ['contact', 'phone', 'email', 'address', 'location'],
      reply: '📍 **Contact SGSITS**:\n• Address: 23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. – 452003\n• Phone: +91-731-2582100\n• Email: registrar@sgsits.ac.in\n• Website: www.sgsits.ac.in',
    },
    {
      id: 'accreditation',
      category: 'Rankings & Accreditation',
      keywords: ['naac', 'rank', 'rating', 'accreditation', 'nirf'],
      reply: '🏆 **Rankings & Accreditation**:\n• NAAC Accredited Institute\n• NBA Accredited programs\n• Recognized as an Institute of National Standing\n• Consistent presence in NIRF rankings\n\nFor the latest accreditation details, visit the About section.',
    },
    {
      id: 'greeting',
      category: 'Greeting',
      keywords: ['hello', 'hi', 'hey', 'namaste'],
      reply: '👋 Hello! I\'m the **SGSITS Virtual Assistant**.\n\nI can help you with:\n• Admissions & Eligibility\n• Courses & Departments\n• Fee Structure & Scholarships\n• Placements & Recruiters\n• Hostel & Campus Life\n• Contact & Location\n\nWhat would you like to know?',
    },
    {
      id: 'farewell',
      category: 'Farewell',
      keywords: ['thank', 'thanks', 'bye', 'goodbye'],
      reply: '😊 You\'re welcome! Feel free to ask anything else about SGSITS. Have a great day! 🎓',
    },
  ],
}
