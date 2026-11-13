export interface PortfolioAccomplishment {
  id: string
  title: string
  summary: string
  link: string
}

export interface PortfolioProfile {
  version: 1
  displayName: string
  headline: string
  summary: string
  accomplishments: PortfolioAccomplishment[]
  githubLinks: string[]
  resume: {
    location: string
    email: string
    phone: string
    linkedin: string
    github: string
    portfolio: string
    targetRole: string
    summary: string
    skills: string
    experience: string
    certifications: string
    education: string
  }
  currentProgress: {
    completedLessons: number
    totalLessons: number
    sections: { title: string; completed: number; total: number }[]
  }
  visibility: 'private' | 'public'
  updatedAt: string
}
