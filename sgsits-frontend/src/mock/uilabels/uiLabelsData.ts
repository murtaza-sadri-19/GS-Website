/**
 * MOCK: Global UI Labels Configuration
 * Replace with: GET /api/settings/ui-labels
 *
 * Consumed ONLY through src/services/uiLabelsService.ts
 *
 * Admin panel can:
 *  - Edit all small static text labels across the UI
 *  - Change CTA button texts
 *  - Change section headings that aren't content-driven
 *  - Change badge texts, placeholder texts, footer labels
 *
 * This ensures even the smallest visible UI text is backend-controllable.
 */

export interface UiLabelsConfig {
  /** Accessibility bar labels */
  accessibility: {
    skipToContent: string
    textSizeLabel: string
    textSizeSmall: string
    textSizeNormal: string
    textSizeLarge: string
    highContrast: string
    normalContrast: string
    lightMode: string
    darkMode: string
  }
  /** Homepage panel labels */
  homepage: {
    announcementsHeading: string
    announcementsBadge: string
    viewAllNoticesLabel: string
    viewAllDepartmentsLabel: string
    viewAllFaqsLabel: string
    viewAllGalleryLabel: string
  }
  /** Header / navigation labels */
  header: {
    searchPlaceholder: string
    searchButtonLabel: string
    loginLabel: string
    erpPortalFallbackLabel: string
    mobileMenuOpenLabel: string
    mobileMenuCloseLabel: string
  }
  /** Sidebar / section labels */
  sidebar: {
    sectionMenuLabel: string
    portalSuffix: string
  }
  /** Footer labels */
  footer: {
    copyrightPrefix: string
  }
  /** Breadcrumbs */
  breadcrumbs: {
    homeLabel: string
  }
  /** 404 page */
  notFound: {
    heading: string
    subheading: string
    backLabel: string
    homeLabel: string
  }
  /** Portal / Dashboard common */
  portal: {
    loadingLabel: string
    errorLabel: string
    saveLabel: string
    cancelLabel: string
    editLabel: string
    deleteLabel: string
    addLabel: string
    confirmDeleteLabel: string
    searchPlaceholder: string
  }
  /** Top bar quick links — array so admin can reorder/add/remove */
  topBarQuickLinks: { label: string; to: string }[]
}

export const mockUiLabels: UiLabelsConfig = {
  accessibility: {
    skipToContent: 'Skip to Content',
    textSizeLabel: 'Text Size:',
    textSizeSmall: 'A-',
    textSizeNormal: 'A',
    textSizeLarge: 'A+',
    highContrast: 'High Contrast',
    normalContrast: 'Normal Contrast',
    lightMode: 'Switch to Light Mode',
    darkMode: 'Switch to Dark Mode',
  },
  homepage: {
    announcementsHeading: 'Announcements',
    announcementsBadge: 'Live',
    viewAllNoticesLabel: 'View All Notices',
    viewAllDepartmentsLabel: 'View All Departments →',
    viewAllFaqsLabel: 'View all',
    viewAllGalleryLabel: 'View All',
  },
  header: {
    searchPlaceholder: 'Search announcements, courses...',
    searchButtonLabel: 'Go',
    loginLabel: 'Login',
    erpPortalFallbackLabel: 'ERP Portal',
    mobileMenuOpenLabel: 'Open navigation menu',
    mobileMenuCloseLabel: 'Close navigation menu',
  },
  sidebar: {
    sectionMenuLabel: 'Section Menu',
    portalSuffix: ' Portal',
  },
  footer: {
    copyrightPrefix: '©',
  },
  breadcrumbs: {
    homeLabel: 'Home',
  },
  notFound: {
    heading: 'Page Not Found',
    subheading: 'The page you are looking for does not exist or has been moved.',
    backLabel: 'Go Back',
    homeLabel: 'Return to Home',
  },
  portal: {
    loadingLabel: 'Loading...',
    errorLabel: 'Something went wrong.',
    saveLabel: 'Save Changes',
    cancelLabel: 'Cancel',
    editLabel: 'Edit',
    deleteLabel: 'Delete',
    addLabel: 'Add New',
    confirmDeleteLabel: 'Are you sure you want to delete this?',
    searchPlaceholder: 'Search...',
  },
  topBarQuickLinks: [
    { label: 'Students',  to: '/students/activities' },
    { label: 'Faculty',   to: '/about/administration' },
    { label: 'Alumni',    to: '/about/institute' },
    { label: 'Contact',   to: '/contact' },
  ],
}
