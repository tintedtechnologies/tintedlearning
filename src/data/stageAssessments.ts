import type { StageAssessment } from '../types/curriculum'

const question = (questionText: string, options: string[], answer: string, feedback: string) => ({
  question: questionText,
  options,
  answer,
  correctFeedback: feedback,
  incorrectFeedback: `Review the reasoning: ${feedback}`,
})

export const stageAssessments: Record<string, StageAssessment> = {
  foundation: {
    title: 'Foundation stage test',
    instructions: 'Use the ideas from this stage to explain a situation, choose a sound approach, and connect AI concepts to working code.',
    questions: [
      question('A music app recommends a song based on patterns in listening history. What makes this an AI use case?', ['It follows one fixed instruction every time', 'It finds patterns and produces a prediction or recommendation', 'It only stores the song title', 'It turns the phone on'], 'It finds patterns and produces a prediction or recommendation', 'AI is useful here because the system uses patterns in data to produce a recommendation for a new situation.'),
      question('A model performs well on its training examples but poorly on new examples. What should you investigate first?', ['Whether the model memorized the training examples and whether the evaluation data is representative', 'Whether to delete the evaluation data', 'Whether to report only the training score', 'Whether to make the model larger without checking the data'], 'Whether the model memorized the training examples and whether the evaluation data is representative', 'A model must be checked on suitable examples it did not train on. A strong training score alone does not show generalization.'),
      question('What is the best first step when a small Python program gives an unexpected result?', ['Change many lines at once', 'Read the output, isolate the smallest failing example, and change one assumption at a time', 'Hide the error with a broad exception handler', 'Start over without inspecting the evidence'], 'Read the output, isolate the smallest failing example, and change one assumption at a time', 'Debugging is evidence-based. The output and a small reproducible example help identify the cause.'),
    ],
  },
  'software-engineering': {
    title: 'Software Engineering stage test',
    instructions: 'Reason about boundaries, data, failure, testing, and delivery as one dependable system.',
    questions: [
      question('Why should an API validate inputs and outputs at its boundary?', ['To make failures and expectations explicit before bad data spreads', 'To make the service impossible to change', 'To remove the need for tests', 'To hide errors from callers'], 'To make failures and expectations explicit before bad data spreads', 'A boundary is where assumptions should be checked. Validation makes failures clearer and protects the rest of the system.'),
      question('A test passes locally but fails in CI because a package version differs. What practice addresses the root cause?', ['Record and reproduce the project environment and dependencies', 'Disable the CI test', 'Add more print statements only', 'Install packages globally on every machine'], 'Record and reproduce the project environment and dependencies', 'Reliable delivery depends on a repeatable environment, not on packages being installed by accident.'),
      question('Which test gives the strongest evidence for a function that transforms input data?', ['A test with representative inputs, expected outputs, and important edge cases', 'A test that only checks the function exists', 'A test that uses one happy-path value forever', 'No test because the function is short'], 'A test with representative inputs, expected outputs, and important edge cases', 'Good tests connect behavior to expected results and include cases likely to expose incorrect assumptions.'),
    ],
  },
  'ai-engineering': {
    title: 'AI Engineering stage test',
    instructions: 'Evaluate model-powered behavior as a system with prompts, data, tools, safeguards, and operating costs.',
    questions: [
      question('A retrieval system returns plausible but irrelevant documents. Which change should come before rewriting the final prompt?', ['Inspect the retrieval query, metadata filters, and evaluation cases', 'Increase temperature immediately', 'Remove all citations', 'Ask the model to be more confident'], 'Inspect the retrieval query, metadata filters, and evaluation cases', 'When evidence is irrelevant, inspect the retrieval path and measure it before changing generation behavior.'),
      question('Why should a tool-using agent have explicit permissions and stopping limits?', ['A model can request actions that the application must validate and bound', 'The model automatically understands organizational policy', 'Limits make evaluation unnecessary', 'Permissions are only needed for human users'], 'A model can request actions that the application must validate and bound', 'The application remains responsible for authorization, validation, resource limits, and safe stopping.'),
      question('What is a useful first evaluation for a new AI feature?', ['A representative case set with a clear rubric, baseline, and failure review', 'One impressive demo prompt', 'Only the average response length', 'A test that uses the same examples shown during development'], 'A representative case set with a clear rubric, baseline, and failure review', 'Evaluation needs representative cases and a comparison point so improvements and failures are visible.'),
    ],
  },
  'cloud-engineering': {
    title: 'Cloud Engineering stage test',
    instructions: 'Choose designs that account for identity, reliability, operations, deployment, and cost.',
    questions: [
      question('What is the shared responsibility model?', ['The provider and customer each own different parts of security and operation', 'The provider is responsible for every application decision', 'The customer is responsible for the provider hardware', 'Security is complete once a service is deployed'], 'The provider and customer each own different parts of security and operation', 'Cloud security is shared. The exact boundary depends on the service, configuration, identity, data, and application.'),
      question('What makes a deployment safer to operate?', ['A repeatable release, health checks, visible logs, and a rollback or recovery plan', 'A manual change with no record', 'A deployment that exposes secrets for debugging', 'A release that cannot be observed after launch'], 'A repeatable release, health checks, visible logs, and a rollback or recovery plan', 'Operations need evidence and a way to recover when a change behaves differently than expected.'),
      question('Why should cloud cost be considered during design?', ['Architecture choices change usage, capacity, latency, and operating cost', 'Cost is unrelated to system behavior', 'Cost can only be measured after the system is retired', 'The cheapest service is always the best design'], 'Architecture choices change usage, capacity, latency, and operating cost', 'Cost is a system constraint. It should be compared with quality, reliability, security, and performance.'),
    ],
  },
  'ai-architecture': {
    title: 'AI Architecture stage test',
    instructions: 'Defend system decisions by connecting requirements, constraints, failure modes, and tradeoffs.',
    questions: [
      question('What should an architecture decision record capture?', ['The decision, context, alternatives, tradeoffs, and conditions for revisiting it', 'Only the final technology name', 'A list of unrelated implementation tasks', 'A guarantee that the decision cannot change'], 'The decision, context, alternatives, tradeoffs, and conditions for revisiting it', 'An ADR preserves reasoning so another person can review the choice and know when it should be reconsidered.'),
      question('A distributed service sometimes processes the same request twice. Which design concern is most relevant?', ['Idempotency and how retries interact with side effects', 'Changing the user interface color', 'Removing all logs', 'Increasing the number of unrelated database columns'], 'Idempotency and how retries interact with side effects', 'Retries and partial failure can repeat work. Idempotency makes repeated requests safe or detectable.'),
      question('How should an architecture compare two possible designs?', ['State requirements, model important quality attributes, compare evidence, and name tradeoffs', 'Choose the newest technology automatically', 'Compare only the number of components', 'Avoid writing down assumptions'], 'State requirements, model important quality attributes, compare evidence, and name tradeoffs', 'Architecture is a reasoned comparison under constraints, not a popularity contest between technologies.'),
    ],
  },
  'professional-practice': {
    title: 'Technical Leadership stage test',
    instructions: 'Apply communication, discovery, planning, negotiation, and leadership judgment to ambiguous work.',
    questions: [
      question('What is the strongest early customer-discovery question?', ['Can you walk me through the last time this problem happened?', 'Would you buy our proposed solution?', 'Do you agree our idea is useful?', 'Which feature should we build first?'], 'Can you walk me through the last time this problem happened?', 'Past behavior and concrete examples provide stronger evidence than asking people to predict whether they would buy an idea.'),
      question('What makes a technical decision memo useful to a mixed audience?', ['A clear decision, context, implications, tradeoffs, and requested action', 'A long list of implementation details with no decision', 'Only unexplained technical vocabulary', 'A conclusion with no evidence'], 'A clear decision, context, implications, tradeoffs, and requested action', 'A decision memo helps readers act by making the decision and its reasoning easy to inspect.'),
      question('What is a good response when a plan meets new evidence?', ['Update the plan, explain the change, and make the new risk or learning checkpoint explicit', 'Hide the evidence to preserve the original deadline', 'Blame the person who found the problem', 'Continue unchanged because plans must never move'], 'Update the plan, explain the change, and make the new risk or learning checkpoint explicit', 'Planning under uncertainty requires visible learning and deliberate adjustment, not pretending the original assumptions were always correct.'),
    ],
  },
}
