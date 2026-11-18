import type { CurriculumModule, CurriculumStage, Lesson, LearningResource, PortfolioTrack } from '../types/curriculum'
import { advancedProviderCloudLessons } from './advancedProviderCloudLessons'
import { applyCloudTrackPlan, cloudTrackOrder } from './cloudTrackPlan'
import { engineeringExpansionLessons } from './engineeringExpansionLessons'
import { expansionSectionsLessons } from './expansionSectionsLessons'
import { foundationsExpansionLessons } from './foundationsExpansionLessons'
import { networkingIotLessons } from './networkingIotLessons'
import { orientationLessons } from './orientationLessons'
import { portfolioProjects } from './portfolioProjects'
import { providerCloudLessons } from './providerCloudLessons'
import { stageAssessments } from './stageAssessments'
import { structuredLessons } from './lessons'
import { readingMinutes } from './lessons/stats'

const supportingResources = {
  foundations: [
    { title: 'Introduction to Machine Learning', provider: 'Google for Developers', description: 'A practical overview of supervised learning, data, and model evaluation.', url: 'https://developers.google.com/machine-learning/intro-to-ml' },
  ],
  math: [
    { title: 'Algebra', provider: 'Khan Academy', description: 'Build comfort with equations, functions, graphs, and transformations.', url: 'https://www.khanacademy.org/math/algebra' },
    { title: 'Statistics and Probability', provider: 'Khan Academy', description: 'Practice distributions, probability, sampling, and statistical reasoning.', url: 'https://www.khanacademy.org/math/statistics-probability' },
    { title: 'Linear Algebra', provider: 'Khan Academy', description: 'Study vectors, matrices, transformations, and spaces used in model representations.', url: 'https://www.khanacademy.org/math/linear-algebra' },
    { title: 'Calculus 1', provider: 'Khan Academy', description: 'Learn limits, derivatives, and gradients that explain optimization.', url: 'https://www.khanacademy.org/math/calculus-1' },
    { title: 'Computer Programming', provider: 'Khan Academy', description: 'Strengthen programming fundamentals before working with data and models.', url: 'https://www.khanacademy.org/computing/computer-programming' },
    { title: 'Algorithms', provider: 'Khan Academy', description: 'Review algorithmic thinking, efficiency, and core data structures.', url: 'https://www.khanacademy.org/computing/computer-science/algorithms' },
    { title: 'Python Tutorial', provider: 'W3Schools', description: 'Practice Python syntax, files, data, and small programs before building AI projects.', url: 'https://www.w3schools.com/python/' },
    { title: 'Python Tutorial', provider: 'Python.org', description: 'Use the official Python tutorial as a reference while you work locally.', url: 'https://docs.python.org/3/tutorial/' },
  ],
  python: [
    { title: 'Python Tutorial', provider: 'Python.org', description: 'Use the official tutorial as a reference for syntax, control flow, data structures, files, and modules.', url: 'https://docs.python.org/3/tutorial/' },
    { title: 'Python beginner guide', provider: 'Python.org', description: 'Find beginner-friendly learning paths, setup guidance, and community resources.', url: 'https://wiki.python.org/moin/BeginnersGuide' },
    { title: 'Python tutorial', provider: 'W3Schools', description: 'Practice Python syntax interactively with short examples and exercises.', url: 'https://www.w3schools.com/python/' },
    { title: 'Automate the Boring Stuff', provider: 'Al Sweigart', description: 'Apply Python to practical files, text, spreadsheets, and automation tasks.', url: 'https://automatetheboringstuff.com/' },
  ],
  systems: [
    { title: 'Machine Learning Crash Course', provider: 'Google for Developers', description: 'Practice core machine learning concepts with explanations and exercises.', url: 'https://developers.google.com/machine-learning/crash-course' },
    { title: 'The Illustrated Transformer', provider: 'Jay Alammar', description: 'A visual explanation of attention and transformer architecture.', url: 'https://jalammar.github.io/illustrated-transformer/' },
  ],
  engineering: [
    { title: 'Hugging Face Course', provider: 'Hugging Face', description: 'Go deeper into transformers, datasets, tokenizers, and practical model work.', url: 'https://huggingface.co/learn' },
    { title: 'Full Stack Deep Learning', provider: 'Full Stack Deep Learning', description: 'Study the full lifecycle of building and operating AI applications.', url: 'https://fullstackdeeplearning.com/' },
  ],
  professional: [
    { title: 'The Mom Test', provider: 'Rob Fitzpatrick', description: 'Learn how to ask customer questions that uncover evidence instead of collecting polite opinions.', url: 'http://momtestbook.com/' },
    { title: 'Writing for busy readers', provider: 'Nielsen Norman Group', description: 'Study clear structure, scannability, and communication for people making decisions under time pressure.', url: 'https://www.nngroup.com/articles/how-users-read-on-the-web/' },
    { title: 'Making meetings matter', provider: 'Atlassian', description: 'Use agendas, decisions, owners, and follow-up to turn collaboration into progress.', url: 'https://www.atlassian.com/software/confluence/templates/meeting-notes' },
  ],
  security: [
    { title: 'OWASP Top 10 for LLM Applications', provider: 'OWASP', description: 'Study common security risks in large language model applications.', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
    { title: 'AI Risk Management Framework', provider: 'NIST', description: 'Use a current, vendor-neutral framework for governing, mapping, measuring, and managing AI risk.', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    { title: 'MITRE ATLAS', provider: 'MITRE', description: 'Explore adversary tactics and techniques for machine learning systems.', url: 'https://atlas.mitre.org/' },
  ],
}

const lessonCatalog: Lesson[] = [
  { id: 'godot-what-is-a-game-engine', title: 'What Is a Game Engine?', description: 'Learn the game loop, delta time, and scenes and nodes, the ideas every Godot game uses.', duration: 8, difficulty: 'Beginner', category: 'Game Development', order: 1 },
  { id: 'godot-first-project', title: 'Your First Godot Project', description: 'Install Godot, create a project, run the main scene and read the project folder.', duration: 8, difficulty: 'Beginner', category: 'Game Development', order: 2 },
  { id: 'godot-scenes-and-nodes', title: 'Building Scenes From Nodes', description: 'Build a player scene from nodes, save it and place it as an instance in a level.', duration: 8, difficulty: 'Beginner', category: 'Game Development', order: 3 },
  { id: 'gdscript-basics', title: 'GDScript Basics', description: 'Declare variables, write functions and use if statements in the language Godot uses for game code.', duration: 8, difficulty: 'Beginner', category: 'Game Development', order: 4 },
  { id: 'godot-player-movement', title: 'Player Movement', description: 'Read keyboard input, set a velocity and move a character that stops at walls.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 5 },
  { id: 'godot-collisions-and-pickups', title: 'Collisions and Pickups', description: 'Detect a coin with an Area2D, score once and remove the coin after pickup.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 6 },
  { id: 'godot-signals', title: 'Signals', description: 'Send messages between nodes so a coin can tell the level it was collected, without reaching into other nodes.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 7 },
  { id: 'godot-ui-and-game-over', title: 'Score, Menus and Game Over', description: 'Keep a score on screen with a CanvasLayer, lay out controls and restart the level with a button.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 8 },
  { id: 'godot-spawning-and-timers', title: 'Spawning With Timers', description: 'Spawn falling rocks with a Timer, create copies of a scene and remove them when they leave the screen.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 9 },
  { id: 'godot-saving-high-scores', title: 'Saving High Scores', description: 'Save and load a best score with ConfigFile, using a default for the first run.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 10 },
  { id: 'godot-coin-dash-capstone', title: 'Capstone: Ship Coin Dash', description: 'Combine the parts into one level, export it for your computer and share it with a README.', duration: 8, difficulty: 'Intermediate', category: 'Game Development', order: 11 },
  { id: 'vscode-setup-walkthrough', title: 'Set Up VS Code for Vibe Coding', description: 'Install VS Code, open a project folder, find the panels you need, and decide whether to trust a folder.', duration: 8, difficulty: 'Beginner', category: 'Vibe Coding', order: 100 },
  { id: 'install-an-ai-assistant', title: 'Install an AI Assistant', description: 'Check the plan, install GitHub Copilot, Claude Code, or the Codex CLI, sign in, and confirm it runs.', duration: 8, difficulty: 'Beginner', category: 'Vibe Coding', order: 101 },
  { id: 'project-rules-for-your-assistant', title: 'Give Your Assistant Project Rules', description: 'Write an instructions file the assistant reads, then test that it follows the rules in a new chat.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 102 },
  { id: 'permissions-and-approvals', title: 'Permissions and Approvals', description: 'Read each approval before you allow it, choose the narrowest permission, and use read-only mode for answers.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 103 },
  { id: 'prompt-injection-and-untrusted-text', title: 'Prompt Injection and Untrusted Text', description: 'Recognize instructions hidden in files and web pages, and limit what an assistant can do after reading them.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 104 },
  { id: 'checking-packages-before-install', title: 'Checking Packages Before You Install', description: 'Look up each suggested package on its official registry, install from a reviewed list, and use a virtual environment.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 105 },
  { id: 'vibe-coding-what-it-is', title: 'What Vibe Coding Is', description: 'Describe software in plain words, see where an AI assistant helps and where it does not, and start with a written goal.', duration: 8, difficulty: 'Beginner', category: 'Vibe Coding', order: 1 },
  { id: 'describing-a-goal-to-an-ai', title: 'Describing a Goal Clearly', description: 'Name inputs, outputs and rules, add examples with exact results, and ask for one change at a time.', duration: 8, difficulty: 'Beginner', category: 'Vibe Coding', order: 2 },
  { id: 'working-in-small-steps', title: 'Working in Small Steps', description: 'Split a feature into visible steps, run after each one and keep a short log of what changed.', duration: 8, difficulty: 'Beginner', category: 'Vibe Coding', order: 3 },
  { id: 'reading-ai-generated-code', title: 'Reading AI-Generated Code', description: 'Trace the data, spot shared default values and ask for a plain explanation of every line you keep.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 4 },
  { id: 'testing-ai-generated-code', title: 'Testing AI-Generated Code', description: 'Check normal, empty and bad input with tests that compare against answers you worked out.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 5 },
  { id: 'debugging-with-an-ai-assistant', title: 'Debugging With an AI Assistant', description: 'Read a traceback, write a useful bug report and reproduce the bug before you ask for a fix.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 6 },
  { id: 'checkpoints-with-git', title: 'Checkpoints With Git', description: 'Commit working code before each change, read the diff and restore the checkpoint when a change breaks things.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 7 },
  { id: 'safety-when-sharing-code', title: 'Safety When You Share Code', description: 'Keep secrets out of chats, avoid running user text as code and check input before the program relies on it.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 8 },
  { id: 'when-to-stop-prompting-and-design', title: 'When to Stop Prompting and Design', description: 'Recognize when fixes keep breaking each other, then write a one-page design and rebuild from it.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 9 },
  { id: 'vibe-coding-capstone', title: 'Capstone: A Small Tool You Can Explain', description: 'Build a small tool end to end, check it against requirements and explain it in an honest README.', duration: 8, difficulty: 'Intermediate', category: 'Vibe Coding', order: 10 },
  { id: 'what-is-ai', title: 'What is Artificial Intelligence?', description: 'Define AI and understand how modern systems use patterns to produce useful results.', duration: 5, difficulty: 'Beginner', category: 'AI Foundations', order: 1 },
  { id: 'how-ai-learns', title: 'How Does AI Learn?', description: 'Understand learning from examples, patterns, feedback, and generalization.', duration: 7, difficulty: 'Beginner', category: 'AI Foundations', order: 2 },
  { id: 'machine-learning', title: 'What is Machine Learning?', description: 'Distinguish AI, machine learning, deep learning, and hand-written rules.', duration: 8, difficulty: 'Beginner', category: 'AI Foundations', order: 3 },
  { id: 'data-and-evaluation', title: 'Data, Training, and Evaluation', description: 'Learn why data quality, held-out tests, and task-specific metrics matter.', duration: 10, difficulty: 'Beginner', category: 'AI Foundations', order: 4 },
  { id: 'ai-problem-solving', title: 'How AI Problems Are Framed', description: 'Turn a real-world goal into inputs, outputs, constraints, and an evaluation plan.', duration: 9, difficulty: 'Beginner', category: 'AI Foundations', order: 5 },
  { id: 'features-and-labels', title: 'Features and Labels: Describing Data to a Model', description: 'Choose the inputs a model sees and the answer it must predict, and build a feature table that lines up with its labels.', duration: 8, difficulty: 'Beginner', category: 'AI Foundations', order: 6 },
  { id: 'bias-in-training-data', title: 'Bias in Training Data', description: 'Find missing groups, measurement gaps, and biased labels, and compare outcomes across groups before you train.', duration: 8, difficulty: 'Beginner', category: 'AI Foundations', order: 7 },
  { id: 'errors-confidence-and-thresholds', title: 'Errors, Confidence, and Thresholds', description: 'Read a model score as confidence, choose a threshold from the cost of each mistake, and count false positives and negatives.', duration: 8, difficulty: 'Intermediate', category: 'AI Foundations', order: 8 },
  { id: 'geometry-and-trigonometry', title: 'Geometry and Trigonometry', description: 'Use the Pythagorean theorem and sine and cosine to find distances and sides, and see why radians are the natural unit.', duration: 10, difficulty: 'Intermediate', category: 'Math and Computing', order: 90 },
  { id: 'logic-and-proof', title: 'Logic and Proof', description: 'Build truth tables, tell a claim from its converse, and write direct and contradiction proofs.', duration: 10, difficulty: 'Intermediate', category: 'Math and Computing', order: 91 },
  { id: 'sequences-and-growth', title: 'Sequences and Growth', description: 'Work with arithmetic and geometric sequences, add up series, and compare linear with exponential growth.', duration: 10, difficulty: 'Intermediate', category: 'Math and Computing', order: 92 },
  { id: 'probability-and-statistics', title: 'Probability and Statistics', description: 'Build an intuitive foundation for chance, averages, spread, and evidence, from coin flips to medical tests.', duration: 12, difficulty: 'Intermediate', category: 'Math and Computing', order: 1 },
  { id: 'algebra-and-functions', title: 'Algebra and Functions', description: 'Build the language of variables, formulas, functions, graphs, and transformations.', duration: 12, difficulty: 'Beginner', category: 'Math and Computing', order: 2 },
  { id: 'vectors-and-representations', title: 'Vectors and Representations', description: 'Use lists of numbers to describe, compare, and combine things, from positions on a map to amounts in a recipe.', duration: 11, difficulty: 'Intermediate', category: 'Math and Computing', order: 3 },
  { id: 'matrices-and-linear-algebra', title: 'Matrices and Linear Algebra', description: 'See how rows and columns organize numbers, and how a matrix transforms points, shapes, and coordinates.', duration: 13, difficulty: 'Intermediate', category: 'Math and Computing', order: 4 },
  { id: 'calculus-and-gradients', title: 'Calculus and Rates of Change', description: 'Understand slopes, rates of change, and how many small steps add up to a total.', duration: 13, difficulty: 'Intermediate', category: 'Math and Computing', order: 5 },
  { id: 'programming-and-data-workflows', title: 'Programming and Data Workflows', description: 'See how code, data, baselines and repeatable steps fit together in an AI project.', duration: 10, difficulty: 'Intermediate', category: 'Math and Computing', order: 6 },
  { id: 'research-questions', title: 'Asking a Good Research Question', description: 'Turn a vague question into one you can test, name the groups and the measure, and write a prediction before looking at data.', duration: 8, difficulty: 'Intermediate', category: 'Research', order: 1 },
  { id: 'reading-research-papers', title: 'Reading a Research Paper', description: 'Find the claim and the comparison in a paper, judge its sample and measure, and look for what it did not test.', duration: 8, difficulty: 'Intermediate', category: 'Research', order: 5 },
  { id: 'reporting-results', title: 'Reporting Results Honestly', description: 'Write the answer with its likely range and limits, draw charts that show the true scale, and produce the report from one script.', duration: 8, difficulty: 'Intermediate', category: 'Research', order: 6 },
  { id: 'data-collection-and-cleaning', title: 'Data Collection and Cleaning', description: 'Collect data with consent and a clear plan, find messy values and clean them with written rules that anyone can repeat.', duration: 9, difficulty: 'Intermediate', category: 'Research', order: 2 },
  { id: 'experiment-design', title: 'Experiment Design', description: 'Compare groups fairly with a comparison group, random assignment and handling of confounders.', duration: 9, difficulty: 'Intermediate', category: 'Research', order: 3 },
  { id: 'optimization-and-training', title: 'Optimization', description: 'Find the best choice under a rule, such as the lowest cost or the shortest route, using steps that improve on each try.', duration: 12, difficulty: 'Intermediate', category: 'Math and Computing', order: 10 },
  { id: 'numerical-methods-for-ai', title: 'Numerical Methods', description: 'Understand approximation, rounding, stability, and when a computer answer is close enough.', duration: 16, difficulty: 'Advanced', category: 'Math and Computing', order: 11 },
  { id: 'statistical-inference-and-experiments', title: 'Statistical Inference and Experiments', description: 'Ask whether a gap could be chance, read a p-value and a confidence interval in plain words, and tell clear results from important ones.', duration: 12, difficulty: 'Advanced', category: 'Research', order: 4 },
  { id: 'mathematical-modeling-for-ai', title: 'Mathematical Modeling', description: 'Translate a real situation into variables, a formula, assumptions, and tests.', duration: 16, difficulty: 'Advanced', category: 'Math and Computing', order: 13 },
  { id: 'install-python-in-vs-code', title: 'Install Python in VS Code', description: 'Install Python on macOS, Windows, or Linux, add the VS Code Python extension, and run your first program.', duration: 6, difficulty: 'Beginner', category: 'Python', order: 1 },
  { id: 'python-basics', title: 'Running Python and Values', description: 'Run a Python program and work with variables, values, and basic expressions.', duration: 8, difficulty: 'Beginner', category: 'Python', order: 1 },
  { id: 'python-control-flow', title: 'Conditions and Loops', description: 'Use decisions and repetition to control what a Python program does.', duration: 9, difficulty: 'Beginner', category: 'Python', order: 2 },
  { id: 'python-functions', title: 'Functions and Reusable Code', description: 'Package instructions into functions that accept inputs and return results.', duration: 9, difficulty: 'Beginner', category: 'Python', order: 3 },
  { id: 'python-data-structures', title: 'Python Data Structures', description: 'Work with lists, dictionaries, tuples, sets, and the data AI programs use.', duration: 12, difficulty: 'Beginner', category: 'Python', order: 4 },
  { id: 'python-files-and-errors', title: 'Files and Paths', description: 'Read and write files safely while making paths and resources explicit.', duration: 9, difficulty: 'Beginner', category: 'Python', order: 5 },
  { id: 'python-errors-and-debugging', title: 'Errors and Debugging', description: 'Read tracebacks, handle exceptions, and turn failures into useful evidence.', duration: 9, difficulty: 'Beginner', category: 'Python', order: 6 },
  { id: 'python-packages-and-environments', title: 'Packages and Environments', description: 'Install dependencies and keep Python projects isolated and reproducible.', duration: 8, difficulty: 'Beginner', category: 'Python', order: 7 },
  { id: 'python-data-analysis', title: 'Python Data Analysis', description: 'Load, inspect, clean, and summarize data with Python.', duration: 14, difficulty: 'Intermediate', category: 'Python', order: 8 },
  { id: 'python-apis', title: 'Python APIs and JSON', description: 'Call web APIs, parse JSON, protect secrets, and build reusable clients.', duration: 14, difficulty: 'Intermediate', category: 'Python', order: 9 },
  { id: 'python-testing', title: 'Testing Python Programs', description: 'Use small repeatable checks to prove that Python code keeps working.', duration: 10, difficulty: 'Intermediate', category: 'Python', order: 10 },
  { id: 'python-ai-projects', title: 'Python for AI Projects', description: 'Combine Python, data, retrieval, and model APIs into a useful application.', duration: 14, difficulty: 'Intermediate', category: 'Python', order: 11 },
  { id: 'python-project-evaluation', title: 'Evaluating a Python AI Project', description: 'Build a baseline, inspect failures, and measure whether an AI project improves.', duration: 10, difficulty: 'Intermediate', category: 'Python', order: 12 },
  { id: 'python-search-and-sort', title: 'Python Algorithms: Search and Sort', description: 'Understand linear search, binary search, sorting, and the tradeoff between time and memory.', duration: 14, difficulty: 'Intermediate', category: 'Python', order: 13 },
  { id: 'python-recursion-and-graphs', title: 'Python Algorithms: Recursion and Graphs', description: 'Use recursion, stacks, queues, and graph traversal to solve connected problems.', duration: 14, difficulty: 'Intermediate', category: 'Python', order: 14 },
  { id: 'python-object-oriented-design', title: 'Object-Oriented Python', description: 'Model related state and behavior with classes while keeping responsibilities and interfaces clear.', duration: 16, difficulty: 'Advanced', category: 'Python', order: 15 },
  { id: 'python-iterators-generators', title: 'Iterators and Generators', description: 'Process large or streaming data lazily with the iterator protocol and generator functions.', duration: 15, difficulty: 'Advanced', category: 'Python', order: 16 },
  { id: 'python-typing-and-packages', title: 'Typing and Package Architecture', description: 'Use type hints, protocols, modules, and package boundaries to make Python systems easier to change.', duration: 16, difficulty: 'Advanced', category: 'Python', order: 17 },
  { id: 'python-developer-capstone', title: 'Python Developer Capstone', description: 'Design, implement, test, and document a maintainable Python service from a written specification.', duration: 24, difficulty: 'Advanced', category: 'Python', order: 18 },
  { id: 'customer-discovery-and-conversations', title: 'Customer Discovery and Conversations', description: 'Ask better questions, listen for evidence, and translate customer problems into testable opportunities.', duration: 16, difficulty: 'Advanced', category: 'Professional Practice', order: 1 },
  { id: 'technical-communication', title: 'Technical Communication', description: 'Explain complex systems to customers, peers, leaders, and non-technical partners with precision and empathy.', duration: 16, difficulty: 'Advanced', category: 'Professional Practice', order: 2 },
  { id: 'planning-under-uncertainty', title: 'Planning and Execution Under Uncertainty', description: 'Turn ambiguous goals into milestones, risks, decisions, and feedback loops without pretending the future is known.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 3 },
  { id: 'feedback-conflict-and-influence', title: 'Feedback, Conflict, and Influence', description: 'Handle disagreement, give useful feedback, and build alignment without relying on authority alone.', duration: 16, difficulty: 'Advanced', category: 'Professional Practice', order: 4 },
  { id: 'stakeholder-mapping-and-requirements', title: 'Stakeholder Mapping and Requirements', description: 'Map people, incentives, constraints, and competing definitions of success before committing to a solution.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 5 },
  { id: 'executive-writing-and-presentations', title: 'Executive Writing and Presentations', description: 'Build concise narratives, decision memos, and presentations that help senior audiences act on technical information.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 6 },
  { id: 'prioritization-and-tradeoffs', title: 'Prioritization and Tradeoffs', description: 'Choose what to do, defer, or stop using value, risk, evidence, and opportunity cost.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 7 },
  { id: 'negotiation-and-conflict-resolution', title: 'Negotiation and Conflict Resolution', description: 'Surface interests, separate positions from constraints, and reach durable agreements when priorities collide.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 8 },
  { id: 'mentoring-delegation-and-coaching', title: 'Mentoring, Delegation, and Coaching', description: 'Develop other people through clear expectations, deliberate delegation, feedback, and increasing autonomy.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 9 },
  { id: 'decision-making-and-organizational-systems', title: 'Decision-Making and Organizational Systems', description: 'Understand how incentives, decision rights, process design, and culture shape technical outcomes.', duration: 18, difficulty: 'Advanced', category: 'Professional Practice', order: 10 },
  { id: 'professional-leadership-practicum', title: 'Professional Leadership Practicum', description: 'Lead a small ambiguous initiative from stakeholder evidence through decision, delivery, and reflection.', duration: 28, difficulty: 'Advanced', category: 'Professional Practice', order: 11 },
  { id: 'scope-of-work-and-proposals', title: 'Scope of Work and Proposals', description: 'Write a clear scope that defines outcomes, deliverables, assumptions, exclusions, milestones, and acceptance criteria.', duration: 18, difficulty: 'Advanced', category: 'Professional Practice', order: 12 },
  { id: 'value-propositions-and-business-cases', title: 'Value Propositions and Business Cases', description: 'Connect a technical solution to customer value, measurable outcomes, cost, risk, and a credible investment case.', duration: 18, difficulty: 'Advanced', category: 'Professional Practice', order: 13 },
  { id: 'consultative-selling-and-discovery', title: 'Consultative Selling and Discovery', description: 'Sell by understanding the customer, qualifying fit, handling objections, and helping people make an informed decision.', duration: 18, difficulty: 'Advanced', category: 'Professional Practice', order: 14 },
  { id: 'solution-demos-and-storytelling', title: 'Solution Demos and Storytelling', description: 'Demonstrate a solution around a customer outcome, evidence, tradeoffs, and a clear next step instead of a feature tour.', duration: 17, difficulty: 'Advanced', category: 'Professional Practice', order: 15 },
  { id: 'commercial-negotiation-and-procurement', title: 'Commercial Negotiation and Procurement', description: 'Navigate budget, terms, risk, procurement constraints, and ethical negotiation without promising what the team cannot deliver.', duration: 18, difficulty: 'Advanced', category: 'Professional Practice', order: 16 },
  { id: 'math-research-capstone', title: 'Project: Mathematical AI Investigation', description: 'Formulate a question, derive a model, implement a baseline, and communicate what the evidence can support.', duration: 300, difficulty: 'Advanced', category: 'Projects and Practice', order: 7 },
  { id: 'neural-networks', title: 'A Gentle Introduction to Neural Networks', description: 'Follow neurons, layers and weights through a tiny worked example in numbers.', duration: 9, difficulty: 'Beginner', category: 'Modern AI Systems', order: 2 },
  { id: 'generative-ai', title: 'What is Generative AI?', description: 'Tell AI that creates apart from AI that picks, see what it can make and know when to check it.', duration: 7, difficulty: 'Beginner', category: 'Modern AI Systems', order: 1 },
  { id: 'transformers-and-attention', title: 'Transformers and Attention', description: 'Optional depth: how attention lets each word gather meaning from the others, in plain words.', duration: 11, difficulty: 'Beginner', category: 'Modern AI Systems', order: 5 },
  { id: 'large-language-models', title: 'What is a Large Language Model?', description: 'Understand next-token prediction, training versus using a model, and temperature.', duration: 8, difficulty: 'Beginner', category: 'Modern AI Systems', order: 4 },
  { id: 'multimodal-ai', title: 'Multimodal AI', description: 'Use AI with images and sound as well as text, and check what it reads and hears.', duration: 9, difficulty: 'Beginner', category: 'Modern AI Systems', order: 7 },
  { id: 'tokens', title: 'What are Tokens?', description: 'See how text becomes tokens, why counts differ from words and how tokens set limits and cost.', duration: 6, difficulty: 'Beginner', category: 'Modern AI Systems', order: 3 },
  { id: 'context-windows', title: 'What is a Context Window?', description: 'Learn what fits in one request, what gets dropped and why the model cannot tell.', duration: 7, difficulty: 'Beginner', category: 'Modern AI Systems', order: 6 },
  { id: 'inference-and-deployment', title: 'Inference and Deployment', description: 'See where response time goes, stream answers as they are written and choose how to serve a model.', duration: 9, difficulty: 'Intermediate', category: 'AI Engineering', order: 10 },
  { id: 'fine-tuning', title: 'Fine-Tuning and Adaptation', description: 'Decide between better prompts, RAG and fine-tuning, and prepare clean training examples.', duration: 9, difficulty: 'Intermediate', category: 'AI Engineering', order: 9 },
  { id: 'talk-to-ai', title: 'How to Talk to AI', description: 'Be specific, give context, follow up and check: the everyday habits that get useful answers.', duration: 6, difficulty: 'Beginner', category: 'Using AI', order: 1 },
  { id: 'prompt-engineering', title: 'Prompt Engineering', description: 'Write structured prompts with examples and step-by-step requests, and test them on several inputs.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 2 },
  { id: 'system-prompts', title: 'System Prompts', description: 'Write the standing instructions an app gives its assistant, and know what they cannot enforce.', duration: 7, difficulty: 'Beginner', category: 'Using AI', order: 3 },
  { id: 'structured-outputs', title: 'Structured Outputs', description: 'Get JSON from a model, validate it with Pydantic and turn notes into draft Study Tracker sessions.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 2 },
  { id: 'ai-assistants', title: 'AI Assistants', description: 'See what assistants add on top of a model, such as memory, files and tools, and choose one for a job.', duration: 7, difficulty: 'Beginner', category: 'Using AI', order: 4 },
  { id: 'hallucinations', title: 'AI Hallucinations', description: 'Learn why fluent answers can be false, where invented details hide and how to catch them.', duration: 7, difficulty: 'Beginner', category: 'Modern AI Systems', order: 8 },
  { id: 'evaluating-ai-responses', title: 'Evaluating AI Responses', description: 'Judge answers as correct, complete, sourced and safe, and compare prompts with a small test set.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 5 },
  { id: 'responsible-ai', title: 'Using AI Responsibly', description: 'Protect private information, watch for bias, disclose AI help and know when not to use AI.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 6 },
  { id: 'readable-code', title: 'Reading and Writing Good Code', description: 'Name things clearly, split long functions into small ones and review code kindly and usefully.', duration: 4, difficulty: 'Beginner', category: 'Software Engineering', order: 3 },
  { id: 'build-an-api', title: 'Build Your Own API', description: 'Build the first version of Study Tracker as a FastAPI app that saves and lists study sessions.', duration: 4, difficulty: 'Intermediate', category: 'Software Engineering', order: 5 },
  { id: 'config-and-secrets', title: 'Configuration and Secrets', description: 'Move settings and secrets out of your code and into the environment, and keep them out of Git.', duration: 4, difficulty: 'Intermediate', category: 'Software Engineering', order: 6 },
  { id: 'logging', title: 'Logging', description: 'Replace print with real log messages that help you find problems in Study Tracker later.', duration: 4, difficulty: 'Intermediate', category: 'Software Engineering', order: 9 },
  { id: 'software-engineering-capstone', title: 'Capstone: Build and Ship Study Tracker', description: 'Bring every lesson together into a finished, tested Study Tracker that a stranger can run.', duration: 4, difficulty: 'Intermediate', category: 'Software Engineering', order: 11 },
  { id: 'ai-apis', title: 'What is an AI API?', description: 'Call a model from Python through one ask_model() helper, with configuration, timeouts and retries.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 1 },
  { id: 'models', title: 'AI Models and Model Selection', description: 'Compare large and small, hosted and local, open and closed models, and choose with a test.', duration: 8, difficulty: 'Beginner', category: 'Modern AI Systems', order: 9 },
  { id: 'embeddings', title: 'Embeddings', description: 'Turn text into vectors, measure similarity and search your study notes by meaning.', duration: 9, difficulty: 'Intermediate', category: 'AI Engineering', order: 4 },
  { id: 'vector-databases', title: 'Vector Databases', description: 'Store note embeddings once, search them with filters and know when a dedicated database is worth it.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 5 },
  { id: 'rag', title: 'Retrieval-Augmented Generation', description: 'Answer questions from your notes with numbered sources, and say so when the notes do not know.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 6 },
  { id: 'tool-calling', title: 'Tool Calling', description: 'Let a model ask your code to log sessions and fetch totals, with every argument checked.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 3 },
  { id: 'ai-agents', title: 'AI Agents', description: 'Build a study-planning agent that loops, checks its work in code, stops in time and waits for approval.', duration: 9, difficulty: 'Intermediate', category: 'AI Engineering', order: 8 },
  { id: 'mcp', title: 'Model Context Protocol (MCP)', description: 'Offer Study Tracker\'s tools to any MCP app through a small server, and know when MCP is worth it.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 7 },
  { id: 'ai-observability', title: 'AI Observability and Operations', description: 'Log model calls safely, trace one request with an ID and spot when quality, speed or cost slips.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 11 },
  { id: 'ai-product-design', title: 'Designing AI Products', description: 'Set honest expectations, design for failure, show sources and let people correct the AI.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 13 },
  { id: 'ai-cost-and-performance', title: 'Cost, Latency, and Performance', description: 'Estimate AI costs from tokens, send less, use smaller models and cache repeated work.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 12 },
  { id: 'ai-governance', title: 'AI Governance and Documentation', description: 'Understand how teams document models, risks, data, and decisions.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 11 },
  { id: 'automate-a-real-task', title: 'Automate a Real Task with Python', description: 'Write a small script that tidies files, adds up spending from a CSV and renames photos by date, then publish it.', duration: 180, difficulty: 'Beginner', category: 'Projects and Practice', order: 1 },
  { id: 'analyze-a-public-dataset', title: 'Analyze a Public Dataset', description: 'Pick a public dataset, ask one question, clean the data with written rules, chart it and write an honest report with its limits.', duration: 360, difficulty: 'Intermediate', category: 'Projects and Practice', order: 5 },
  { id: 'build-for-a-real-client', title: 'Capstone: Build Something for a Real Client', description: 'Find a real client, run discovery, write a one-page scope they sign, build and deliver a small solution, and write a case study they approve.', duration: 1800, difficulty: 'Advanced', category: 'Projects and Practice', order: 8 },
  { id: 'build-a-chatbot', title: 'Ship a Chatbot People Can Use', description: 'Build a chatbot with a simple web page, streaming replies, per-user limits, safe logs, feedback and a container you can deploy.', duration: 480, difficulty: 'Intermediate', category: 'Projects and Practice', order: 2 },
  { id: 'security-basics', title: 'How Apps Get Attacked', description: 'Learn the basics every developer needs: untrusted input, injection, broken access, leaked secrets and the attack surface.', duration: 8, difficulty: 'Intermediate', category: 'AI Security', order: 1 },
  { id: 'ai-security', title: 'AI Security and Prompt Injection', description: 'Understand how untrusted instructions and data can manipulate AI applications.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 3 },
  { id: 'ai-threat-modeling', title: 'Threat Modeling AI Systems', description: 'Map assets, trust boundaries, attackers, and failure paths before building defenses.', duration: 11, difficulty: 'Intermediate', category: 'AI Security', order: 2 },
  { id: 'ai-identity-and-secrets', title: 'Identity, Access, and Secrets', description: 'Protect API keys, user data, tools, and model permissions.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 6 },
  { id: 'ai-privacy', title: 'Privacy and Sensitive Data', description: 'Understand data minimization, retention, leakage, and privacy-preserving design.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 7 },
  { id: 'ai-supply-chain', title: 'AI Supply Chain Security', description: 'Evaluate models, datasets, packages, plugins, and dependencies before trusting them.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 10 },
  { id: 'ai-rag-security', title: 'RAG and Vector Security', description: 'Secure document ingestion, retrieval, citations, permissions, and stored embeddings.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 4 },
  { id: 'ai-agent-security', title: 'Agent and Tool Security', description: 'Design safe permissions, sandboxing, validation, and approval for autonomous workflows.', duration: 11, difficulty: 'Intermediate', category: 'AI Security', order: 5 },
  { id: 'ai-poisoning-and-abuse', title: 'Poisoning, Model Abuse, and Extraction', description: 'Recognize training-data poisoning, model theft, evasion, and harmful use.', duration: 11, difficulty: 'Intermediate', category: 'AI Security', order: 8 },
  { id: 'ai-availability-and-cost', title: 'Availability, Denial of Service, and Cost Abuse', description: 'Protect AI services from overload, runaway tools, and uncontrolled spending.', duration: 9, difficulty: 'Intermediate', category: 'AI Security', order: 9 },
  { id: 'ai-secure-deployment', title: 'Secure Deployment and Incident Response', description: 'Operate AI systems with isolation, monitoring, response plans, and recovery.', duration: 12, difficulty: 'Intermediate', category: 'AI Security', order: 11 },
  { id: 'capstone-rag', title: 'Project: Build a Knowledge Assistant', description: 'Build a complete retrieval-augmented AI application from data to evaluation.', duration: 360, difficulty: 'Intermediate', category: 'Projects and Practice', order: 3 },
  { id: 'capstone-agent', title: 'Project: Design a Tool-Using Agent', description: 'Build an agent with goals, tools, permissions, limits, and tests.', duration: 360, difficulty: 'Intermediate', category: 'Projects and Practice', order: 4 },
  { id: 'capstone-evaluation', title: 'Project: Evaluate an AI System', description: 'Create an evaluation plan that measures quality, safety, cost, and reliability.', duration: 300, difficulty: 'Intermediate', category: 'Projects and Practice', order: 6 },
  ...orientationLessons,
  ...networkingIotLessons,
  ...foundationsExpansionLessons,
  ...engineeringExpansionLessons,
  ...expansionSectionsLessons,
  ...providerCloudLessons,
  ...advancedProviderCloudLessons,
]

// Foundations cloud and programming lessons are written at true beginner level.
const beginnerFoundationIds = new Set(['cloud-fundamentals', 'iam-security', 'cloud-storage-compute', 'cloud-networking', 'containers-serverless', 'ci-cd', 'infrastructure-as-code', 'programming-and-data-workflows', 'networking-how-devices-connect', 'networking-ip-addresses-and-subnets', 'networking-dns-names-to-addresses', 'networking-ports-and-protocols', 'networking-troubleshooting-a-connection', 'iot-what-is-it', 'iot-sensors-and-readings', 'iot-connectivity-choices', 'iot-device-messages', 'iot-security-basics'])

// Reading time for rewritten lessons is calculated from their word count, never typed by hand.
export const lessons: Lesson[] = lessonCatalog.map(applyCloudTrackPlan).map((lesson) => {
  const structured = structuredLessons[lesson.id]
  if (!structured) return lesson
  return { ...lesson, duration: readingMinutes(structured), difficulty: beginnerFoundationIds.has(lesson.id) ? 'Beginner' : lesson.difficulty }
})

const resource = (title: string, provider: string, description: string, url: string): LearningResource => ({ title, provider, description, url })

const sourceMapResources = {
  foundations: supportingResources.foundations,
  math: supportingResources.math,
  python: supportingResources.python,
  security: supportingResources.security,
  git: [resource('Git handbook', 'Git SCM', 'Learn the core workflow for commits, branches, merges, and history.', 'https://git-scm.com/book/en/v2')],
  linux: [resource('The Linux command line', 'Linux Foundation', 'Build confidence navigating files, processes, permissions, and pipes.', 'https://training.linuxfoundation.org/resources/?_sft_content-type=free-course')],
  web: [resource('HTTP overview', 'MDN Web Docs', 'Understand requests, responses, methods, headers, status codes, and browser-server boundaries.', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview')],
  sql: [resource('SQL tutorial', 'W3Schools', 'Practice querying, filtering, joining, grouping, and updating relational data.', 'https://www.w3schools.com/sql/')],
  testing: [resource('Python testing guide', 'Python.org', 'Use the standard library to write repeatable tests for small programs.', 'https://docs.python.org/3/library/unittest.html')],
  docker: [resource('Get started with Docker', 'Docker', 'Learn images, containers, volumes, networks, and repeatable environments.', 'https://docs.docker.com/get-started/')],
  azure: [resource('Azure fundamentals', 'Microsoft Learn', 'Learn Azure concepts, services, identity, and architecture through free learning paths.', 'https://learn.microsoft.com/en-us/training/azure/')],
  aws: [resource('AWS Cloud Practitioner', 'AWS', 'Build a provider-specific foundation in cloud services, security, pricing, and operations.', 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/')],
  gcp: [resource('Google Cloud basics', 'Google Cloud', 'Explore core Google Cloud services, architecture, and hands-on labs.', 'https://www.cloudskillsboost.google/paths/8')],
  architecture: [resource('Architecture fundamentals', 'Microsoft Learn', 'Practice designing systems around requirements, tradeoffs, reliability, and cost.', 'https://learn.microsoft.com/en-us/azure/architecture/guide/')],
  professional: supportingResources.professional,
  iac: [resource('Terraform tutorials', 'HashiCorp', 'Learn infrastructure as code by provisioning and changing infrastructure declaratively.', 'https://developer.hashicorp.com/terraform/tutorials')],
}

const modulePrerequisites: Record<string, string[]> = {
  'game-development': ['Basic programming: variables, functions, and if statements. Python helps, but it is not required.', 'Godot, a free game engine, installed on your computer.'],
  'vibe-coding': ['Python basics: functions, lists, dictionaries, and running a script.', 'Git basics from the Software Engineering section: commit, status and diff.'],
  'software-design': ['Basic Python functions and reading code.', 'The Software Engineering lessons on readable code.'],
  'error-handling': ['Python functions and exceptions.', 'A working Study Tracker API.'],
  'team-practice': ['Git basics: commit, branch and push.', 'A small change to practice on.'],
  'networking-foundations': ['Basic computer use and a willingness to use a terminal.', 'Python basics for the address and check exercises. Optional for the concepts.'],
  'iot-foundations': ['Basic computer use. Python basics help for the reading and message exercises.', 'Networking Foundations is helpful for the connection and security lessons.'],
  'ai-fundamentals': ['No prior AI knowledge.'],
  'computing-math': ['AI fundamentals or equivalent curiosity about how software learns.'],
  'research-methods': ['Probability and statistics for AI from the Math section.', 'Python basics: functions, loops and reading files.'],
  python: ['Basic computer use: files, folders, and opening a terminal.', 'No prior Python or advanced mathematics is required.', 'A computer with Python 3.12+ and a text editor or VS Code.', 'Willingness to type, run, and modify small programs before moving to AI-specific code.'],
  'git-github': ['A small Python project or willingness to create one.', 'A GitHub account for publishing work.'],
  'linux-cli': ['Basic computer use and a willingness to use a terminal.'],
  'apis-rest': ['Python basics and functions.', 'Basic request/response vocabulary.'],
  'http-networking': ['APIs and REST basics.', 'Basic client/server vocabulary.'],
  'databases-sql': ['Python or another programming language.', 'Basic data structures and application state.'],
  'data-structures': ['Python basics and simple algorithms.'],
  'code-quality': ['Python functions and Git basics.'],
  'logging': ['A working Study Tracker API from Build Your Own API.'],
  'software-engineering-capstone': ['The first ten Software Engineering lessons.'],
  'ai-apis': ['The Python and Software Engineering sections, with a working Study Tracker.'],
  'testing-debugging': ['Python files, functions, and exceptions.', 'A small program that can fail and be tested.'],
  docker: ['A working application and basic Linux/CLI commands.'],
  llms: ['The Foundations section. No coding needed.'],
  prompting: ['How modern AI works. No coding needed.'],
  observability: ['Building with AI, and the Software Engineering lesson Logging.'],
  'cloud-fundamentals': ['Basic familiarity with files, applications, and the internet.', 'A billing-aware cloud learning account is optional for practice.'],
  'azure-track': ['Cloud fundamentals and IAM concepts.', 'An Azure subscription for hands-on work.'],
  'aws-track': ['Cloud fundamentals and IAM concepts.', 'An AWS account for hands-on work.'],
  'gcp-track': ['Cloud fundamentals and IAM concepts.', 'A Google Cloud project with billing enabled for hands-on work.'],
  'iam-security': ['Cloud fundamentals and authentication versus authorization.'],
  'cloud-storage-compute': ['Cloud fundamentals and basic data persistence concepts.'],
  'cloud-networking': ['HTTP/networking basics and cloud fundamentals.'],
  'containers-serverless': ['Docker basics and cloud compute concepts.'],
  'ci-cd': ['Git/GitHub, testing, Docker, and one deployable application.'],
  'infrastructure-as-code': ['Cloud fundamentals, IAM, and Git.', 'A disposable cloud project with budget alerts.'],
  'system-design': ['Software engineering, APIs, databases, and cloud fundamentals.'],
  'distributed-systems': ['HTTP/networking, databases, queues, and system-design basics.'],
  scalability: ['System design, distributed systems, and basic performance metrics.'],
  reliability: ['Distributed systems, observability, and basic incident-response vocabulary.'],
  'security-governance': ['AI security, IAM, privacy, and threat modeling.'],
  'cost-optimization': ['Cloud fundamentals, model selection, observability, and basic arithmetic.'],
  'architecture-patterns': ['System design and distributed-systems basics.'],
  'enterprise-integration': ['APIs, databases, IAM, and system design.'],
  'architecture-decision-records': ['System design and experience comparing technical tradeoffs.'],
  'professional-practice': ['No programming background is required.', 'Willingness to listen, write clearly, and revise your approach from evidence.'],
  'customer-discovery': ['No programming background is required.', 'Willingness to speak with people about their real work and record evidence.'],
  'scope-and-requirements': ['Customer discovery or equivalent evidence about a real problem.', 'Willingness to define boundaries and negotiate a clear commitment.'],
  'value-and-business-cases': ['A scoped problem and a basic understanding of its users and outcomes.', 'Willingness to work with estimates, assumptions, and tradeoffs.'],
  'consultative-selling': ['Customer discovery and problem framing.', 'A solution or service that can be evaluated honestly for fit.'],
  'solution-storytelling': ['A customer problem, scoped solution, and at least one credible proof point.', 'Willingness to demonstrate limits as well as the happy path.'],
  'communication': ['No programming background is required.', 'Willingness to write, present, and revise for a real audience.'],
  'planning-and-execution': ['No programming background is required.', 'A small ambiguous initiative or realistic case to plan.'],
  'collaboration-and-influence': ['No programming background is required.', 'Willingness to practice direct, respectful conversations.'],
  'leadership-systems': ['No programming background is required.', 'Interest in how people, incentives, and decisions shape outcomes.'],
  'leadership-practicum': ['Completion of the professional-practice modules or equivalent experience.', 'A real or simulated initiative with stakeholders, constraints, and a decision to make.'],
  'commercial-practice': ['Completion of customer discovery, scope, value, and communication lessons or equivalent experience.', 'A real or simulated solution that can be scoped, valued, and explained to a buyer.'],
  'math-project': ['Probability, linear algebra, calculus, Python, and experiment design.'],
  'developer-project': ['Foundations and Software Engineering, or equivalent experience.'],
  'starter-project': ['Python basics: variables, functions, files and errors.'],
  'data-project': ['Python data analysis and the probability and statistics lessons.'],
  'client-project': ['Customer discovery, scope and communication lessons from Technical Leadership.'],
  'engineer-project': ['AI Developer software foundations plus LLM, RAG, tools, and evaluation basics.'],
  'architecture-project': ['AI Engineering systems knowledge plus cloud and architecture fundamentals.'],
}

function getModulePrerequisites(id: string) {
  const prerequisites = modulePrerequisites[id]
  if (!prerequisites) throw new Error(`Missing prerequisites for curriculum module: ${id}`)
  return prerequisites
}

const moduleWithLessons = (id: string, title: string, description: string, moduleLessons: Lesson[], resources?: LearningResource[], provider: CurriculumModule['provider'] = 'shared'): CurriculumModule => ({ id, title, description, lessons: moduleLessons, prerequisites: getModulePrerequisites(id), resources, provider })

const resourceModule = (id: string, title: string, description: string, resources: LearningResource[], provider: CurriculumModule['provider'] = 'shared'): CurriculumModule => ({ id, title, description, lessons: [], prerequisites: getModulePrerequisites(id), resources, provider, status: 'coming-soon' })

const lessonIds = (...ids: string[]) => lessons.filter((lesson) => ids.includes(lesson.id))
// Keeps the lessons in the order given, for modules whose order is set by the section plan.
const lessonsInOrder = (...ids: string[]) => ids.map((id) => {
  const lesson = lessons.find((item) => item.id === id)
  if (!lesson) throw new Error(`Unknown lesson: ${id}`)
  return lesson
})
const providerLessons = (provider: 'azure' | 'aws' | 'gcp') => lessons.filter((lesson) => lesson.id === `${provider}-track` || lesson.id.startsWith(`${provider}-`)).sort((a, b) => cloudTrackOrder(a.id) - cloudTrackOrder(b.id))

export const curriculumStages: CurriculumStage[] = [
  {
    id: 'foundation', eyebrow: 'Stage 01', title: 'Foundation', tone: 'teal', assessment: stageAssessments.foundation, learnerOutcome: { understand: 'How AI, computing, math, and Python fit together.', build: 'A first working Python program and small concept experiments.', show: 'A learning plan, working examples, and your first project notes.' },
    description: 'Build the mental models, programming habits, and working environment that make later engineering concepts stick.',
    modules: [
      moduleWithLessons('ai-fundamentals', 'AI fundamentals', 'Understand what AI is, how learning systems work, and how to frame useful problems.', lessons.filter((lesson) => lesson.category === 'AI Foundations'), sourceMapResources.foundations),
      moduleWithLessons('computing-math', 'Computing and math', 'Build intuition for algorithms, data, probability, vectors, matrices, and optimization.', lessons.filter((lesson) => lesson.category === 'Math and Computing'), sourceMapResources.math),
      moduleWithLessons('python', 'Python', 'Learn Python from the ground up: write scripts, organize data, call APIs, handle errors, and build the application code used throughout the AI pathway.', lessons.filter((lesson) => lesson.category === 'Python'), sourceMapResources.python),
      moduleWithLessons('git-github', 'Git and GitHub', 'Track changes, collaborate, review code, and publish a portfolio of your work.', lessonIds('git-github'), sourceMapResources.git),
      moduleWithLessons('linux-cli', 'Linux and the CLI', 'Navigate systems, automate repeatable work, and understand the environment where software runs.', lessonIds('linux-cli'), sourceMapResources.linux),
    ],
  },
  {
    id: 'software-engineering', eyebrow: 'Stage 02', title: 'Software Engineering', tone: 'gold', assessment: stageAssessments['software-engineering'], learnerOutcome: { understand: 'How reliable applications use boundaries, data, tests, and deployment practices.', build: 'A tested service with a clear API, persistence, and delivery workflow.', show: 'A repository with tests, setup instructions, design decisions, and repeatable delivery.' },
    description: 'Learn the durable software practices around AI systems: boundaries, persistence, correctness, and repeatable delivery.',
    modules: [
      moduleWithLessons('code-quality', 'Readable code', 'Write code other people can read, change and review.', lessonIds('readable-code'), sourceMapResources.git),
      moduleWithLessons('software-design', 'Software design', 'Give each part one job, pass in what it needs, and keep the connections between parts small.', lessonIds('software-design-basics'), sourceMapResources.git),
      moduleWithLessons('http-networking', 'HTTP and the web', 'Follow requests and responses between apps and servers.', lessonIds('http-networking'), sourceMapResources.web),
      moduleWithLessons('apis-rest', 'Build an API', 'Build Study Tracker as a FastAPI app, with settings and secrets kept out of the code.', lessonIds('build-an-api', 'config-and-secrets'), sourceMapResources.web),
      moduleWithLessons('databases-sql', 'Databases and SQL', 'Store Study Tracker data in SQLite and query it with SQL.', lessonIds('databases-sql'), sourceMapResources.sql),
      moduleWithLessons('data-structures', 'Data structures', 'Choose structures and algorithms that make application behavior correct and efficient.', lessonIds('python-data-structures'), sourceMapResources.math),
      moduleWithLessons('testing-debugging', 'Testing a whole app', 'Test every endpoint against a test database and run the tests on every push.', lessonIds('python-files-and-errors', 'testing-debugging'), sourceMapResources.testing),
      moduleWithLessons('error-handling', 'Errors and reliability', 'Separate user errors from system failures, keep messages safe, and retry only what can recover.', lessonIds('handling-errors-and-reliability'), sourceMapResources.testing),
      moduleWithLessons('logging', 'Logging', 'Record what Study Tracker does so you can find problems later.', lessonIds('logging'), sourceMapResources.testing),
      moduleWithLessons('docker', 'Docker', 'Package Study Tracker so it runs the same way on any computer.', lessonIds('docker'), sourceMapResources.docker),
      moduleWithLessons('team-practice', 'Planning and teamwork', 'Work in small changes, define done, plan against capacity, and review code well.', lessonIds('planning-small-changes', 'code-review-and-teamwork'), sourceMapResources.git),
      moduleWithLessons('software-engineering-capstone', 'Capstone', 'Finish and ship Study Tracker as a portfolio piece.', lessonIds('software-engineering-capstone'), sourceMapResources.git),
    ],
  },
  {
    id: 'ai-engineering', eyebrow: 'Stage 03', title: 'AI Engineering', tone: 'teal', assessment: stageAssessments['ai-engineering'], learnerOutcome: { understand: 'How models, prompts, retrieval, tools, evaluation, and operations work together.', build: 'A useful AI application with evidence, guardrails, and observable behavior.', show: 'An AI project with evaluation cases, traces, tradeoffs, and documented limits.' },
    description: 'Compose models, prompts, data, tools, evaluation, and operations into useful AI applications.',
    modules: [
      moduleWithLessons('llms', 'How modern AI works', 'What generative AI is, how language models turn tokens into text, and where they go wrong.', lessonsInOrder('generative-ai', 'neural-networks', 'tokens', 'large-language-models', 'transformers-and-attention', 'context-windows', 'multimodal-ai', 'hallucinations', 'models')),
      moduleWithLessons('prompting', 'Using AI well', 'Everyday habits, prompts, system prompts, assistants, evaluation and responsible use.', lessonsInOrder('talk-to-ai', 'prompt-engineering', 'system-prompts', 'ai-assistants', 'evaluating-ai-responses', 'responsible-ai')),
      moduleWithLessons('ai-apis', 'Building with AI', 'Add AI features to Study Tracker: model calls, structured output, tools, retrieval, MCP, agents and streaming.', lessonsInOrder('ai-apis', 'structured-outputs', 'tool-calling', 'embeddings', 'vector-databases', 'rag', 'mcp', 'ai-agents', 'fine-tuning', 'inference-and-deployment', 'open-models-and-running-locally'), sourceMapResources.web),
      moduleWithLessons('observability', 'Running AI in production', 'Observe, control the cost of and design the experience around Study Tracker\'s AI features.', lessonsInOrder('ai-observability', 'measuring-classifier-performance', 'ai-cost-and-performance', 'ai-product-design')),
    ],
  },
  {
    id: 'cloud-engineering', eyebrow: 'Stage 04', title: 'Cloud Engineering', tone: 'neutral', assessment: stageAssessments['cloud-engineering'], learnerOutcome: { understand: 'How cloud platforms provide identity, storage, compute, networking, and operations.', build: 'A deployed service with secure identity, monitoring, cost awareness, and rollback thinking.', show: 'A deployed workload, architecture diagram, provider choice, and certification preparation evidence.' },
    description: 'Learn the shared cloud vocabulary, then choose a provider track for hands-on deployment and operations.',
    modules: [
      moduleWithLessons('cloud-fundamentals', 'Cloud Fundamentals', 'Learn portable concepts behind every provider: shared responsibility, identity, compute, storage, networking, containers, serverless, delivery, and infrastructure as code.', lessonIds('cloud-fundamentals', 'iam-security', 'cloud-storage-compute', 'cloud-networking', 'containers-serverless', 'ci-cd', 'infrastructure-as-code', 'cloud-service-models', 'latency-and-regions', 'backups-and-recovery-basics', 'cloud-costs-and-budgets', 'monitoring-and-logs-basics', 'cloud-foundations-checkpoint'), [...sourceMapResources.azure, ...sourceMapResources.aws, ...sourceMapResources.gcp]),
      moduleWithLessons('azure-track', 'Azure Cloud Engineering', 'Master Azure foundations, governance, identity, compute, data, networking, containers, events, security, resilience, AI platforms, operations, cost, deployment, and enterprise architecture.', providerLessons('azure'), sourceMapResources.azure, 'azure'),
      moduleWithLessons('aws-track', 'AWS Cloud Engineering', 'Master AWS foundations, multi-account governance, IAM, compute, data, networking, containers, events, security, resilience, AI platforms, operations, cost, deployment, and enterprise architecture.', providerLessons('aws'), sourceMapResources.aws, 'aws'),
      moduleWithLessons('gcp-track', 'Google Cloud Engineering', 'Master Google Cloud foundations, governance, IAM, compute, data, networking, containers, events, security, resilience, AI platforms, operations, cost, deployment, and enterprise architecture.', providerLessons('gcp'), sourceMapResources.gcp, 'gcp'),
    ],
  },
  {
    id: 'ai-architecture', eyebrow: 'Stage 05', title: 'AI Architecture', tone: 'gold', assessment: stageAssessments['ai-architecture'], learnerOutcome: { understand: 'How to analyze system behavior with quality attributes, distributed-systems models, threat analysis, and economic tradeoffs.', build: 'An architecture proposal that states assumptions, quantifies constraints, analyzes failure modes, and compares alternatives.', show: 'A reviewable architecture decision record, evidence-backed design review, and defensible revision triggers.' },
    description: 'Approach AI architecture like an upper-level systems course: turn requirements into models, test tradeoffs against evidence, and defend decisions across software, data, infrastructure, risk, and cost.',
    modules: [
      moduleWithLessons('system-design', 'System design', 'Decompose a problem into responsibilities, interfaces, data flows, and explicit constraints.', lessonIds('system-design'), sourceMapResources.architecture),
      moduleWithLessons('scalability', 'Scalability', 'Design for changing traffic, workload shape, throughput, and capacity.', lessonIds('scalability'), sourceMapResources.architecture),
      moduleWithLessons('reliability', 'Reliability', 'Make availability, recovery, graceful degradation, and incident response part of the design.', lessonIds('reliability'), sourceMapResources.architecture),
      moduleWithLessons('distributed-systems', 'Distributed systems', 'Reason about coordination, consistency, queues, retries, and partial failure.', lessonIds('distributed-systems'), sourceMapResources.architecture),
      moduleWithLessons('security-governance', 'Security and governance', 'Make trust boundaries, privacy, ownership, risk, and change management visible.', lessonsInOrder('security-basics', 'authentication-passwords-and-mfa', 'encryption-essentials', 'secure-web-coding', 'phishing-and-social-engineering', 'general-threat-modeling', 'security-monitoring-and-response', 'security-checkpoint', 'securing-cloud-accounts', 'securing-apis-and-tokens', 'ai-threat-modeling', 'ai-security', 'ai-rag-security', 'ai-agent-security', 'ai-identity-and-secrets', 'ai-privacy', 'ai-supply-chain', 'ai-poisoning-and-abuse', 'ai-availability-and-cost', 'ai-secure-deployment', 'ai-governance'), sourceMapResources.security),
      moduleWithLessons('architecture-patterns', 'Architecture patterns', 'Choose patterns deliberately for retrieval, eventing, workflows, providers, and human review.', lessonIds('architecture-patterns'), sourceMapResources.architecture),
      moduleWithLessons('enterprise-integration', 'Enterprise integration', 'Connect identity, existing systems, data ownership, and change processes without losing control.', lessonIds('enterprise-integration'), sourceMapResources.architecture),
      moduleWithLessons('cost-optimization', 'Cost optimization', 'Compare quality, latency, infrastructure, model, and operational costs as one system.', lessonIds('cost-optimization'), sourceMapResources.architecture),
      moduleWithLessons('architecture-decision-records', 'Architecture decision records', 'Record why a choice was made, what it costs, and when it should be revisited.', lessonIds('architecture-decision-records'), sourceMapResources.architecture),
    ],
  },
  {
    id: 'research', eyebrow: 'Stage 06', title: 'Research', tone: 'teal',
    learnerOutcome: { understand: 'How to ask a testable question, collect clean data, run a fair comparison and state what the evidence shows.', build: 'A written study plan, a cleaned dataset and a short report that anyone can reproduce.', show: 'Clear evidence of a fair comparison, honest uncertainty and limits, and a report that someone else can reproduce.' },
    description: 'Practice collecting evidence, designing fair comparisons, judging uncertainty and reporting findings honestly.',
    modules: [
      moduleWithLessons('research-methods', 'Research methods', 'Ask a testable question, collect clean data, run a fair comparison and report what the evidence shows.', lessonsInOrder('research-questions', 'measuring-what-you-care-about', 'research-ethics-and-consent', 'data-collection-and-cleaning', 'experiment-design', 'statistical-inference-and-experiments', 'reading-research-papers', 'reporting-results', 'research-checkpoint')),
    ],
  },
  {
    id: 'professional-practice', eyebrow: 'Stage 07', title: 'Technical Leadership & Communication', tone: 'gold', assessment: stageAssessments['professional-practice'], learnerOutcome: { understand: 'How senior practitioners listen, frame problems, communicate decisions, plan under uncertainty, and build alignment.', build: 'A customer discovery brief, decision memo, risk-first delivery plan, and feedback reflection.', show: 'Clear evidence of customer conversations, audience-aware communication, revised plans, and collaborative judgment.' },
    description: 'Develop the human and organizational skills that make technical work useful: understand customers, create shared clarity, navigate uncertainty, and influence without relying on authority.',
    modules: [
      moduleWithLessons('communication', 'Communication for technical leaders', 'Make complex decisions clear to customers, peers, executives, and partners.', lessonsInOrder('technical-communication', 'executive-writing-and-presentations', 'communicating-during-an-incident'), sourceMapResources.professional),
      moduleWithLessons('customer-discovery', 'Customer discovery and problem framing', 'Understand real work, competing needs, and evidence before proposing a solution.', lessonsInOrder('customer-discovery-and-conversations', 'stakeholder-mapping-and-requirements'), sourceMapResources.professional),
      moduleWithLessons('value-and-business-cases', 'Value and business cases', 'Connect technical work to measurable customer outcomes, economics, risk, and investment decisions.', lessonIds('value-propositions-and-business-cases'), sourceMapResources.professional),
      moduleWithLessons('consultative-selling', 'Consultative selling', 'Understand fit, qualify needs, handle objections, and help customers decide without manipulation.', lessonIds('consultative-selling-and-discovery'), sourceMapResources.professional),
      moduleWithLessons('scope-and-requirements', 'Scope, requirements, and proposals', 'Turn discovery into a bounded commitment with explicit outcomes, assumptions, exclusions, and acceptance criteria.', lessonIds('scope-of-work-and-proposals'), sourceMapResources.professional),
      moduleWithLessons('commercial-practice', 'Commercial negotiation and procurement', 'Navigate budget, terms, risk, procurement, and ethical commitments around technical work.', lessonIds('commercial-negotiation-and-procurement'), sourceMapResources.professional),
      moduleWithLessons('solution-storytelling', 'Solution demos and storytelling', 'Show how a solution changes the customer’s work and make the next step easy to understand.', lessonIds('solution-demos-and-storytelling'), sourceMapResources.professional),
      moduleWithLessons('planning-and-execution', 'Planning, decisions, and execution', 'Turn uncertainty into milestones, learning checkpoints, priorities, tradeoffs, and clear decision rights.', lessonsInOrder('planning-under-uncertainty', 'prioritization-and-tradeoffs', 'managing-technical-debt', 'decision-making-and-organizational-systems'), sourceMapResources.professional),
      moduleWithLessons('collaboration-and-influence', 'Feedback, conflict, and influence', 'Build trust, handle disagreement, negotiate constraints, and create alignment.', lessonsInOrder('leading-without-a-title', 'feedback-conflict-and-influence', 'negotiation-and-conflict-resolution'), sourceMapResources.professional),
      moduleWithLessons('leadership-systems', 'Developing people and organizations', 'Practice mentoring, delegation, coaching, and organizational judgment.', lessonsInOrder('mentoring-delegation-and-coaching', 'running-effective-meetings-and-one-to-ones'), sourceMapResources.professional),
      moduleWithLessons('leadership-practicum', 'Professional leadership practicum', 'Lead an ambiguous initiative and leave behind evidence of your reasoning, communication, and reflection.', lessonIds('professional-leadership-practicum'), sourceMapResources.professional),
    ],
  },
  {
    id: 'projects', eyebrow: 'Stage 08', title: 'Projects', tone: 'teal', learnerOutcome: { understand: 'How to turn learning into complete, inspectable work.', build: 'A portfolio project with documentation, tests, deployment, and evaluation.', show: 'A public project, evidence of decisions, and a clear explanation of what you would improve next.' },
    description: 'Prove what you can build and explain. Each project should leave behind code, evidence, and architectural decisions.',
    modules: [
      moduleWithLessons('starter-project', 'Starter project', 'Automate a real chore with Python: the first portfolio piece after Python.', lessonIds('automate-a-real-task')),
      moduleWithLessons('developer-project', 'AI Developer project', 'Ship a chatbot people can use: a web page, streaming, limits, safe logs and a container.', lessonIds('build-a-chatbot')),
      moduleWithLessons('engineer-project', 'AI Engineer project', 'Build a knowledge assistant or tool-using system with evaluation, guardrails, and observability.', lessonIds('capstone-rag', 'capstone-agent')),
      moduleWithLessons('architecture-project', 'Evaluate an AI system', 'Measure an AI assistant against a test set, compare two versions and report what changed.', lessonIds('capstone-evaluation')),
      moduleWithLessons('math-project', 'AI Mathematics research project', 'Turn a mathematical question into a reproducible model, experiment, and evidence-backed explanation.', lessonIds('math-research-capstone'), sourceMapResources.math),
      moduleWithLessons('data-project', 'Data project', 'Analyze a public dataset honestly: one question, clean data, a clear chart and a report with its limits.', lessonIds('analyze-a-public-dataset')),
      moduleWithLessons('client-project', 'Client project', 'Build something for a real client, from discovery and a signed scope to delivery and an approved case study.', lessonIds('build-for-a-real-client')),
    ],
  },
  {
    id: 'game-development', eyebrow: 'Build track', title: 'Game Development', tone: 'gold',
    learnerOutcome: { understand: 'How a game engine runs its loop, and how scenes, nodes, signals and physics work together.', build: 'A playable 2D game with movement, pickups, a score, a game over screen and saved best scores.', show: 'An exported game with a README that explains the controls, the parts and what you would improve next.' },
    description: 'Make small 2D games with Godot and GDScript, one system at a time, from the first moving character to a shipped build.',
    modules: [
      moduleWithLessons('game-development', 'Godot and GDScript', 'Build a playable 2D game in Godot, from the game loop to an exported build.', lessonsInOrder('game-design-basics', 'godot-what-is-a-game-engine', 'godot-first-project', 'godot-scenes-and-nodes', 'gdscript-basics', 'godot-player-movement', 'animation-sound-and-feel', 'godot-collisions-and-pickups', 'godot-signals', 'godot-ui-and-game-over', 'godot-spawning-and-timers', 'godot-saving-high-scores', 'playtesting-and-feedback', 'exporting-and-sharing-a-game', 'godot-coin-dash-capstone')),
    ],
  },
  {
    id: 'vibe-coding', eyebrow: 'Build track', title: 'Vibe Coding', tone: 'teal',
    learnerOutcome: { understand: 'How to describe software clearly, check generated code, and keep control of the result.', build: 'A small Python tool built in steps, with tests, checkpoints and a clear design.', show: 'A tested tool with a README that explains how it was built and what was checked.' },
    description: 'Build with an AI assistant without giving up control: write clear goals, work in small steps, read and test what is generated, and keep honest records.',
    modules: [
      moduleWithLessons('vibe-coding', 'Building with an AI assistant', 'Describe, build, read, test and ship small tools with an AI assistant, keeping every step checked.', lessonsInOrder('vibe-coding-what-it-is', 'vscode-setup-walkthrough', 'install-an-ai-assistant', 'project-rules-for-your-assistant', 'describing-a-goal-to-an-ai', 'working-in-small-steps', 'managing-long-sessions', 'reading-ai-generated-code', 'testing-ai-generated-code', 'debugging-with-an-ai-assistant', 'checkpoints-with-git', 'refactoring-ai-code-safely', 'permissions-and-approvals', 'prompt-injection-and-untrusted-text', 'safety-when-sharing-code', 'reviewing-ai-code-as-a-team', 'checking-packages-before-install', 'when-to-stop-prompting-and-design', 'documenting-what-the-ai-built', 'vibe-coding-capstone')),
    ],
  },
  {
    id: 'networking-foundations', eyebrow: 'Start here', title: 'Networking Foundations', tone: 'teal',
    learnerOutcome: { understand: 'How devices, addresses, names, ports and routes work together to move data across a network.', build: 'A small Python check that reads IP addresses, flags devices on the wrong network and finds the first failing connection step.', show: 'A short written troubleshooting record for a connection problem, with the tests you ran and what each one ruled out.' },
    description: 'Learn how devices connect, how IP addresses and subnets work, how names become addresses, how ports pick a service, and how to find a broken connection step by step.',
    modules: [
      moduleWithLessons('networking-foundations', 'Networking basics', 'Connect devices, read addresses and subnets, follow names and ports, and troubleshoot a connection in order.', lessonsInOrder('networking-how-devices-connect', 'networking-ip-addresses-and-subnets', 'networking-dhcp-and-nat', 'networking-dns-names-to-addresses', 'networking-https-and-certificates', 'networking-ports-and-protocols', 'networking-firewalls-and-vpns', 'networking-home-and-wifi-security', 'networking-troubleshooting-a-connection', 'networking-checkpoint')),
    ],
  },
  {
    id: 'iot-foundations', eyebrow: 'Start here', title: 'IoT Foundations', tone: 'gold',
    learnerOutcome: { understand: 'How connected devices read the world, choose a connection, send messages, and stay secure.', build: 'A small Python program that cleans sensor readings, picks a connection and checks a device message.', show: 'A written design for one connected device, with its sensors, connection, message format and security checks.' },
    description: 'Learn how Internet of Things devices sense, decide and communicate, with sensor readings, connection choices, MQTT messages and basic device security.',
    modules: [
      moduleWithLessons('iot-foundations', 'IoT basics', 'Follow a reading through a connected device, choose a connection, send trusted messages and keep devices secure.', lessonsInOrder('iot-what-is-it', 'iot-microcontrollers-and-safety', 'iot-sensors-and-readings', 'iot-connectivity-choices', 'iot-power-and-battery-life', 'iot-device-messages', 'iot-over-the-air-updates', 'iot-edge-and-privacy', 'iot-security-basics', 'iot-checkpoint')),
    ],
  },
]

export const curriculumModules = curriculumStages.flatMap((stage) => stage.modules)

export const portfolioTracks: PortfolioTrack[] = [
  {
    id: 'ai-system-evaluation', title: 'Evaluate and operate an AI system', tone: 'teal',
    description: 'Build a provider-neutral evaluation harness that makes quality, safety, latency, cost, and failure modes visible before an AI feature reaches users.',
    deliverables: ['A representative evaluation case set', 'A versioned rubric and deterministic checks', 'Baseline and candidate comparison results', 'Failure taxonomy and red-team cases', 'Threat model with mitigations and residual risks', 'README with reproduction, limitations, and operating plan'],
    evidence: ['The same case set runs against multiple versions', 'Results include quality, safety, latency, and cost signals', 'High-severity failures have owners and mitigations', 'Provider, model, prompt, retrieval, and evaluator versions are recorded', 'The harness can run locally without exposing secrets or private data', 'The portfolio explains what the evaluation cannot prove'],
    resources: [resource('Full Stack Deep Learning', 'FSDL', 'Study evaluation, observability, deployment, and the full lifecycle of AI applications.', 'https://fullstackdeeplearning.com/llm-bootcamp/'), resource('MLflow evaluation', 'MLflow', 'Explore evaluation datasets, scorers, traces, and monitoring for generative AI applications.', 'https://mlflow.org/docs/latest/genai/eval-monitor/'), resource('OWASP GenAI Top 10', 'OWASP', 'Review current risks such as prompt injection, sensitive information disclosure, excessive agency, and unbounded consumption.', 'https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/')],
  },
]

export { portfolioProjects }

export function getModuleProgress(module: CurriculumModule, completedLessonIds: string[]) {
  const completed = module.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length
  return { completed, total: module.lessons.length, complete: module.lessons.length > 0 && completed === module.lessons.length }
}

export function getOrderedModuleLessons(moduleId: string) {
  const module = curriculumModules.find((item) => item.id === moduleId)
  return module ? [...module.lessons].sort((a, b) => a.order - b.order) : []
}

export function getCurriculumLessonSequence() {
  return curriculumStages.flatMap((stage) => stage.modules.flatMap((module) => getOrderedModuleLessons(module.id)))
}
