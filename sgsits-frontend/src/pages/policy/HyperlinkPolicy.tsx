import { Link } from 'react-router-dom';
import PageSeo from '../../components/global/PageSeo'
import { ChevronRight, Link2 } from 'lucide-react';

const sections = [
  {
    title: '1. Links to External Websites',
    content: `The SGSITS website (www.sgsits.ac.in) contains hyperlinks to websites of other government agencies, academic institutions, regulatory bodies, and information resources. These links are provided for the convenience of users and do not constitute an endorsement or approval by SGSITS of the linked website, its content, or the organizations operating it.

SGSITS is not responsible for the accuracy, completeness, or legality of content on external websites, nor for any products, services, or information offered by third parties. Users access external websites at their own risk, and SGSITS disclaims all liability for any damages arising from such access.`,
  },
  {
    title: '2. Links to the SGSITS Website',
    content: `External websites wishing to link to the SGSITS website are generally permitted to do so, subject to the following conditions: the link must be a direct link to the SGSITS homepage (www.sgsits.ac.in) or a specific page, not to a PDF or document file; the linking website must not imply affiliation with, endorsement by, or association with SGSITS unless a formal agreement exists; the link must not be presented within a frame that masks the SGSITS URL; and the linking website must not contain content that is defamatory, obscene, illegal, or contrary to the values of an academic institution.

SGSITS reserves the right to request removal of any link to our website at any time.`,
  },
  {
    title: '3. Deep Linking',
    content: `Deep linking to internal pages of the SGSITS website (other than the homepage) is permitted for non-commercial purposes, provided that the link opens in a new browser window or tab and clearly attributes the content to SGSITS. Organizations wishing to deep-link for commercial purposes must obtain prior written consent from SGSITS.

SGSITS reserves the right to change URLs without notice. External parties using deep links should verify link accuracy periodically. SGSITS is not responsible for broken links on third-party websites.`,
  },
  {
    title: '4. Social Media Links',
    content: `The SGSITS website links to its official social media profiles on platforms including LinkedIn, YouTube, Twitter/X, Facebook, and Instagram. These links are provided to facilitate engagement with the SGSITS community. Content on social media platforms is subject to the terms and privacy policies of those respective platforms.

SGSITS is not responsible for user-generated content on social media platforms. The presence of SGSITS on a social media platform does not constitute endorsement of that platform's policies or practices.`,
  },
  {
    title: '5. Government Portal Links',
    content: `Links to Government of India portals (such as india.gov.in, mhrd.gov.in, aicte-india.org, and ugc.ac.in) are provided in compliance with Government of India web guidelines. SGSITS endeavors to keep these links current, but cannot guarantee that linked government portals are always accessible or up to date.

Any discrepancies between SGSITS website content and official government notifications should be resolved in favor of the official government notification. Users are encouraged to verify regulatory information directly from the concerned government portal.`,
  },
  {
    title: '6. Reporting Broken Links',
    content: `SGSITS makes reasonable efforts to ensure that hyperlinks on this website are functional and point to appropriate content. If you encounter a broken link or a link that points to inappropriate or outdated content, please report it to the SGSITS Web Information Manager at webmaster@sgsits.ac.in.

Include the page on which the broken link appears, the URL of the broken link (if visible), and a brief description of the expected destination. We aim to review and fix reported broken links within 5 working days.`,
  },
];

export default function HyperlinkPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageSeo pageKey="policy/hyperlink" />
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Hyperlink Policy</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold">Hyperlink Policy</h1>
          </div>
          <p className="text-white/85 text-lg">
            Guidelines for links to and from the SGSITS website, including external and deep links.
          </p>
          <p className="text-white/70 text-sm mt-3">Last Updated: January 15, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            This Hyperlink Policy governs the use of hyperlinks on the SGSITS website, including outbound links to external websites and inbound links from third-party websites to SGSITS. This policy should be read in conjunction with our Terms of Use, Privacy Policy, and Disclaimer.
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
            <Link to="/policy/copyright" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Copyright Policy</Link>
            <Link to="/policy/disclaimer" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
