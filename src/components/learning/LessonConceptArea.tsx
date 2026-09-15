import type { Lesson } from '../../types/curriculum'
import type { LessonVisual as LessonVisualData } from '../../types/curriculum'
import { LessonVisual } from './LessonVisual'

interface LessonConceptAreaProps {
  lesson: Lesson
  learningPoints: string[]
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
  foundation: { kicker: 'Build the mental model', center: 'Core idea', labels: ['Inputs', 'Mechanism', 'Evidence'], guidance: 'Start with what goes in, follow the mechanism, then look for evidence that the idea is working.' },
  engineering: { kicker: 'Trace the mechanism', center: 'System behavior', labels: ['Input', 'Process', 'Outcome'], guidance: 'Follow the path from an input through the system to the outcome it produces.' },
  architecture: { kicker: 'See the system boundary', center: 'Design decision', labels: ['Requirement', 'Boundary', 'Tradeoff'], guidance: 'Start with the requirement, identify the system boundary, then weigh the tradeoffs.' },
  project: { kicker: 'Turn the idea into practice', center: 'Working capability', labels: ['Build', 'Check', 'Explain'], guidance: 'Build a small version, check how it behaves, then explain what you learned.' },
}

export function LessonConceptArea({ lesson, learningPoints, visual }: LessonConceptAreaProps) {
  const mode = getConceptMode(lesson.category)
  const copy = modeCopy[mode]
  const points = learningPoints.slice(0, 3)

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
      <div className="lesson-concept-points">
        {points.map((point, index) => <div className="lesson-concept-point" key={point}>
          <span className="lesson-concept-number">{String(index + 1).padStart(2, '0')}</span>
          <div><span className="lesson-concept-label">{copy.labels[index] ?? `Part ${index + 1}`}</span><p>{point}</p></div>
        </div>)}
      </div>
    </div>
    <p className="lesson-concept-note"><strong>How to read this:</strong> {copy.guidance}</p>
  </section>
}
