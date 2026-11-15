/**
 * A portfolio project, laid out as CLAUDE.md's Projects section describes. Projects have no quiz.
 * Milestone code must run as written. Each project names the lessons it uses, which must exist.
 */
export interface ProjectMilestone {
  title: string
  /** What this step achieves. */
  goal: string
  /** Hints, not full solutions. */
  hints: string[]
  /** Code for this step. Python code is run by the project checker, so it must not need a network or an account. */
  code?: { language: 'python' | 'bash' | 'text'; filename?: string; code: string; output?: string }
  /** How the learner confirms this step works. */
  checkpoint: string
}

export interface ProjectPlan {
  /** Curriculum lesson id for this project. */
  id: string
  /** One paragraph describing the finished result. */
  whatYouBuild: string
  /** A picture of the finished result, as text. */
  diagram: string
  /** Lesson ids this project uses. Each one must exist in the curriculum. */
  lessons: string[]
  tools: string[]
  /** An honest estimate of build time, such as "about 4 hours". */
  time: string
  /** What the finished project must do, as a short checklist. */
  requirements: string[]
  /** 4 to 6 milestones. */
  milestones: ProjectMilestone[]
  /** A checklist the learner can tick before calling the project finished. */
  finishedMeans: string[]
  /** A README template with placeholders in square brackets. */
  readmeTemplate: string
  /** How to describe the project in a portfolio or interview. */
  portfolioText: string
  stretchGoals: string[]
}
