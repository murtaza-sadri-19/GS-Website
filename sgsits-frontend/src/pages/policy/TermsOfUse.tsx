import { Link } from 'react-router-dom';
import PageSeo from '../../components/global/PageSeo'
import { ChevronRight, FileText } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the official SGSITS website (www.sgsits.ac.in) and any affiliated digital platforms, portals, or applications, you confirm that you have read, understood, and agree to be bound by these Terms of Use. These terms apply to all visitors, students, faculty, staff, and other users.

If you access the SGSITS website on behalf of an organization, you represent that you have authority to bind that organization to these terms. SGSITS reserves the right to modify these Terms of Use at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.`,
  },
  {
    title: '2. Permitted Use',
    content: `The SGSITS website and its content are provided for informational, academic, and administrative purposes. You may access, read, and download content for personal, non-commercial use only. You may print copies of content for personal reference provided that copyright and other proprietary notices are retained.

You agree not to use the website to transmit any material that is unlawful, threatening, defamatory, obscene, or otherwise objectionable. Any commercial exploitation of website content without prior written consent from SGSITS is strictly prohibited. Academic citations and fair use quotations are permitted with appropriate attribution.`,
  },
  {
    title: '3. Intellectual Property',
    content: `All content published on the SGSITS website, including but not limited to text, graphics, logos, photographs, audio clips, videos, and software, is the property of SGSITS or its content providers and is protected under Indian and international copyright laws.

The SGSITS name, logo, and all related marks are trademarks or registered trademarks of the Institute. Unauthorized use of these marks is prohibited. Third-party trademarks appearing on this website are the property of their respective owners, and their appearance does not imply endorsement by SGSITS.`,
  },
  {
    title: '4. User Accounts and Portal Access',
    content: `Certain sections of the SGSITS website require user registration or login (e.g., the Student Portal, ERP system, and Online Examination Platform). You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

You agree to immediately notify SGSITS of any unauthorized use of your account. SGSITS will not be liable for any loss resulting from unauthorized use of your account. SGSITS reserves the right to suspend or terminate accounts that violate these terms, are involved in unauthorized access, or misuse digital resources.`,
  },
  {
    title: '5. Disclaimers and Limitation of Liability',
    content: `The SGSITS website is provided "as is" without any warranties, express or implied. SGSITS makes no representation about the accuracy, completeness, reliability, or suitability of the information on this website. Examination results, timetables, fee schedules, and similar information are subject to official notifications.

SGSITS shall not be liable for any damages — direct, indirect, incidental, consequential, or punitive — arising from your use of or inability to use this website, including reliance on information provided. Links to third-party websites are provided for convenience; SGSITS assumes no responsibility for their content or practices.`,
  },
  {
    title: '6. Governing Law and Dispute Resolution',
    content: `These Terms of Use shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Indore, Madhya Pradesh.

For any concerns related to website content or services, users are encouraged to contact the SGSITS Web Information Manager at webmaster@sgsits.ac.in before pursuing formal legal remedies. SGSITS is committed to resolving disputes amicably and in a timely manner.`,
  },
];

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageSeo pageKey="policy/terms" />
      {/* Hero */}
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Terms of Use</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold">Terms of Use</h1>
          </div>
          <p className="text-white/85 text-lg">
            Please read these terms carefully before using the SGSITS website and digital services.
          </p>
          <p className="text-white/70 text-sm mt-3">Last Updated: January 15, 2025 | Effective Date: February 1, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to the official website of Shri G. S. Institute of Technology & Science (SGSITS), Indore. These Terms of Use govern your access to and use of the SGSITS website, online portals, and digital services. Please read these terms carefully. If you do not agree to these terms, you must not use our website.
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

        <div className="mt-8 bg-[#0b2545]/5 rounded-xl border border-[#0b2545]/15 p-6">
          <h3 className="font-semibold text-primary mb-2">Related Policies</h3>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link to="/policy/privacy" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Privacy Policy</Link>
            <Link to="/policy/disclaimer" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Disclaimer</Link>
            <Link to="/policy/copyright" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Copyright Policy</Link>
            <Link to="/policy/hyperlink" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Hyperlink Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
