export interface SocialLink {
  id: string
  title: string
  icon: string
  url: string
}

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    title: 'GitHub',
    icon: '/github-logo.svg',
    url: 'https://github.com/yourusername',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    icon: '/linkedin-logo.png',
    url: 'https://linkedin.com/in/yourusername',
  },
] 