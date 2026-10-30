import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Raisbeck',
  description:
    'Full-Stack Enterprise Application Developer, IBM Maximo Product Specialist, and AI evangelist.',
  href: 'https://andrewraisbeck.com',
  author: 'raisbecka',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 6,
}

// Google Analytics
// Configure via environment variable: PUBLIC_GOOGLE_ANALYTICS_ID
export const ANALYTICS = {
  google: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID || '',
}

// Umami Analytics
// Configure via environment variable: PUBLIC_UMAMI_WEBSITE_ID
export const UMAMI = {
  websiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '',
}

// giscus Comments
// Comments are backed by GitHub Discussions (see src/components/Giscus.astro).
// Nothing to configure here; the repo/category are set in that component.

// Brevo Newsletter
// The footer embeds a Brevo hosted subscription form (double opt-in); the
// form/list settings in the Brevo dashboard control consent and confirmation.
// Server-side BREVO_* env vars and API calls are no longer used on GitHub Pages.

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/projects',
    label: 'Projects',
  },
  {
    href: '/about',
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/raisbecka',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/andrew-r-32646786/',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:raisbecka09@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

// Newsletter consent wording — the Brevo hosted form's consent checkbox
// should be configured with THIS text (kept here as the single source of
// truth). CASL requires the consent request to identify the sender and
// describe the purpose of the consent.
export const NEWSLETTER_CONSENT_TEXT = {
  text: 'I consent to receive emails from Andrew Raisbeck about new blog posts and occasional site updates. I can unsubscribe at any time using the link in any email.',
  privacyLink: '/privacy',
  privacyText: 'Privacy Policy',
}
