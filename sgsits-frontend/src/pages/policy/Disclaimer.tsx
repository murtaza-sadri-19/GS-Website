import { Link } from 'react-router-dom';
import PageSeo from '../../components/global/PageSeo'
import { ChevronRight, AlertTriangle } from 'lucide-react';

const sections = [
  {
    title: '1. General Disclaimer',
    content: `The information contained on the official SGSITS website (www.sgsits.ac.in) is provided for general informational and educational purposes only. While SGSITS strives to keep the information accurate, complete, and current, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information on this website.

Any reliance you place on such information is therefore strictly at your own risk. SGSITS expressly disclaims all liability to any person for any loss or damage incurred as a result of the use of, or reliance upon, any information provided on or accessible from this website.`,
  },
  {
    title: '2. Academic and Examination Information',
    content: `Results, timetables, academic calendars, syllabus documents, and other academic information published on this website are indicative and subject to change without notice. The official notifications issued by the Academic Section, Controller of Examinations, or relevant authorities shall supersede any information published on this website.

Students are advised to verify examination results, schedules, and other academic information from the official examination section or ERP portal. SGSITS will not be responsible for any inconvenience caused due to reliance on outdated or incorrect information displayed on the website.`,
  },
  {
    title: '3. Third-Party Links and External Websites',
    content: `The SGSITS website contains links to external websites for the convenience of users. These links are provided as a service and do not imply endorsement of, or responsibility for, the content or practices of those websites. SGSITS has no control over the content of linked external sites and is not responsible for the accuracy, legality, or decency of their content.

Accessing linked external websites is entirely at the user's own risk. SGSITS disclaims all liability for damages resulting from access to external websites linked from our website. Users should review the privacy policies and terms of use of any third-party website they visit.`,
  },
  {
    title: '4. No Professional Advice',
    content: `Content on the SGSITS website does not constitute professional legal, financial, medical, or academic advice. Any information provided regarding admissions, scholarships, career guidance, placements, or fees is for general informational purposes and should not be relied upon as a substitute for professional consultation.

For definitive admission eligibility, fee details, scholarship entitlements, and other formal matters, users must contact the relevant SGSITS administrative office directly. SGSITS assumes no liability for decisions taken based solely on information available on the website.`,
  },
  {
    title: '5. Limitation of Liability',
    content: `SGSITS, its directors, faculty, staff, and affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to loss of revenue, loss of data, or loss of opportunity, arising from the use of or inability to use this website or its content.

This limitation applies whether the liability arises in contract, tort (including negligence), breach of statutory duty, or otherwise, even if SGSITS has been advised of the possibility of such damages. In jurisdictions that do not allow exclusion or limitation of liability for consequential or incidental damages, SGSITS's liability is limited to the maximum extent permitted by applicable law.`,
  },
  {
    title: '6. Updates to This Disclaimer',
    content: `SGSITS reserves the right to update or amend this Disclaimer at any time without prior notice. The date of the most recent revision is indicated at the top of this page. Your continued use of the SGSITS website following any changes constitutes your acceptance of the revised Disclaimer.

If you have any questions or concerns about this Disclaimer, please contact the SGSITS Registrar's Office at registrar@sgsits.ac.in or visit the office at Park Road, Indore – 452003, Madhya Pradesh, India.`,
  },
];

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageSeo pageKey="policy/disclaimer" />
      {/* Hero */}
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Disclaimer</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold">Disclaimer</h1>
          </div>
          <p className="text-white/85 text-lg">
            Important notices regarding the use of information published on the SGSITS website.
          </p>
          <p className="text-white/70 text-sm mt-3">Last Updated: January 15, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded-xl p-5 mb-8 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#bfa15f] shrink-0 mt-0.5" />
          <p className="text-[#0b2545] text-sm leading-relaxed">
            The information on this website is for general informational purposes only. SGSITS makes no warranties about the accuracy, completeness, or suitability of information on this site. Please verify all critical information with the relevant administrative office.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-display font-bold text-primary mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.split('\n\n').map((para, j) => (
                  <p key={j} className="text-gray-600 leading-relaxed text-sm">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#0b2545]/5 rounded-xl border border-[#0b2545]/15 p-6">
          <h3 className="font-semibold text-primary mb-2">Related Policies</h3>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link to="/policy/privacy" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Privacy Policy</Link>
            <Link to="/policy/terms" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Terms of Use</Link>
            <Link to="/policy/security" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Security Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
