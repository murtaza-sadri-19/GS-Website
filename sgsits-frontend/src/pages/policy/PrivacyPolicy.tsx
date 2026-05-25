import { Link } from 'react-router-dom';
import PageSeo from '../../components/global/PageSeo'
import { ChevronRight, Shield } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you fill out forms, contact us, apply for admissions, or otherwise interact with the SGSITS website. This may include your name, email address, phone number, postal address, educational qualifications, and other relevant details.

We also automatically collect certain technical information when you access our website, including your IP address, browser type and version, operating system, referral URLs, pages visited, and date/time of your visit. This information is used to maintain security, improve website performance, and understand user behavior in aggregate.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `The information we collect is used primarily to facilitate your interaction with SGSITS services, including processing admission applications, responding to queries, sending important academic notifications, and providing access to student portals and resources.

We may use contact information to send newsletters, event announcements, and institutional updates. You may opt out of non-essential communications at any time. We analyze aggregated, anonymized usage data to improve website functionality and user experience. We do not use personal data for profiling or automated decision-making.`,
  },
  {
    title: '3. Data Sharing and Disclosure',
    content: `SGSITS does not sell, trade, or rent your personal information to third parties. We may share your information with authorized government bodies (such as AICTE, UGC, or state regulatory authorities) as required by law or for accreditation purposes.

Third-party service providers engaged to operate our website or applications are contractually bound to maintain confidentiality and process data only for specified purposes. We may disclose information where required by law, court order, or governmental authority, or to protect the rights and safety of SGSITS, students, faculty, and staff.`,
  },
  {
    title: '4. Cookies and Tracking Technologies',
    content: `Our website uses cookies — small text files stored on your device — to enhance user experience, remember preferences, and gather analytical data. Essential cookies are necessary for basic site functionality and cannot be disabled. Analytics cookies (e.g., Google Analytics) help us understand how visitors use our site; these can be disabled through your browser settings.

You can configure your browser to refuse cookies or alert you when cookies are sent. Note that disabling certain cookies may affect the functionality of some sections of our website, including the student portal and online application system.`,
  },
  {
    title: '5. Data Security',
    content: `SGSITS implements appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. Our website uses industry-standard SSL/TLS encryption for data transmission. Access to personal information is restricted to authorized staff who require it to perform their duties.

While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security and recommend that you use strong, unique passwords for any portal accounts and log out after each session on shared devices.`,
  },
  {
    title: '6. Your Rights and Contact',
    content: `You have the right to access, correct, or request deletion of your personal data held by SGSITS. To exercise these rights, or to raise any privacy-related concern, please contact our Data Protection Officer at privacy@sgsits.ac.in or write to: Office of the Registrar, SGSITS, Park Road, Indore – 452003, Madhya Pradesh, India. We will respond to your request within 30 working days.

This Privacy Policy may be updated from time to time. Changes will be published on this page with an updated effective date. Continued use of the SGSITS website following any changes constitutes acceptance of the revised policy.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageSeo pageKey="policy/privacy" />
      {/* Hero */}
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold">Privacy Policy</h1>
          </div>
          <p className="text-white/85 text-lg">
            SGSITS is committed to protecting your privacy and handling your personal information with care and transparency.
          </p>
          <p className="text-white/70 text-sm mt-3">Last Updated: January 15, 2025 | Effective Date: February 1, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy describes how Shri G. S. Institute of Technology & Science ("SGSITS", "we", "our", or "us") collects, uses, and protects information obtained through the official SGSITS website (www.sgsits.ac.in) and affiliated digital services. By using our website, you agree to the practices described in this policy. If you do not agree, please discontinue use of our digital services.
          </p>
        </div>

        {/* Sections */}
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

        {/* Footer note */}
        <div className="mt-8 bg-[#0b2545]/5 rounded-xl border border-[#0b2545]/15 p-6">
          <h3 className="font-semibold text-primary mb-2">Questions about this policy?</h3>
          <p className="text-gray-600 text-sm">
            Contact the SGSITS IT Cell at <span className="text-primary font-medium">itcell@sgsits.ac.in</span> or the Registrar's Office at <span className="text-primary font-medium">registrar@sgsits.ac.in</span>.
          </p>
          <div className="mt-4 flex gap-3">
            <Link to="/policy/terms" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Terms of Use</Link>
            <Link to="/policy/disclaimer" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Disclaimer</Link>
            <Link to="/policy/security" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Security Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
