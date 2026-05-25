/**
 * MOCK: Contact Page Data
 * Replace with: GET /api/contact
 *
 * Consumed ONLY through src/services/contactService.ts
 */

export interface ContactOffice {
  title: string
  name: string
  email: string
  phone: string
  address?: string
}

export interface ContactData {
  instituteName: string
  address: string
  city: string
  state: string
  pincode: string
  mainPhone: string
  mainEmail: string
  mapEmbedUrl: string
  offices: ContactOffice[]
  enquiryNote: string
}

export const mockContactData: ContactData = {
  instituteName: 'Shri Govindram Seksaria Institute of Technology and Science (SGSITS)',
  address: '23 Park Road, Indore',
  city: 'Indore',
  state: 'Madhya Pradesh',
  pincode: '452003',
  mainPhone: '0731-2582100',
  mainEmail: 'info@sgsits.ac.in',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.3!2d75.8!3d22.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd!2sSGSITS!5e0!3m2!1sen!2sin!4v1',
  offices: [
    { title: 'Director',                   name: 'Prof. (Dr.) Rakesh Kumar Bajaj', email: 'director@sgsits.ac.in',        phone: '0731-2582100' },
    { title: 'Registrar',                  name: 'Shri P.K. Verma',               email: 'registrar@sgsits.ac.in',       phone: '0731-2582124' },
    { title: 'Dean (Academics)',            name: 'Prof. R.K. Pandit',             email: 'deanacademics@sgsits.ac.in',   phone: '0731-2582103' },
    { title: 'Admission Enquiry',          name: 'Admission Cell',                email: 'admission@sgsits.ac.in',       phone: '0731-2582101' },
    { title: 'Training & Placement',       name: 'T&P Cell',                      email: 'tpo@sgsits.ac.in',             phone: '0731-2582150' },
    { title: 'Controller of Examinations', name: 'Prof. V.K. Gupta',              email: 'coe@sgsits.ac.in',             phone: '0731-2582106' },
    { title: 'Library',                   name: 'Dr. S.P. Singh',                email: 'library@sgsits.ac.in',         phone: '0731-2582700' },
    { title: 'Hostel (Boys)',              name: 'Chief Warden',                  email: 'chiefwarden@sgsits.ac.in',     phone: '0731-2582800' },
  ],
  enquiryNote: 'For general enquiries, please email info@sgsits.ac.in or call the main office. For specific department enquiries, use the telephone directory.',
}
