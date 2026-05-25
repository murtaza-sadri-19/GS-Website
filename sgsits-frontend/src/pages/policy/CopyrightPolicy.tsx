import { Link } from 'react-router-dom';
import PageSeo from '../../components/global/PageSeo'
import { ChevronRight, Copyright } from 'lucide-react';

const sections = [
  {
    title: '1. Ownership of Content',
    content: `All content published on the SGSITS website (www.sgsits.ac.in), including but not limited to text, articles, research publications, photographs, graphics, logos, audio-visual materials, database compilations, and software code, is the exclusive intellectual property of Shri G. S. Institute of Technology & Science, unless expressly stated otherwise.

This content is protected under the Copyright Act, 1957 (India), and applicable international copyright conventions and treaties. The SGSITS name, seal, logo, and institutional marks are protected as registered trademarks. Unauthorized use, reproduction, or distribution of these marks is prohibited.`,
  },
  {
    title: '2. Permitted Uses',
    content: `Users may access, view, and print content from the SGSITS website for personal, non-commercial, and educational purposes only. Academic researchers may quote limited portions of SGSITS website content for citation, criticism, commentary, or academic analysis, provided proper attribution is given in the format: "Source: SGSITS Official Website, www.sgsits.ac.in".

Faculty, students, and staff of SGSITS may use institutional content for official academic and administrative purposes consistent with their roles. Any other use requires prior written permission from the SGSITS authority.`,
  },
  {
    title: '3. Prohibited Uses',
    content: `The following uses of SGSITS website content are strictly prohibited without prior written consent: reproducing or distributing content for commercial purposes; modifying, adapting, or creating derivative works; presenting SGSITS content in a manner that implies institutional endorsement of third-party views or products; using SGSITS trademarks or logos in any context that may cause confusion or misrepresentation; and systematic downloading or scraping of website content.

Violations of this Copyright Policy may result in civil and/or criminal liability under applicable Indian intellectual property law.`,
  },
  {
    title: '4. Third-Party Content',
    content: `Some content on the SGSITS website may include materials from third parties — such as research papers, journal articles, conference proceedings, or multimedia content — which are subject to the copyright of their respective owners. SGSITS uses such content under license, with permission, or under the fair dealing provisions of the Copyright Act, 1957.

SGSITS does not claim ownership of third-party content featured on the website. Users wishing to reproduce or use third-party content must obtain permission from the respective copyright holders.`,
  },
  {
    title: '5. Student and Faculty Content',
    content: `Research publications, theses, dissertations, project reports, and other academic works created by SGSITS students and faculty may be hosted on this website with the consent of their authors. Authors retain copyright in their original works, subject to any rights assigned to publishers or funding agencies.

SGSITS maintains a non-exclusive, royalty-free license to display, distribute, and archive such works for educational, promotional, and institutional purposes. Students and faculty who wish to remove or update their works should contact the SGSITS Library or the respective department head.`,
  },
  {
    title: '6. Requesting Permission',
    content: `To request permission for use of SGSITS copyrighted content beyond the permitted uses described in this policy, please contact: Office of the Registrar, SGSITS, Park Road, Indore – 452003, Madhya Pradesh, India. Email: copyright@sgsits.ac.in.

Requests should include: a description of the content to be used; the intended purpose and audience; the medium and format of use; the anticipated distribution scale; and contact information of the requester. SGSITS will respond to copyright requests within 15 working days.`,
  },
];

export default function CopyrightPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageSeo pageKey="policy/copyright" />
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Copyright Policy</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Copyright className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold">Copyright Policy</h1>
          </div>
          <p className="text-white/85 text-lg">
            Information about copyright ownership, permitted uses, and how to request permission for SGSITS content.
          </p>
          <p className="text-white/70 text-sm mt-3">Last Updated: January 15, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            © {new Date().getFullYear()} Shri G. S. Institute of Technology & Science (SGSITS), Indore. All rights reserved. This Copyright Policy explains the intellectual property rights applicable to content on the SGSITS official website and provides guidance on permitted and prohibited uses.
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
            <Link to="/policy/hyperlink" className="text-sm text-primary hover:text-accent transition-colors font-medium underline underline-offset-2">Hyperlink Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
