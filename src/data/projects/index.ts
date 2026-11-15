import type { ProjectPlan } from '../../types/project'
import buildAChatbot from './build-a-chatbot'
import capstoneRag from './capstone-rag'
import capstoneAgent from './capstone-agent'
import capstoneEvaluation from './capstone-evaluation'
import mathResearchCapstone from './math-research-capstone'

/** Portfolio projects, keyed by curriculum lesson id. */
export const projectPlans: Record<string, ProjectPlan> = {
  'build-a-chatbot': buildAChatbot,
  'capstone-rag': capstoneRag,
  'capstone-agent': capstoneAgent,
  'capstone-evaluation': capstoneEvaluation,
  'math-research-capstone': mathResearchCapstone,
}
