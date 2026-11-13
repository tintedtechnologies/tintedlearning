import type { PortfolioAccomplishment, PortfolioProfile } from '../types/portfolio'

export const emptyPortfolioProfile = (displayName = ''): PortfolioProfile => ({
  version: 1,
  displayName,
  headline: '',
  summary: '',
  accomplishments: [],
  githubLinks: [],
  resume: { location: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', targetRole: '', summary: '', skills: '', experience: '', certifications: '', education: '' },
  currentProgress: { completedLessons: 0, totalLessons: 0, sections: [] },
  visibility: 'private',
  updatedAt: new Date().toISOString(),
})

export function readPortfolioProfile(value: unknown, displayName = ''): PortfolioProfile {
  if (!value || typeof value !== 'object') return emptyPortfolioProfile(displayName)
  const raw = value as Partial<PortfolioProfile>
  const accomplishments = Array.isArray(raw.accomplishments)
    ? raw.accomplishments.filter((item): item is PortfolioAccomplishment => Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.summary === 'string' && typeof item.link === 'string'))
    : []
  const githubLinks = Array.isArray(raw.githubLinks) ? raw.githubLinks.filter((link): link is string => typeof link === 'string') : []
  const resume = raw.resume && typeof raw.resume === 'object' ? raw.resume as Partial<PortfolioProfile['resume']> : {}
  const currentProgress = raw.currentProgress && typeof raw.currentProgress === 'object' ? raw.currentProgress as Partial<PortfolioProfile['currentProgress']> : {}
  return {
    ...emptyPortfolioProfile(displayName),
    displayName: typeof raw.displayName === 'string' ? raw.displayName : displayName,
    headline: typeof raw.headline === 'string' ? raw.headline : '',
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    accomplishments,
    githubLinks,
    resume: {
      location: typeof resume.location === 'string' ? resume.location : '',
      email: typeof resume.email === 'string' ? resume.email : '',
      phone: typeof resume.phone === 'string' ? resume.phone : '',
      linkedin: typeof resume.linkedin === 'string' ? resume.linkedin : '',
      github: typeof resume.github === 'string' ? resume.github : '',
      portfolio: typeof resume.portfolio === 'string' ? resume.portfolio : '',
      targetRole: typeof resume.targetRole === 'string' ? resume.targetRole : '',
      summary: typeof resume.summary === 'string' ? resume.summary : '',
      skills: typeof resume.skills === 'string' ? resume.skills : '',
      experience: typeof resume.experience === 'string' ? resume.experience : '',
      certifications: typeof resume.certifications === 'string' ? resume.certifications : '',
      education: typeof resume.education === 'string' ? resume.education : '',
    },
    currentProgress: {
      completedLessons: typeof currentProgress.completedLessons === 'number' ? currentProgress.completedLessons : 0,
      totalLessons: typeof currentProgress.totalLessons === 'number' ? currentProgress.totalLessons : 0,
      sections: Array.isArray(currentProgress.sections) ? currentProgress.sections.filter((section): section is PortfolioProfile['currentProgress']['sections'][number] => Boolean(section && typeof section === 'object' && typeof section.title === 'string' && typeof section.completed === 'number' && typeof section.total === 'number')) : [],
    },
    visibility: raw.visibility === 'public' ? 'public' : 'private',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  }
}

export function encodePortfolioProfile(profile: PortfolioProfile) {
  return btoa(encodeURIComponent(JSON.stringify(profile)))
}

export function decodePortfolioProfile(value: string): PortfolioProfile | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(value)))
    return readPortfolioProfile(parsed)
  } catch {
    return null
  }
}
