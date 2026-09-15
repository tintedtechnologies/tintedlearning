import type { ReactNode } from 'react'
import type { LessonVisual as LessonVisualData } from '../../types/curriculum'

interface LessonVisualProps {
  visual: LessonVisualData
}

const tokenParts = [
  { value: 'The', tone: 'bg-mist' },
  { value: ' model', tone: 'bg-sand' },
  { value: ' reads', tone: 'bg-[#d9e4f2]' },
  { value: ' small', tone: 'bg-[#f1d8d0]' },
  { value: ' pieces', tone: 'bg-mist' },
]

const embeddingPoints = [
  { label: 'cat', x: '24%', y: '28%', tone: 'bg-teal' },
  { label: 'kitten', x: '31%', y: '35%', tone: 'bg-teal' },
  { label: 'puppy', x: '66%', y: '62%', tone: 'bg-gold' },
  { label: 'car', x: '78%', y: '22%', tone: 'bg-[#9b7ab5]' },
]

const pipelineSteps = [
  ['Question', 'What is covered?'],
  ['Retrieve', 'Find relevant chunks'],
  ['Augment', 'Add evidence to context'],
  ['Generate', 'Answer with grounding'],
]

const agentSteps = [
  ['1', 'Observe', 'Read the goal and state'],
  ['2', 'Decide', 'Choose the next safe action'],
  ['3', 'Act', 'Call a permitted tool'],
  ['4', 'Check', 'Inspect the result or stop'],
]

function VisualFrame({ visual, children }: LessonVisualProps & { children: ReactNode }) {
  return <figure className="lesson-visual not-prose" aria-label={visual.description}>
    <div className="lesson-visual-canvas">{children}</div>
    <figcaption className="lesson-visual-caption">{visual.caption}</figcaption>
  </figure>
}

function TokensVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-5">
      <div>
        <p className="lesson-visual-kicker">Input text</p>
        <p className="mt-2 font-display text-2xl font-bold text-teal">The model reads small pieces</p>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Example text split into five token pieces">
        {tokenParts.map((part, index) => <span key={part.value} className={`rounded-xl border border-teal/10 px-3 py-2 text-sm font-bold text-ink ${part.tone}`}><span className="mr-2 text-xs text-muted">{index}</span>{part.value}</span>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="lesson-visual-note"><span>1</span><p>Text is split into pieces.</p></div>
        <div className="lesson-visual-note"><span>2</span><p>Pieces become IDs.</p></div>
        <div className="lesson-visual-note"><span>3</span><p>The model processes the sequence.</p></div>
      </div>
    </div>
  </VisualFrame>
}

function EmbeddingVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4">
      <div><p className="lesson-visual-kicker">Similarity space</p><p className="mt-2 font-display text-2xl font-bold text-teal">Nearby points represent related meaning</p></div>
      <div className="relative h-64 overflow-hidden rounded-2xl border border-teal/15 bg-white" aria-label="A conceptual two-dimensional embedding map">
        <div className="absolute inset-x-7 top-1/2 border-t border-dashed border-line" /><div className="absolute inset-y-7 left-1/2 border-l border-dashed border-line" />
        {embeddingPoints.map((point) => <div key={point.label} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: point.x, top: point.y }}><span className={`mx-auto block h-4 w-4 rounded-full ${point.tone}`} /><span className="mt-1 block text-xs font-bold text-ink">{point.label}</span></div>)}
        <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-widest text-muted">concept dimension</span><span className="absolute right-3 top-2 text-[10px] font-bold uppercase tracking-widest text-muted">meaning dimension</span>
      </div>
      <p className="text-sm leading-6 text-muted">The map is a simplified model. Real embeddings usually have many dimensions, and similarity depends on the task and data.</p>
    </div>
  </VisualFrame>
}

function RagVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Evidence before generation</p><p className="mt-2 font-display text-2xl font-bold text-teal">RAG keeps retrieval visible</p></div><div className="grid gap-2 md:grid-cols-4">{pipelineSteps.map(([title, detail], index) => <div key={title} className="flex items-center gap-2 md:block"><div className="lesson-visual-step"><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong></div><p className="text-sm leading-5 text-muted md:mt-2">{detail}</p>{index < pipelineSteps.length - 1 && <span className="hidden text-2xl text-gold md:block">→</span>}</div>)}</div></div>
  </VisualFrame>
}

function FunctionGraphVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="lesson-function-visual">
      <div>
        <p className="lesson-visual-kicker">Input → rule → output</p>
        <p className="mt-2 font-display text-2xl font-bold text-teal">A function makes a relationship visible</p>
      </div>
      <div className="lesson-function-layout">
        <div className="lesson-function-graph-wrap">
          <svg className="lesson-function-graph" viewBox="0 0 520 290" role="img" aria-labelledby="function-graph-title function-graph-description">
            <title id="function-graph-title">Graph of y equals 2x plus 1</title>
            <desc id="function-graph-description">The line rises from left to right. Sample points show that input 0 produces output 1, input 1 produces output 3, and input 2 produces output 5.</desc>
            <g className="lesson-function-grid" aria-hidden="true">
              {[70, 140, 210, 280, 350, 420].map((x) => <line key={`v-${x}`} x1={x} y1="25" x2={x} y2="245" />)}
              {[35, 80, 125, 170, 215].map((y) => <line key={`h-${y}`} x1="45" y1={y} x2="470" y2={y} />)}
            </g>
            <g className="lesson-function-axis" aria-hidden="true"><line x1="45" y1="245" x2="470" y2="245" /><line x1="45" y1="25" x2="45" y2="245" /></g>
            <g className="lesson-function-labels" aria-hidden="true"><text x="475" y="250">x</text><text x="35" y="18">y</text><text x="62" y="265">0</text><text x="203" y="265">1</text><text x="343" y="265">2</text><text x="6" y="219">1</text><text x="6" y="129">3</text><text x="6" y="39">5</text></g>
            <path className="lesson-function-line" d="M 45 200 L 395 20" />
            <g className="lesson-function-points" aria-hidden="true"><circle cx="45" cy="200" r="6" /><circle cx="185" cy="128" r="6" /><circle cx="325" cy="56" r="6" /></g>
            <circle className="lesson-function-trace" cx="45" cy="200" r="8"><animate attributeName="cx" values="45;185;325;45" dur="5s" repeatCount="indefinite" /><animate attributeName="cy" values="200;128;56;200" dur="5s" repeatCount="indefinite" /></circle>
          </svg>
        </div>
        <div className="lesson-function-explanation">
          <div><span className="lesson-function-equation">y = 2x + 1</span><p className="mt-2 text-sm leading-6 text-muted">The rule changes each input in the same way.</p></div>
          <dl className="lesson-function-values"><div><dt>x = 0</dt><dd>y = 1</dd></div><div><dt>x = 1</dt><dd>y = 3</dd></div><div><dt>x = 2</dt><dd>y = 5</dd></div></dl>
        </div>
      </div>
    </div>
  </VisualFrame>
}

function ProbabilityBarsVisual({ visual }: LessonVisualProps) {
  const values = [['cat', '70%', 'w-[70%]'], ['dog', '20%', 'w-[20%]'], ['rabbit', '10%', 'w-[10%]']] as const
  return <VisualFrame visual={visual}>
    <div className="space-y-4">
      <div><p className="lesson-visual-kicker">Possible outcomes</p><p className="mt-2 font-display text-2xl font-bold text-teal">Confidence is a distribution</p></div>
      <div className="lesson-probability-bars" aria-label="Probability bars for cat, dog, and rabbit">
        {values.map(([label, value, width], index) => <div className="lesson-probability-row" key={label}><span>{label}</span><div className="lesson-probability-track"><i className={width} style={{ animationDelay: `${index * 120}ms` }} /></div><strong>{value}</strong></div>)}
      </div>
      <p className="text-sm leading-6 text-muted">The largest bar is the model’s strongest guess, not a guarantee.</p>
    </div>
  </VisualFrame>
}

function WorkflowPipelineVisual({ visual }: LessonVisualProps) {
  const steps = ['Question', 'Data', 'Baseline', 'Evaluate', 'Ship']
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Repeatable workflow</p><p className="mt-2 font-display text-2xl font-bold text-teal">Build, measure, then improve</p></div><div className="lesson-workflow" aria-label="Question to data to baseline to evaluation to shipping"><div className="lesson-workflow-line" />{steps.map((step, index) => <div className="lesson-workflow-step" key={step} style={{ animationDelay: `${index * 120}ms` }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></div>)}</div><p className="text-sm leading-6 text-muted">Each pass creates evidence for the next decision.</p></div>
  </VisualFrame>
}

function AlgorithmSearchVisual({ visual }: LessonVisualProps) {
  const stages = [['1', '2', '3', '4', '5', '6', '7'], ['4', '5', '6', '7'], ['6', '7']] as const
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Algorithms in motion</p><p className="mt-2 font-display text-2xl font-bold text-teal">Different strategies change the work</p></div><div className="lesson-algorithm-demo"><section><span className="lesson-algorithm-title">Linear search</span><div className="lesson-linear-array" aria-label="A pointer checking values from left to right">{['2', '4', '6', '8', '10'].map((value, index) => <span key={value} style={{ animationDelay: `${index * 450}ms` }}>{value}</span>)}</div><p>Check one item at a time.</p></section><section><span className="lesson-algorithm-title">Binary search</span><div className="lesson-search-stages" aria-label="Binary search narrowing seven array values to the final match">{stages.map((stage, stageIndex) => <div className="lesson-search-stage" key={stage.join('-')} style={{ animationDelay: `${stageIndex * 500}ms` }}><span className="lesson-search-stage-label">{stageIndex === 0 ? 'Start' : stageIndex === 1 ? 'Narrow' : 'Match'}</span><div className="lesson-search-grid">{stage.map((value, index) => <span className={`lesson-search-cell ${index === Math.floor(stage.length / 2) ? 'lesson-search-active' : 'lesson-search-muted'}`} key={value}>{value}</span>)}</div></div>)}</div><p>Check the middle and discard half.</p></section><section><span className="lesson-algorithm-title">Sorting</span><div className="lesson-sort-bars" aria-label="Bars comparing and swapping until values are ordered">{[3, 7, 4, 9, 5].map((height, index) => <i key={height} style={{ height: `${height * 8}%`, animationDelay: `${index * 180}ms` }} />)}</div><p>Compare neighbors and swap out-of-order values.</p></section></div><p className="text-sm leading-6 text-muted">The data structure stays visible while each algorithm changes how it explores or rearranges the same values.</p></div>
  </VisualFrame>
}

function AlgorithmTraversalVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Graph traversal in motion</p><p className="mt-2 font-display text-2xl font-bold text-teal">A queue controls the order of work</p></div><div className="lesson-graph-visual" aria-label="Breadth-first traversal visits graph nodes A, B, C, and D in order"><svg viewBox="0 0 520 190" role="img" aria-hidden="true"><line className="lesson-graph-edge" x1="90" y1="95" x2="245" y2="48" /><line className="lesson-graph-edge" x1="90" y1="95" x2="245" y2="142" /><line className="lesson-graph-edge" x1="245" y1="48" x2="410" y2="95" /><line className="lesson-graph-edge" x1="245" y1="142" x2="410" y2="95" /><circle className="lesson-graph-node lesson-graph-node-a" cx="90" cy="95" r="25" /><circle className="lesson-graph-node lesson-graph-node-b" cx="245" cy="48" r="25" /><circle className="lesson-graph-node lesson-graph-node-c" cx="245" cy="142" r="25" /><circle className="lesson-graph-node lesson-graph-node-d" cx="410" cy="95" r="25" /><text className="lesson-graph-text" x="90" y="101">A</text><text className="lesson-graph-text" x="245" y="54">B</text><text className="lesson-graph-text" x="245" y="148">C</text><text className="lesson-graph-text" x="410" y="101">D</text></svg></div><div className="lesson-graph-steps"><span>1. Visit A</span><span>2. Queue B, C</span><span>3. Visit D</span></div><p className="text-sm leading-6 text-muted">The queue visits nearby nodes first; the visited set prevents repeated work.</p></div>
  </VisualFrame>
}

function DataCleaningVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Before and after</p><p className="mt-2 font-display text-2xl font-bold text-teal">Cleaning changes what the model sees</p></div><div className="lesson-cleaning-grid"><div><span className="lesson-cleaning-label">Raw data</span><div className="lesson-data-row"><b>NY</b><b>New York</b><b>NY</b><b>?</b></div></div><i>→</i><div><span className="lesson-cleaning-label">Consistent data</span><div className="lesson-data-row lesson-data-clean"><b>New York</b><b>New York</b></div></div></div><p className="text-sm leading-6 text-muted">The result is more consistent, but the cleaning rules should be documented.</p></div>
  </VisualFrame>
}

function ExperimentCompareVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Same test cases</p><p className="mt-2 font-display text-2xl font-bold text-teal">Compare one change fairly</p></div><div className="lesson-experiment-bars" aria-label="Baseline scores 72 percent and new approach scores 81 percent"><div><span>Baseline</span><div className="lesson-experiment-track"><i className="w-[72%]" /></div><strong>72%</strong></div><div><span>New idea</span><div className="lesson-experiment-track"><i className="w-[81%]" /></div><strong>81%</strong></div></div><p className="text-sm leading-6 text-muted">Because both versions saw the same cases, the difference is meaningful evidence.</p></div>
  </VisualFrame>
}

function PythonConceptVisual({ visual }: LessonVisualProps) {
  if (visual.type === 'python-values') return <VisualFrame visual={visual}><div className="space-y-4"><div><p className="lesson-visual-kicker">Python basics</p><p className="mt-2 font-display text-2xl font-bold text-teal">Values flow through instructions</p></div><div className="python-flow"><span>score = 82</span><i>→</i><span>if score ≥ 60</span><i>→</i><strong>pass</strong></div><p className="text-sm leading-6 text-muted">A condition chooses which result the program returns.</p></div></VisualFrame>
  if (visual.type === 'python-collections') return <VisualFrame visual={visual}><div className="space-y-4"><div><p className="lesson-visual-kicker">Data shapes</p><p className="mt-2 font-display text-2xl font-bold text-teal">Choose a container for the job</p></div><div className="python-collection-grid"><div><b>List</b><span>[ cat, dog ]</span><small>keeps order</small></div><div><b>Dictionary</b><span>{'{ name: Ada }'}</span><small>finds by key</small></div><div><b>Set</b><span>{'{ cat, dog }'}</span><small>keeps unique items</small></div></div><p className="text-sm leading-6 text-muted">The data structure makes the next operation easier to reason about.</p></div></VisualFrame>
  if (visual.type === 'python-files') return <VisualFrame visual={visual}><div className="space-y-4"><div><p className="lesson-visual-kicker">Files and errors</p><p className="mt-2 font-display text-2xl font-bold text-teal">Make failure paths visible</p></div><div className="python-file-flow"><span>open</span><i>→</i><span>read</span><i>→</i><span>close</span><strong>catch missing file</strong></div><p className="text-sm leading-6 text-muted">Good Python code handles resources and explains what went wrong.</p></div></VisualFrame>
  if (visual.type === 'python-analysis') return <VisualFrame visual={visual}><div className="space-y-4"><div><p className="lesson-visual-kicker">Inspect the data</p><p className="mt-2 font-display text-2xl font-bold text-teal">Measure before you model</p></div><div className="python-analysis-grid"><div><strong>4</strong><span>rows</span></div><div><strong>1</strong><span>missing</span></div><div><strong>3</strong><span>valid</span></div><div className="python-analysis-next">→ summarize</div></div><p className="text-sm leading-6 text-muted">Inspection reveals assumptions that a model would otherwise absorb silently.</p></div></VisualFrame>
  if (visual.type === 'python-api') return <VisualFrame visual={visual}><div className="space-y-4"><div><p className="lesson-visual-kicker">Request and response</p><p className="mt-2 font-display text-2xl font-bold text-teal">Python crosses an API boundary</p></div><div className="python-api-flow"><div><b>Python</b><span>client</span></div><i>→ request<br />← response</i><div><b>API</b><span>service</span></div></div><p className="text-sm leading-6 text-muted">The client validates status, timeout, and JSON fields before using the response.</p></div></VisualFrame>
  return <VisualFrame visual={visual}><div className="space-y-4"><div><p className="lesson-visual-kicker">Python AI project</p><p className="mt-2 font-display text-2xl font-bold text-teal">Compose small, testable parts</p></div><div className="python-project-flow">{['load', 'prepare', 'retrieve', 'model', 'validate', 'evaluate'].map((step, index) => <span key={step} style={{ animationDelay: `${index * 100}ms` }}>{step}</span>)}</div><p className="text-sm leading-6 text-muted">The model is one component inside a workflow you can inspect and improve.</p></div></VisualFrame>
}

function AiSystemFlowVisual({ visual }: LessonVisualProps) {
  const steps = visual.steps ?? ['Goal', 'Context', 'Model', 'Check', 'Outcome']
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">AI system in motion</p><p className="mt-2 font-display text-2xl font-bold text-teal">Follow the path, not just the output</p></div><div className="ai-system-flow" aria-label="An AI system flow from goal through context, model, checking, and outcome"><div className="ai-system-signal" />{steps.map((step, index) => <div className="ai-system-step" key={step} style={{ animationDelay: `${index * 120}ms` }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></div>)}</div><p className="text-sm leading-6 text-muted">Reliable AI work makes the information, model behavior, checks, and final result visible.</p></div>
  </VisualFrame>
}

function VectorSpaceVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4">
      <div><p className="lesson-visual-kicker">Representation space</p><p className="mt-2 font-display text-2xl font-bold text-teal">Features become a direction</p></div>
      <svg className="lesson-math-svg" viewBox="0 0 520 250" role="img" aria-label="Vector from the origin to the point 3, 2">
        <g className="lesson-math-grid"><line x1="50" y1="210" x2="480" y2="210" /><line x1="50" y1="210" x2="50" y2="25" /><line x1="150" y1="25" x2="150" y2="210" /><line x1="250" y1="25" x2="250" y2="210" /><line x1="350" y1="25" x2="350" y2="210" /><line x1="450" y1="25" x2="450" y2="210" /><line x1="50" y1="150" x2="480" y2="150" /><line x1="50" y1="90" x2="480" y2="90" /></g>
        <line className="lesson-math-axis" x1="50" y1="210" x2="480" y2="210" /><line className="lesson-math-axis" x1="50" y1="210" x2="50" y2="25" /><line className="lesson-vector-line" x1="50" y1="210" x2="350" y2="90" /><circle className="lesson-vector-point" cx="350" cy="90" r="8" /><text className="lesson-math-text" x="360" y="82">[3, 2]</text><text className="lesson-math-text" x="458" y="230">feature 1</text><text className="lesson-math-text" x="12" y="28">feature 2</text>
      </svg>
      <p className="text-sm leading-6 text-muted">The same numbers can be compared with other vectors using distance and direction.</p>
    </div>
  </VisualFrame>
}

function MatrixTransformVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4">
      <div><p className="lesson-visual-kicker">Transformation</p><p className="mt-2 font-display text-2xl font-bold text-teal">A matrix changes a representation</p></div>
      <div className="lesson-matrix-layout" aria-label="A matrix transforms vector 2 comma 1 into vector 2 comma 2"><div className="lesson-matrix-box"><span>W</span><b>1  0</b><b>0  2</b></div><i className="lesson-matrix-arrow">×</i><div className="lesson-matrix-vector"><span>x</span><b>2</b><b>1</b></div><i className="lesson-matrix-arrow">→</i><div className="lesson-matrix-vector lesson-matrix-result"><span>Wx</span><b>2</b><b>2</b></div></div>
      <p className="text-sm leading-6 text-muted">The shape rules make the operation valid; the values describe what changed.</p>
    </div>
  </VisualFrame>
}

function GradientDescentVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4">
      <div><p className="lesson-visual-kicker">Lower the loss</p><p className="mt-2 font-display text-2xl font-bold text-teal">Training moves downhill</p></div>
      <svg className="lesson-math-svg" viewBox="0 0 520 250" role="img" aria-label="A point stepping down a bowl-shaped loss curve toward its minimum">
        <path className="lesson-loss-curve" d="M 45 50 C 130 50, 160 205, 285 205 C 390 205, 400 62, 475 62" /><path className="lesson-loss-step" d="M 110 78 L 175 145 L 235 183 L 285 205" /><circle className="lesson-loss-dot" cx="110" cy="78" r="8"><animate attributeName="cx" values="110;175;235;285" dur="4s" repeatCount="indefinite" /><animate attributeName="cy" values="78;145;183;205" dur="4s" repeatCount="indefinite" /></circle><text className="lesson-math-text" x="42" y="235">higher loss</text><text className="lesson-math-text" x="255" y="235">lower loss</text>
      </svg>
      <p className="text-sm leading-6 text-muted">The gradient points uphill, so the update moves in the opposite direction.</p>
    </div>
  </VisualFrame>
}

function AgentVisual({ visual }: LessonVisualProps) {
  return <VisualFrame visual={visual}>
    <div className="space-y-4"><div><p className="lesson-visual-kicker">Bounded autonomy</p><p className="mt-2 font-display text-2xl font-bold text-teal">An agent repeats a controlled loop</p></div><div className="grid gap-3 sm:grid-cols-2">{agentSteps.map(([number, title, detail]) => <div key={title} className="lesson-visual-note flex gap-3"><span>{number}</span><div><p className="font-bold text-teal">{title}</p><p className="mt-1 text-sm leading-5 text-muted">{detail}</p></div></div>)}</div><div className="rounded-xl border border-gold/30 bg-sand px-4 py-3 text-sm font-bold text-teal">Stop condition: the goal is met, a limit is reached, or human approval is required.</div></div>
  </VisualFrame>
}

export function LessonVisual({ visual }: LessonVisualProps) {
  if (visual.type === 'tokens') return <TokensVisual visual={visual} />
  if (visual.type === 'embedding-space') return <EmbeddingVisual visual={visual} />
  if (visual.type === 'rag-pipeline') return <RagVisual visual={visual} />
  if (visual.type === 'function-graph') return <FunctionGraphVisual visual={visual} />
  if (visual.type === 'probability-bars') return <ProbabilityBarsVisual visual={visual} />
  if (visual.type === 'vector-space') return <VectorSpaceVisual visual={visual} />
  if (visual.type === 'matrix-transform') return <MatrixTransformVisual visual={visual} />
  if (visual.type === 'gradient-descent') return <GradientDescentVisual visual={visual} />
  if (visual.type === 'workflow-pipeline') return <WorkflowPipelineVisual visual={visual} />
  if (visual.type === 'algorithm-search') return <AlgorithmSearchVisual visual={visual} />
  if (visual.type === 'algorithm-sort') return <AlgorithmTraversalVisual visual={visual} />
  if (visual.type === 'data-cleaning') return <DataCleaningVisual visual={visual} />
  if (visual.type === 'experiment-compare') return <ExperimentCompareVisual visual={visual} />
  if (visual.type === 'python-values' || visual.type === 'python-collections' || visual.type === 'python-files' || visual.type === 'python-analysis' || visual.type === 'python-api' || visual.type === 'python-project') return <PythonConceptVisual visual={visual} />
  if (visual.type === 'ai-system-flow') return <AiSystemFlowVisual visual={visual} />
  return <AgentVisual visual={visual} />
}
