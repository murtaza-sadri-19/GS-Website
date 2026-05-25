import { Link } from 'react-router-dom';
import PageSeo from '../../components/global/PageSeo'
import { ChevronRight, Eye, CheckCircle } from 'lucide-react';

const features = [
  { title: 'Text Resizing', desc: 'All text on this website can be resized using standard browser controls without loss of content or functionality.' },
  { title: 'Keyboard Navigation', desc: 'All interactive elements, menus, and forms are fully accessible via keyboard navigation using Tab, Enter, and arrow keys.' },
  { title: 'Alternative Text', desc: 'All meaningful images include descriptive alternative text (alt attributes) for screen reader users.' },
  { title: 'Color Contrast', desc: 'Text and interactive elements meet WCAG 2.1 AA contrast ratio requirements of at least 4.5:1 for normal text.' },
  { title: 'Form Labels', desc: 'All form fields include explicit labels to assist screen reader users in understanding form purpose.' },
  { title: 'Skip Navigation', desc: 'A "Skip to main content" link is provided at the top of each page to allow keyboard users to bypass navigation menus.' },
  { title: 'Resizable Layout', desc: 'Page layout is responsive and adapts to viewport size changes without horizontal scrolling at 320px width.' },
  { title: 'PDF Accessibility', desc: 'Official documents published in PDF format are being progressively upgraded to include accessibility tags.' },
];

const sections = [
  {
    title: '1. Our Commitment',
    content: `SGSITS is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards to our website and digital services.

We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, published by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible to people with a wide range of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.`,
  },
  {
    title: '2. Technical Specifications',
    content: `The SGSITS website relies on the following technologies for conformance with WCAG 2.1: HTML5, CSS3, JavaScript (ES6+), and WAI-ARIA (where applicable). These technologies are relied upon for conformance. The website has been tested with the following assistive technologies: NVDA screen reader (Windows), VoiceOver (macOS/iOS), and JAWS screen reader.

We test our website regularly using automated accessibility checkers such as WAVE and axe, as well as manual testing by team members familiar with assistive technology use.`,
  },
  {
    title: '3. Known Limitations',
    content: `While we strive for full accessibility compliance, some older PDF documents and third-party embedded content may not fully conform to accessibility standards. We are actively working to remediate these issues. Third-party applications integrated into our portal (such as payment gateways and external examination systems) are operated by external vendors; we encourage their accessibility but cannot guarantee compliance.

Some legacy pages and archived content may not fully meet current accessibility standards. We are prioritizing the remediation of high-traffic pages and student-facing services.`,
  },
  {
    title: '4. Feedback and Contact',
    content: `We welcome your feedback on the accessibility of the SGSITS website. If you experience barriers or have suggestions, please contact us. We aim to respond to accessibility feedback within 5 working days.

Contact the SGSITS Accessibility Coordinator: accessibility@sgsits.ac.in | Phone: +91-731-2570-5700 | SGSITS IT Cell, Park Road, Indore – 452003, Madhya Pradesh.`,
  },
];

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageSeo pageKey="policy/accessibility" />
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Accessibility Statement</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold">Accessibility Statement</h1>
          </div>
          <p className="text-white/85 text-lg">
            SGSITS is committed to making this website accessible to all users, including those with disabilities.
          </p>
          <p className="text-white/70 text-sm mt-3">Last Updated: January 15, 2025 | WCAG 2.1 Level AA Target</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Conformance Badge */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <div className="text-center">
              <p className="text-white font-bold text-xs">WCAG</p>
              <p className="text-accent font-bold text-lg">2.1</p>
              <p className="text-white text-xs">AA</p>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-primary text-lg mb-1">Targeting WCAG 2.1 Level AA Conformance</h2>
            <p className="text-gray-600 text-sm">
              SGSITS targets conformance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We conduct regular accessibility audits and are committed to continuous improvement.
            </p>
          </div>
        </div>

        {/* Accessibility Features */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Accessibility Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex gap-3 hover:shadow-md transition-shadow">
                <CheckCircle className="w-5 h-5 text-[#bfa15f] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Policy Sections */}
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

        <div className="bg-[#0b2545]/5 rounded-xl border border-[#0b2545]/15 p-6">
          <h3 className="font-semibold text-primary mb-2">Report an Accessibility Issue</h3>
          <p className="text-gray-600 text-sm mb-3">Found a barrier? We want to hear from you so we can fix it.</p>
          <Link to="/feedback" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-blue transition-colors">
            Submit Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}
