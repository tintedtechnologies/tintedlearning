import type { Lesson } from '../../types/curriculum'
import type { LessonVisual as LessonVisualData } from '../../types/curriculum'
import { LessonVisual } from './LessonVisual'

interface LessonConceptAreaProps {
  lesson: Lesson
  visual?: LessonVisualData
}

type ConceptMode = 'foundation' | 'engineering' | 'architecture' | 'project'

function getConceptMode(category: Lesson['category']): ConceptMode {
  if (category === 'Projects and Practice' || category === 'Build Chatbots') return 'project'
  if (category === 'Cloud Engineering' || category === 'AI Architecture' || category === 'AI Security') return 'architecture'
  if (category === 'Software Engineering' || category === 'AI Engineering' || category === 'Modern AI Systems' || category === 'Using AI') return 'engineering'
  return 'foundation'
}

const modeCopy: Record<ConceptMode, { kicker: string; center: string; labels: string[]; guidance: string }> = {
  foundation: { kicker: 'Build the mental model', center: 'Core idea', labels: ['Part 1', 'Part 2', 'Part 3'], guidance: 'Use the visual as a map: connect each part to the lesson goal and the example on the page.' },
  engineering: { kicker: 'Trace the mechanism', center: 'System behavior', labels: ['Input', 'Process', 'Outcome'], guidance: 'Follow the path from an input through the system to the outcome it produces.' },
  architecture: { kicker: 'See the system boundary', center: 'Design decision', labels: ['Requirement', 'Boundary', 'Tradeoff'], guidance: 'Start with the requirement, identify the system boundary, then weigh the tradeoffs.' },
  project: { kicker: 'Turn the idea into practice', center: 'Working capability', labels: ['Build', 'Check', 'Explain'], guidance: 'Build a small version, check how it behaves, then explain what you learned.' },
}

export function LessonConceptArea({ lesson, visual }: LessonConceptAreaProps) {
  const mode = getConceptMode(lesson.category)
  const copy = modeCopy[mode]
  if (!visual) return null

  return <section className={`lesson-concept-area lesson-concept-${mode}`} aria-labelledby="concept-view-title">
    <div className="lesson-concept-heading">
      <div>
        <p className="lesson-visual-kicker"><span className="lesson-concept-visual-label">Visual understanding</span>{copy.kicker}</p>
        <h2 id="concept-view-title">See how the pieces connect</h2>
      </div>
      <span className="lesson-concept-category">{lesson.category}</span>
    </div>
    <div className="lesson-concept-map" aria-label={`Animated visual understanding map for ${lesson.title}`}>
      <div className="lesson-concept-center"><span>{copy.center}</span><strong>{lesson.title}</strong></div>
      <div className="lesson-concept-flow" aria-hidden="true"><span>{copy.labels[0]}</span><i>→</i><span>{copy.labels[1]}</span><i>→</i><span>{copy.labels[2]}</span></div>
      {visual && <div className="lesson-concept-detail"><LessonVisual visual={visual} /></div>}
    </div>
    <p className="lesson-concept-note"><strong>How to read this:</strong> {copy.guidance}</p>
  </section>
}
