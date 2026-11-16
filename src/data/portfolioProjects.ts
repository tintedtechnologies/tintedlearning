import type { GuidedProject } from '../types/curriculum'

export const portfolioProjects: Record<string, GuidedProject> = {
  aiSystemEvaluation: {
    goal: 'Build a provider-neutral evaluation and observability harness for an AI feature. Define quality and safety expectations, compare a baseline with a changed version, inspect failures, and publish evidence about quality, cost, latency, and limitations.',
    prerequisites: ['Python basics, JSON, testing, APIs, evaluation, guardrails, and observability.', 'A small AI feature, retrieval workflow, or deterministic mock that can produce repeatable responses.', 'Synthetic or permissioned evaluation cases with no private user data.'],
    setup: ['Create a public repository named ai-system-evaluation.', 'Choose a bounded task such as support-answer drafting, document retrieval, structured extraction, or tool selection.', 'Create the files listed below and document the model/provider version or deterministic test double.', 'Keep API keys outside the repository and provide a local mock path so reviewers can run the harness without paid credentials.'],
    files: [
      { path: 'eval_cases.jsonl', purpose: 'Representative normal, difficult, ambiguous, adversarial, and refusal cases.' },
      { path: 'rubric.md', purpose: 'Scoring criteria for correctness, relevance, safety, format, and citation or tool behavior.' },
      { path: 'evaluator.py', purpose: 'Repeatable runner that records scores, latency, cost estimate, and failure categories.' },
      { path: 'results/', purpose: 'Versioned outputs, summaries, and selected failure examples.' },
      { path: 'threat-model.md', purpose: 'Assets, trust boundaries, abuse cases, mitigations, and residual risks.' },
      { path: 'README.md', purpose: 'Architecture, setup, evaluation method, results, limitations, and reproduction commands.' },
    ],
    platformNotes: ['Use deterministic checks for properties that can be checked deterministically; treat model graders as one signal that must be calibrated.', 'Never publish prompts, traces, or outputs containing personal, confidential, or customer data.', 'Record model name, provider, system instructions, retrieval corpus version, evaluator version, and date for every comparison.', 'A high average score is not enough. Show failures by category and explain which risks remain unresolved.'],
    dependencies: ['python -m pip install pytest pydantic', 'Optional provider SDK or local model server, isolated behind an adapter.'],
    steps: [
      { title: 'Define the task and rubric', instructions: ['Write the user, task, allowed behavior, refusal behavior, and important failure modes.', 'Create at least 30 cases across normal, edge, ambiguous, adversarial, and out-of-scope inputs.', 'Define a rubric with observable criteria and examples of pass, partial, and fail.'], checkpoint: 'A reviewer can tell what the system is supposed to do and what counts as a serious failure.' },
      { title: 'Build a baseline', instructions: ['Implement a simple baseline such as a keyword rule, retrieval-only answer, fixed schema, or small model.', 'Keep the provider call behind an adapter so the evaluator can use a local mock.', 'Run the baseline against the same cases that will evaluate future versions.'], checkpoint: 'The baseline produces a versioned result file with one record per case.' },
      { title: 'Measure quality and operations', instructions: ['Record rubric scores, latency, token or request usage when available, estimated cost, and errors.', 'Add deterministic checks for required fields, citations, forbidden claims, permissions, and tool arguments.', 'Store evaluator and case-set versions next to the results.'], commands: ['python evaluator.py --version baseline', 'pytest -q'], checkpoint: 'The same command can regenerate the summary and identify the cases behind the aggregate score.' },
      { title: 'Red-team and inspect failures', instructions: ['Add prompt injection, sensitive-data, unsafe-action, tool misuse, and context-confusion cases appropriate to the feature.', 'Group failures by cause and severity.', 'For each high-severity failure, document a mitigation, residual risk, and owner.'], checkpoint: 'The report shows at least one failure that changed the design or evaluation set.' },
      { title: 'Compare and publish', instructions: ['Run the changed version against the unchanged case set.', 'Compare quality, safety, latency, cost, and failure categories rather than only one score.', 'Publish the README, rubric, representative redacted results, threat model, and limitations.'], commands: ['python evaluator.py --version candidate', 'git diff -- results/'], checkpoint: 'A reviewer can reproduce the comparison and decide whether the candidate is an improvement for the intended use.' },
    ],
    verification: ['A clean checkout runs the evaluator with a local mock or documented provider setup.', 'The case set includes normal, edge, adversarial, and refusal behavior.', 'Results record quality, safety, latency, cost, and evaluator versions.', 'High-severity failures have mitigations and residual-risk owners.', 'The portfolio explains what the evaluation cannot prove and how it will evolve.'],
    nextSteps: ['Add traces from a staging environment with privacy filtering.', 'Run regression checks in CI for every prompt, model, retrieval, or tool change.', 'Compare a second provider or local model while keeping the task and case set fixed.'],
  },
}
