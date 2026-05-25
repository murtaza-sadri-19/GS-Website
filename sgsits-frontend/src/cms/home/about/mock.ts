import type { AboutConfig } from './types'

export const defaultAboutConfig: AboutConfig = {
  label: 'Introduction',
  heading: 'ABOUT',
  accentText: 'SGSITS INDORE',
  body: 'Shri G. S. Institute of Technology & Science (SGSITS) is one of the premier technical institutions created to be Centres of Excellence for training, research and development in science, engineering and technology in India. Established as College of Engineering in 1952, the Institute was later declared an autonomous Institution of National standing, with powers to decide its own academic policy, conduct its own examinations, and award its own degrees.',
  primaryButton:   { label: 'Read More', to: '/about/institute' },
  secondaryButton: { label: 'Notices',   to: '/notices' },
  enabled: true,
  order: 2,
}

export default defaultAboutConfig
