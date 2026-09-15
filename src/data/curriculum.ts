import type { CareerLevel, CurriculumModule, CurriculumStage, Lesson, LearningResource, PortfolioTrack } from '../types/curriculum'
import { orientationLessons } from './orientationLessons'
import { portfolioProjects } from './portfolioProjects'

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
  security: [
    { title: 'OWASP Top 10 for LLM Applications', provider: 'OWASP', description: 'Study common security risks in large language model applications.', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
    { title: 'AI Security Guidance', provider: 'Microsoft Learn', description: 'Explore practical security considerations for AI systems and applications.', url: 'https://learn.microsoft.com/en-us/security/ai-security/' },
    { title: 'MITRE ATLAS', provider: 'MITRE', description: 'Explore adversary tactics and techniques for machine learning systems.', url: 'https://atlas.mitre.org/' },
  ],
}

export const lessons: Lesson[] = [
  { id: 'what-is-ai', title: 'What is Artificial Intelligence?', description: 'Define AI and place modern tools in the larger history of intelligent systems.', duration: 5, difficulty: 'Beginner', category: 'AI Foundations', order: 1 },
  { id: 'how-ai-learns', title: 'How Does AI Learn?', description: 'Understand learning from examples, patterns, feedback, and generalization.', duration: 7, difficulty: 'Beginner', category: 'AI Foundations', order: 2 },
  { id: 'machine-learning', title: 'What is Machine Learning?', description: 'Distinguish AI, machine learning, deep learning, and hand-written rules.', duration: 8, difficulty: 'Beginner', category: 'AI Foundations', order: 3 },
  { id: 'data-and-evaluation', title: 'Data, Training, and Evaluation', description: 'Learn why data quality, held-out tests, and task-specific metrics matter.', duration: 10, difficulty: 'Beginner', category: 'AI Foundations', order: 4 },
  { id: 'ai-problem-solving', title: 'How AI Problems Are Framed', description: 'Turn a real-world goal into inputs, outputs, constraints, and an evaluation plan.', duration: 9, difficulty: 'Beginner', category: 'AI Foundations', order: 5 },
  { id: 'probability-and-statistics', title: 'Probability and Statistics for AI', description: 'Build an intuitive foundation for uncertainty, distributions, and evidence.', duration: 12, difficulty: 'Intermediate', category: 'Math and Computing', order: 1 },
  { id: 'algebra-and-functions', title: 'Algebra and Functions for AI', description: 'Build the language of variables, functions, graphs, and transformations.', duration: 12, difficulty: 'Beginner', category: 'Math and Computing', order: 2 },
  { id: 'vectors-and-representations', title: 'Vectors and Representations', description: 'Understand how AI turns information into numbers it can compare and transform.', duration: 11, difficulty: 'Intermediate', category: 'Math and Computing', order: 3 },
  { id: 'matrices-and-linear-algebra', title: 'Matrices and Linear Algebra', description: 'See how matrix operations power transformations inside models.', duration: 13, difficulty: 'Intermediate', category: 'Math and Computing', order: 4 },
  { id: 'calculus-and-gradients', title: 'Calculus and Gradients', description: 'Understand slopes, change, and why gradients guide learning.', duration: 13, difficulty: 'Intermediate', category: 'Math and Computing', order: 5 },
  { id: 'programming-and-data-workflows', title: 'Programming and Data Workflows', description: 'See how code, data, experiments, and models fit together in practice.', duration: 10, difficulty: 'Intermediate', category: 'Math and Computing', order: 6 },
  { id: 'algorithms-and-data-structures', title: 'Algorithms and Data Structures', description: 'Learn how software organizes information and solves problems efficiently.', duration: 12, difficulty: 'Intermediate', category: 'Math and Computing', order: 7 },
  { id: 'data-collection-and-cleaning', title: 'Data Collection and Cleaning', description: 'Understand where training data comes from and how messy data changes results.', duration: 10, difficulty: 'Intermediate', category: 'Math and Computing', order: 8 },
  { id: 'experiment-design', title: 'Experiment Design', description: 'Learn how to compare AI approaches without fooling yourself with weak evidence.', duration: 11, difficulty: 'Intermediate', category: 'Math and Computing', order: 9 },
  { id: 'optimization-and-training', title: 'Optimization and Training', description: 'Learn how loss functions and gradient-based updates improve a model.', duration: 12, difficulty: 'Intermediate', category: 'Math and Computing', order: 10 },
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
  { id: 'neural-networks', title: 'A Gentle Introduction to Neural Networks', description: 'Understand layers, parameters, and learned representations.', duration: 9, difficulty: 'Beginner', category: 'Modern AI Systems', order: 1 },
  { id: 'generative-ai', title: 'What is Generative AI?', description: 'Learn how AI generates text, images, audio, video, and code.', duration: 7, difficulty: 'Beginner', category: 'Modern AI Systems', order: 2 },
  { id: 'transformers-and-attention', title: 'Transformers and Attention', description: 'Understand the architecture behind many current language and multimodal models.', duration: 11, difficulty: 'Intermediate', category: 'Modern AI Systems', order: 3 },
  { id: 'large-language-models', title: 'What is a Large Language Model?', description: 'Understand language modeling, next-token prediction, and model limits.', duration: 8, difficulty: 'Beginner', category: 'Modern AI Systems', order: 4 },
  { id: 'multimodal-ai', title: 'Multimodal AI', description: 'Explore systems that work across text, images, audio, video, and other inputs.', duration: 9, difficulty: 'Beginner', category: 'Modern AI Systems', order: 5 },
  { id: 'tokens', title: 'What are Tokens?', description: 'See how language becomes the smaller pieces an AI model processes.', duration: 6, difficulty: 'Beginner', category: 'Modern AI Systems', order: 6 },
  { id: 'context-windows', title: 'What is a Context Window?', description: 'Learn how an AI system manages the information in one request.', duration: 7, difficulty: 'Beginner', category: 'Modern AI Systems', order: 7 },
  { id: 'inference-and-deployment', title: 'Inference and Deployment', description: 'Learn what happens when a trained model is used in a real application.', duration: 9, difficulty: 'Intermediate', category: 'Modern AI Systems', order: 8 },
  { id: 'fine-tuning', title: 'Fine-Tuning and Adaptation', description: 'Understand how developers adapt a general model for a narrower job.', duration: 9, difficulty: 'Intermediate', category: 'Modern AI Systems', order: 9 },
  { id: 'talk-to-ai', title: 'How to Talk to AI', description: 'Learn how to state a goal, provide context, and improve a response.', duration: 6, difficulty: 'Beginner', category: 'Using AI', order: 1 },
  { id: 'prompt-engineering', title: 'Prompt Engineering', description: 'Design clear, testable instructions for different tasks and audiences.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 2 },
  { id: 'system-prompts', title: 'System Prompts', description: 'Understand how applications set an assistant’s general behavior.', duration: 7, difficulty: 'Beginner', category: 'Using AI', order: 3 },
  { id: 'structured-outputs', title: 'Structured Outputs', description: 'Learn how applications ask models for predictable, machine-readable results.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 4 },
  { id: 'ai-assistants', title: 'AI Assistants', description: 'See how models, context, and tools come together in an assistant.', duration: 7, difficulty: 'Beginner', category: 'Using AI', order: 5 },
  { id: 'hallucinations', title: 'AI Hallucinations', description: 'Learn why AI can sound confident while giving an incorrect answer.', duration: 7, difficulty: 'Beginner', category: 'Using AI', order: 6 },
  { id: 'evaluating-ai-responses', title: 'Evaluating AI Responses', description: 'Use a practical checklist to judge whether an AI response is useful.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 7 },
  { id: 'responsible-ai', title: 'Using AI Responsibly', description: 'Think carefully about accuracy, privacy, fairness, and human judgment.', duration: 8, difficulty: 'Beginner', category: 'Using AI', order: 8 },
  { id: 'ai-apis', title: 'What is an AI API?', description: 'See how software can send a request to an AI model.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 1 },
  { id: 'models', title: 'AI Models and Model Selection', description: 'Compare models by capability, speed, context, cost, and task fit.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 2 },
  { id: 'embeddings', title: 'Embeddings', description: 'Explore how AI systems compare the meaning of different pieces of text.', duration: 9, difficulty: 'Intermediate', category: 'AI Engineering', order: 3 },
  { id: 'vector-databases', title: 'Vector Databases', description: 'Understand where embeddings are stored for fast similarity search.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 4 },
  { id: 'rag', title: 'Retrieval-Augmented Generation', description: 'Follow the path from a question to relevant information and an answer.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 5 },
  { id: 'tool-calling', title: 'Tool Calling', description: 'See how a model can request actions while the application stays in control.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 6 },
  { id: 'ai-agents', title: 'AI Agents', description: 'Explore how models can plan, use tools, and work toward a goal.', duration: 9, difficulty: 'Intermediate', category: 'AI Engineering', order: 7 },
  { id: 'mcp', title: 'Model Context Protocol (MCP)', description: 'Learn the shared connection pattern for AI applications and tools.', duration: 8, difficulty: 'Intermediate', category: 'AI Engineering', order: 8 },
  { id: 'ai-observability', title: 'AI Observability and Operations', description: 'Learn how teams monitor quality, cost, latency, and failures in production.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 9 },
  { id: 'ai-product-design', title: 'Designing AI Products', description: 'Turn model capabilities into a useful, understandable, human-centered experience.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 10 },
  { id: 'ai-cost-and-performance', title: 'Cost, Latency, and Performance', description: 'Learn the practical tradeoffs that shape a production AI system.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 11 },
  { id: 'ai-governance', title: 'AI Governance and Documentation', description: 'Understand how teams document models, risks, data, and decisions.', duration: 10, difficulty: 'Intermediate', category: 'AI Engineering', order: 11 },
  { id: 'chatbot-concepts', title: 'How Chatbots Work', description: 'Understand the conversation loop, messages, context, and response generation.', duration: 8, difficulty: 'Beginner', category: 'Build Chatbots', order: 1 },
  { id: 'chatbot-openai', title: 'Build a Chatbot with OpenAI', description: 'Create a Python chatbot using a hosted OpenAI model and an API key.', duration: 15, difficulty: 'Intermediate', category: 'Build Chatbots', order: 2 },
  { id: 'chatbot-gemini', title: 'Build a Chatbot with Gemini', description: 'Build the same chatbot pattern with Google Gemini and compare provider APIs.', duration: 15, difficulty: 'Intermediate', category: 'Build Chatbots', order: 3 },
  { id: 'chatbot-local', title: 'Build a Local Chatbot', description: 'Run a model locally with Ollama so your first chatbot does not require a paid API.', duration: 18, difficulty: 'Intermediate', category: 'Build Chatbots', order: 4 },
  { id: 'chatbot-production', title: 'Turn a Chatbot into a Product', description: 'Add memory, streaming, safety, evaluation, and deployment decisions.', duration: 18, difficulty: 'Intermediate', category: 'Build Chatbots', order: 5 },
  { id: 'ai-security', title: 'AI Security and Prompt Injection', description: 'Understand how untrusted instructions and data can manipulate AI applications.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 1 },
  { id: 'ai-threat-modeling', title: 'Threat Modeling AI Systems', description: 'Map assets, trust boundaries, attackers, and failure paths before building defenses.', duration: 11, difficulty: 'Intermediate', category: 'AI Security', order: 2 },
  { id: 'ai-identity-and-secrets', title: 'Identity, Access, and Secrets', description: 'Protect API keys, user data, tools, and model permissions.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 3 },
  { id: 'ai-privacy', title: 'Privacy and Sensitive Data', description: 'Understand data minimization, retention, leakage, and privacy-preserving design.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 4 },
  { id: 'ai-supply-chain', title: 'AI Supply Chain Security', description: 'Evaluate models, datasets, packages, plugins, and dependencies before trusting them.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 5 },
  { id: 'ai-rag-security', title: 'RAG and Vector Security', description: 'Secure document ingestion, retrieval, citations, permissions, and stored embeddings.', duration: 10, difficulty: 'Intermediate', category: 'AI Security', order: 6 },
  { id: 'ai-agent-security', title: 'Agent and Tool Security', description: 'Design safe permissions, sandboxing, validation, and approval for autonomous workflows.', duration: 11, difficulty: 'Intermediate', category: 'AI Security', order: 7 },
  { id: 'ai-poisoning-and-abuse', title: 'Poisoning, Model Abuse, and Extraction', description: 'Recognize training-data poisoning, model theft, evasion, and harmful use.', duration: 11, difficulty: 'Intermediate', category: 'AI Security', order: 8 },
  { id: 'ai-availability-and-cost', title: 'Availability, Denial of Service, and Cost Abuse', description: 'Protect AI services from overload, runaway tools, and uncontrolled spending.', duration: 9, difficulty: 'Intermediate', category: 'AI Security', order: 9 },
  { id: 'ai-secure-deployment', title: 'Secure Deployment and Incident Response', description: 'Operate AI systems with isolation, monitoring, response plans, and recovery.', duration: 12, difficulty: 'Intermediate', category: 'AI Security', order: 10 },
  { id: 'capstone-rag', title: 'Project: Build a Knowledge Assistant', description: 'Build a complete retrieval-augmented AI application from data to evaluation.', duration: 15, difficulty: 'Intermediate', category: 'Projects and Practice', order: 1 },
  { id: 'capstone-agent', title: 'Project: Design a Tool-Using Agent', description: 'Build an agent with goals, tools, permissions, limits, and tests.', duration: 15, difficulty: 'Intermediate', category: 'Projects and Practice', order: 2 },
  { id: 'capstone-evaluation', title: 'Project: Evaluate an AI System', description: 'Create an evaluation plan that measures quality, safety, cost, and reliability.', duration: 15, difficulty: 'Intermediate', category: 'Projects and Practice', order: 3 },
  ...orientationLessons,
]

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
  iac: [resource('Terraform tutorials', 'HashiCorp', 'Learn infrastructure as code by provisioning and changing infrastructure declaratively.', 'https://developer.hashicorp.com/terraform/tutorials')],
}

const modulePrerequisites: Record<string, string[]> = {
  'ai-fundamentals': ['No prior AI knowledge.'],
  'computing-math': ['AI fundamentals or equivalent curiosity about how software learns.'],
  python: ['Basic computer use: files, folders, and opening a terminal.', 'No prior Python or advanced mathematics is required.', 'A computer with Python 3.12+ and a text editor or VS Code.', 'Willingness to type, run, and modify small programs before moving to AI-specific code.'],
  'git-github': ['A small Python project or willingness to create one.', 'A GitHub account for publishing work.'],
  'linux-cli': ['Basic computer use and a willingness to use a terminal.'],
  'apis-rest': ['Python basics and functions.', 'Basic request/response vocabulary.'],
  'http-networking': ['APIs and REST basics.', 'Basic client/server vocabulary.'],
  'databases-sql': ['Python or another programming language.', 'Basic data structures and application state.'],
  'data-structures': ['Python basics and simple algorithms.'],
  'testing-debugging': ['Python files, functions, and exceptions.', 'A small program that can fail and be tested.'],
  docker: ['A working application and basic Linux/CLI commands.'],
  llms: ['AI fundamentals, vectors, and basic neural-network vocabulary.'],
  prompting: ['LLM basics, tokens, and context windows.'],
  'structured-outputs': ['Prompting basics and JSON objects.'],
  embeddings: ['Vectors, distance, and basic Python collections.'],
  'vector-databases': ['Embeddings and similarity search.'],
  rag: ['Embeddings, vector databases, APIs, and basic document handling.'],
  'tool-calling': ['APIs, structured outputs, and authorization basics.'],
  agents: ['Tool/function calling, structured outputs, and testing.'],
  evaluation: ['Data splits, metrics, baselines, and basic Python.'],
  guardrails: ['LLMs, prompting, structured outputs, and threat modeling basics.'],
  observability: ['APIs, distributed requests, evaluation, and basic logging.'],
  'cloud-fundamentals': ['Software engineering basics and networking vocabulary.', 'A billing-aware cloud learning account.'],
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
  'developer-project': ['Foundation and Software Engineering stages, or equivalent experience.'],
  'engineer-project': ['AI Developer-level software foundations plus LLM, RAG, tools, and evaluation basics.'],
  'architecture-project': ['AI Engineer-level systems knowledge plus cloud and architecture fundamentals.'],
}

function getModulePrerequisites(id: string) {
  const prerequisites = modulePrerequisites[id]
  if (!prerequisites) throw new Error(`Missing prerequisites for curriculum module: ${id}`)
  return prerequisites
}

const moduleWithLessons = (id: string, title: string, description: string, moduleLessons: Lesson[], resources?: LearningResource[], provider: CurriculumModule['provider'] = 'shared'): CurriculumModule => ({ id, title, description, lessons: moduleLessons, prerequisites: getModulePrerequisites(id), resources, provider })

const resourceModule = (id: string, title: string, description: string, resources: LearningResource[], provider: CurriculumModule['provider'] = 'shared'): CurriculumModule => ({ id, title, description, lessons: [], prerequisites: getModulePrerequisites(id), resources, provider, status: 'coming-soon' })

const lessonIds = (...ids: string[]) => lessons.filter((lesson) => ids.includes(lesson.id))

export const curriculumStages: CurriculumStage[] = [
  {
    id: 'foundation', eyebrow: 'Stage 01', title: 'Foundation', tone: 'teal', learnerOutcome: { understand: 'How AI, computing, math, and Python fit together.', build: 'A first working Python program and small concept experiments.', show: 'A learning plan, working examples, and your first project notes.' },
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
    id: 'software-engineering', eyebrow: 'Stage 02', title: 'Software Engineering', tone: 'gold', learnerOutcome: { understand: 'How reliable applications use boundaries, data, tests, and deployment practices.', build: 'A tested service with a clear API, persistence, and delivery workflow.', show: 'A repository with tests, setup instructions, design decisions, and repeatable delivery.' },
    description: 'Learn the durable software practices around AI systems: boundaries, persistence, correctness, and repeatable delivery.',
    modules: [
      moduleWithLessons('apis-rest', 'APIs and REST', 'Design and consume stable service boundaries with clear inputs, outputs, and errors.', lessonIds('ai-apis'), sourceMapResources.web),
      moduleWithLessons('http-networking', 'HTTP and networking', 'Understand how requests travel, how services communicate, and where latency and failure enter the system.', lessonIds('http-networking'), sourceMapResources.web),
      moduleWithLessons('databases-sql', 'Databases and SQL', 'Model relational data and query it deliberately before reaching for a specialized data store.', lessonIds('databases-sql'), sourceMapResources.sql),
      moduleWithLessons('data-structures', 'Data structures', 'Choose structures and algorithms that make application behavior correct and efficient.', lessonIds('python-data-structures', 'algorithms-and-data-structures'), sourceMapResources.math),
      moduleWithLessons('testing-debugging', 'Testing and debugging', 'Turn failures into evidence and build confidence through repeatable checks.', lessonIds('python-files-and-errors', 'experiment-design', 'testing-debugging'), sourceMapResources.testing),
      moduleWithLessons('docker', 'Docker', 'Package an application so it behaves consistently across a laptop, CI, and deployment.', lessonIds('docker'), sourceMapResources.docker),
    ],
  },
  {
    id: 'ai-engineering', eyebrow: 'Stage 03', title: 'AI Engineering', tone: 'teal', learnerOutcome: { understand: 'How models, prompts, retrieval, tools, evaluation, and operations work together.', build: 'A useful AI application with evidence, guardrails, and observable behavior.', show: 'An AI project with evaluation cases, traces, tradeoffs, and documented limits.' },
    description: 'Compose models, prompts, data, tools, evaluation, and operations into useful AI applications.',
    modules: [
      moduleWithLessons('llms', 'LLMs', 'Understand language models, tokens, context, transformers, multimodality, and adaptation.', lessons.filter((lesson) => lesson.category === 'Modern AI Systems').concat(lessonIds('models'))),
      moduleWithLessons('prompting', 'Prompting', 'Write clear instructions, layer behavior, and make model interactions testable.', lessonIds('talk-to-ai', 'prompt-engineering', 'system-prompts')),
      moduleWithLessons('structured-outputs', 'Structured outputs', 'Ask for machine-readable results and validate them before application code uses them.', lessonIds('structured-outputs')),
      moduleWithLessons('embeddings', 'Embeddings', 'Represent meaning numerically so applications can compare and retrieve information.', lessonIds('embeddings')),
      moduleWithLessons('vector-databases', 'Vector databases', 'Store and search embeddings while preserving metadata and access boundaries.', lessonIds('vector-databases')),
      moduleWithLessons('rag', 'Retrieval-augmented generation', 'Connect user questions to relevant evidence before generating an answer.', lessonIds('rag')),
      moduleWithLessons('tool-calling', 'Tool and function calling', 'Let a model request actions while the application validates permissions and arguments.', lessonIds('tool-calling', 'mcp')),
      moduleWithLessons('agents', 'Agents', 'Design bounded workflows where models plan, use tools, and stop safely.', lessonIds('ai-agents')),
      moduleWithLessons('evaluation', 'Evaluation', 'Compare systems against representative examples and inspect failures instead of trusting demos.', lessonIds('data-and-evaluation', 'evaluating-ai-responses')),
      moduleWithLessons('guardrails', 'Guardrails', 'Design for uncertainty, misuse, privacy, human review, and safe recovery.', lessonIds('ai-assistants', 'hallucinations', 'responsible-ai')),
      moduleWithLessons('observability', 'Observability', 'Monitor quality, cost, latency, failures, and the behavior of a changing system.', lessonIds('ai-observability', 'ai-product-design', 'ai-cost-and-performance')),
    ],
  },
  {
    id: 'cloud-engineering', eyebrow: 'Stage 04', title: 'Cloud Engineering', tone: 'neutral', learnerOutcome: { understand: 'How cloud platforms provide identity, storage, compute, networking, and operations.', build: 'A deployed service with secure identity, monitoring, cost awareness, and rollback thinking.', show: 'A deployed workload, architecture diagram, provider choice, and certification preparation evidence.' },
    description: 'Learn the shared cloud vocabulary, then choose a provider track for hands-on deployment and operations.',
    certifications: [
      { title: 'Azure Fundamentals', provider: 'Azure', level: 'Foundational', pathStep: 1, examCode: 'AZ-900', description: 'Validate cloud concepts, Azure services, security, governance, and pricing after completing the shared fundamentals and Azure track.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/' },
      { title: 'Azure Administrator Associate', provider: 'Azure', level: 'Associate', pathStep: 2, examCode: 'AZ-104', description: 'Build hands-on identity, storage, compute, networking, monitoring, and resource administration skills.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/' },
      { title: 'Azure Solutions Architect Expert', provider: 'Azure', level: 'Professional', pathStep: 3, examCode: 'AZ-305', description: 'Highest architecture step in this route: design secure, resilient, governed, and cost-aware Azure solutions.', statusNote: 'Requires the Azure Administrator Associate certification.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/' },
      { title: 'AWS Certified Cloud Practitioner', provider: 'AWS', level: 'Foundational', pathStep: 1, examCode: 'CLF-C02', description: 'Validate shared cloud, security, billing, and core AWS concepts after completing the fundamentals track.', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
      { title: 'AWS Solutions Architect – Associate', provider: 'AWS', level: 'Associate', pathStep: 2, examCode: 'SAA-C03', description: 'Apply architecture, resilience, security, performance, and cost principles to AWS workloads.', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' },
      { title: 'AWS Solutions Architect – Professional', provider: 'AWS', level: 'Professional', pathStep: 3, examCode: 'SAP-C02', description: 'Highest architecture step in this route: design and optimize complex AWS solutions across organizations and workloads.', statusNote: 'SAP-C03 registration opens October 27, 2026; verify the current exam version before booking.', url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/' },
      { title: 'Cloud Digital Leader', provider: 'Google Cloud', level: 'Foundational', pathStep: 1, description: 'Validate cloud concepts, data and AI capabilities, security, and Google Cloud value for technical decisions.', url: 'https://cloud.google.com/learn/certification/cloud-digital-leader' },
      { title: 'Associate Cloud Engineer', provider: 'Google Cloud', level: 'Associate', pathStep: 2, description: 'Demonstrate hands-on skills deploying, operating, securing, and monitoring workloads on Google Cloud.', url: 'https://cloud.google.com/learn/certification/cloud-engineer' },
      { title: 'Professional Cloud Architect', provider: 'Google Cloud', level: 'Professional', pathStep: 3, description: 'Highest architecture step in this route: design, manage, secure, and optimize robust Google Cloud solutions.', statusNote: 'Google recommends 3+ years of industry experience, including 1+ year designing and managing Google Cloud solutions.', url: 'https://cloud.google.com/learn/certification/cloud-architect' },
    ],
    modules: [
      moduleWithLessons('cloud-fundamentals', 'Cloud fundamentals', 'Compare managed services, regions, availability zones, pricing, and operational responsibility.', lessonIds('cloud-fundamentals'), [...sourceMapResources.azure, ...sourceMapResources.aws, ...sourceMapResources.gcp]),
      moduleWithLessons('azure-track', 'Azure track', 'Follow Azure services and labs from identity through deployment.', lessonIds('azure-track'), sourceMapResources.azure, 'azure'),
      moduleWithLessons('aws-track', 'AWS track', 'Follow AWS services and labs from identity through deployment.', lessonIds('aws-track'), sourceMapResources.aws, 'aws'),
      moduleWithLessons('gcp-track', 'GCP track', 'Follow Google Cloud services and labs from identity through deployment.', lessonIds('gcp-track'), sourceMapResources.gcp, 'gcp'),
      moduleWithLessons('iam-security', 'IAM and security', 'Control identities, permissions, secrets, network boundaries, and operational access.', lessonIds('iam-security'), sourceMapResources.security),
      moduleWithLessons('cloud-storage-compute', 'Storage and compute', 'Choose durable storage and compute shapes that match workload, scale, and cost.', lessonIds('cloud-storage-compute'), sourceMapResources.azure),
      moduleWithLessons('cloud-networking', 'Cloud networking', 'Design private connectivity, routing, gateways, service boundaries, and traffic flow.', lessonIds('cloud-networking'), sourceMapResources.web),
      moduleWithLessons('containers-serverless', 'Containers and serverless', 'Choose between packaged services and managed execution based on control and operational needs.', lessonIds('containers-serverless'), sourceMapResources.docker),
      moduleWithLessons('ci-cd', 'CI/CD', 'Automate validation, releases, environments, rollback, and promotion between stages.', lessonIds('ci-cd'), sourceMapResources.git),
      moduleWithLessons('infrastructure-as-code', 'Infrastructure as code', 'Make infrastructure reviewable, repeatable, and recoverable as a versioned artifact.', lessonIds('infrastructure-as-code'), sourceMapResources.iac),
    ],
  },
  {
    id: 'ai-architecture', eyebrow: 'Stage 05', title: 'AI Architecture', tone: 'gold', learnerOutcome: { understand: 'How to make system decisions from requirements, constraints, risks, and tradeoffs.', build: 'An architecture proposal that explains boundaries, failure modes, cost, and security.', show: 'A reviewable architecture decision record and design presentation.' },
    description: 'Turn requirements into defensible system decisions across models, software, data, infrastructure, risk, and cost.',
    modules: [
      moduleWithLessons('system-design', 'System design', 'Decompose a problem into responsibilities, interfaces, data flows, and explicit constraints.', lessonIds('system-design'), sourceMapResources.architecture),
      moduleWithLessons('distributed-systems', 'Distributed systems', 'Reason about coordination, consistency, queues, retries, and partial failure.', lessonIds('distributed-systems'), sourceMapResources.architecture),
      moduleWithLessons('scalability', 'Scalability', 'Design for changing traffic, workload shape, throughput, and capacity.', lessonIds('scalability'), sourceMapResources.architecture),
      moduleWithLessons('reliability', 'Reliability', 'Make availability, recovery, graceful degradation, and incident response part of the design.', lessonIds('reliability'), sourceMapResources.architecture),
      moduleWithLessons('security-governance', 'Security and governance', 'Make trust boundaries, privacy, ownership, risk, and change management visible.', lessons.filter((lesson) => lesson.category === 'AI Security').concat(lessonIds('ai-governance')), sourceMapResources.security),
      moduleWithLessons('cost-optimization', 'Cost optimization', 'Compare quality, latency, infrastructure, model, and operational costs as one system.', lessonIds('cost-optimization'), sourceMapResources.architecture),
      moduleWithLessons('architecture-patterns', 'Architecture patterns', 'Choose patterns deliberately for retrieval, eventing, workflows, providers, and human review.', lessonIds('architecture-patterns'), sourceMapResources.architecture),
      moduleWithLessons('enterprise-integration', 'Enterprise integration', 'Connect identity, existing systems, data ownership, and change processes without losing control.', lessonIds('enterprise-integration'), sourceMapResources.architecture),
      moduleWithLessons('architecture-decision-records', 'Architecture decision records', 'Record why a choice was made, what it costs, and when it should be revisited.', lessonIds('architecture-decision-records'), sourceMapResources.architecture),
    ],
  },
  {
    id: 'projects', eyebrow: 'Stage 06', title: 'Projects', tone: 'teal', learnerOutcome: { understand: 'How to turn learning into complete, inspectable work.', build: 'A portfolio project with documentation, tests, deployment, and evaluation.', show: 'A public project, evidence of decisions, and a clear explanation of what you would improve next.' },
    description: 'Prove what you can build and explain. Each project should leave behind code, evidence, and architectural decisions.',
    modules: [
      moduleWithLessons('developer-project', 'AI Developer project', 'Build a small model-powered application with a clear API boundary and tested behavior.', lessonIds('chatbot-concepts', 'chatbot-openai', 'chatbot-gemini', 'chatbot-local')),
      moduleWithLessons('engineer-project', 'AI Engineer project', 'Build a knowledge assistant or tool-using system with evaluation, guardrails, and observability.', lessonIds('chatbot-production', 'capstone-rag', 'capstone-agent')),
      moduleWithLessons('architecture-project', 'AI Architect project', 'Produce an architecture review that defends system boundaries, risks, costs, and tradeoffs.', lessonIds('capstone-evaluation', 'ai-governance')),
    ],
  },
]

export const careerLevels: CareerLevel[] = [
  { id: 'start-here', title: 'Start Here', description: 'Build the foundation that makes engineering practice approachable.', unlockText: 'Begin with the Foundation stage.', requiredModuleIds: ['ai-fundamentals', 'computing-math', 'python'], requiredLessonIds: lessonIds('what-is-ai', 'how-ai-learns', 'machine-learning', 'python-basics').map((lesson) => lesson.id), portfolioArtifacts: ['A written learning plan and a first working Python program.'], tone: 'neutral' },
  { id: 'ai-developer', title: 'AI Developer', description: 'Build and explain a working AI application with dependable software boundaries.', unlockText: 'Complete Foundation, Software Engineering, and the developer project.', requiredModuleIds: ['git-github', 'linux-cli', 'apis-rest', 'http-networking', 'databases-sql', 'data-structures', 'testing-debugging', 'docker'], requiredLessonIds: lessonIds('what-is-ai', 'machine-learning', 'python-basics', 'python-data-structures', 'python-files-and-errors', 'python-apis', 'algorithms-and-data-structures', 'ai-apis', 'git-github', 'linux-cli', 'http-networking', 'databases-sql', 'testing-debugging', 'docker').map((lesson) => lesson.id), projectId: 'developer-project', requiredProjectLessonIds: lessonIds('chatbot-concepts', 'chatbot-openai', 'chatbot-gemini', 'chatbot-local').map((lesson) => lesson.id), projectCompletion: 'any', portfolioArtifacts: ['A public Git repository', 'README with setup and decisions', 'Automated tests', 'A working API-backed or local AI application'], tone: 'teal' },
  { id: 'ai-engineer', title: 'AI Engineer', description: 'Ship model-powered systems with retrieval, tools, evaluation, guardrails, and observability.', unlockText: 'Complete AI Engineering and the engineer project.', requiredModuleIds: ['llms', 'prompting', 'structured-outputs', 'embeddings', 'vector-databases', 'rag', 'tool-calling', 'agents', 'evaluation', 'guardrails', 'observability'], requiredLessonIds: lessonIds('large-language-models', 'tokens', 'context-windows', 'prompt-engineering', 'structured-outputs', 'embeddings', 'vector-databases', 'rag', 'tool-calling', 'ai-agents', 'data-and-evaluation', 'evaluating-ai-responses', 'ai-assistants', 'responsible-ai', 'ai-observability').map((lesson) => lesson.id), projectId: 'engineer-project', requiredProjectLessonIds: lessonIds('chatbot-production', 'capstone-rag', 'capstone-agent').map((lesson) => lesson.id), projectCompletion: 'any', portfolioArtifacts: ['A tested RAG or agent repository', 'Evaluation dataset and results', 'Threat model and guardrail decisions', 'Tracing or observability evidence'], tone: 'gold' },
  { id: 'ai-architect', title: 'AI Architect', description: 'Defend system decisions across cloud, reliability, security, enterprise integration, and cost.', unlockText: 'Complete architecture lessons, one cloud provider track, and the architecture project.', requiredModuleIds: ['cloud-fundamentals', 'iam-security', 'cloud-storage-compute', 'cloud-networking', 'containers-serverless', 'ci-cd', 'infrastructure-as-code', 'system-design', 'distributed-systems', 'scalability', 'reliability', 'security-governance', 'cost-optimization', 'architecture-patterns', 'enterprise-integration', 'architecture-decision-records'], requiredLessonIds: lessonIds('inference-and-deployment', 'ai-cost-and-performance', 'ai-security', 'ai-threat-modeling', 'ai-identity-and-secrets', 'ai-privacy', 'ai-secure-deployment', 'ai-governance', 'cloud-fundamentals', 'iam-security', 'cloud-storage-compute', 'cloud-networking', 'containers-serverless', 'ci-cd', 'infrastructure-as-code', 'system-design', 'distributed-systems', 'scalability', 'reliability', 'cost-optimization', 'architecture-patterns', 'enterprise-integration', 'architecture-decision-records').map((lesson) => lesson.id), providerModuleIds: ['azure-track', 'aws-track', 'gcp-track'], projectId: 'architecture-project', requiredProjectLessonIds: ['capstone-evaluation'], projectCompletion: 'all', portfolioArtifacts: ['Deployed cloud architecture', 'Architecture diagram and ADRs', 'Reliability and incident plan', 'Threat model and security controls', 'Cost estimate and optimization plan', 'Final design review presentation'], tone: 'neutral' },
]

export const curriculumModules = curriculumStages.flatMap((stage) => stage.modules)

export const portfolioTracks: PortfolioTrack[] = [
  {
    id: 'github-pages-portfolio', title: 'Publish your engineering portfolio', tone: 'teal',
    description: 'Use GitHub to publish a simple portfolio site that links to your repositories, deployed demos, architecture decisions, and evaluation evidence.',
    deliverables: ['A public GitHub repository with a clear README', 'A GitHub Pages site with project summaries and links', 'A short About page describing your target role and technical focus', 'A projects page showing screenshots, live URLs, architecture diagrams, and tradeoffs'],
    evidence: ['Each project has setup and verification instructions', 'Every live demo links to source code', 'Secrets and private data are excluded', 'The portfolio explains what changed after testing or deployment'],
    resources: [resource('GitHub Pages documentation', 'GitHub', 'Publish a static portfolio directly from a GitHub repository.', 'https://docs.github.com/en/pages/getting-started-with-github-pages'), resource('GitHub Skills', 'GitHub', 'Practice repositories, pull requests, reviews, and Actions with guided exercises.', 'https://skills.github.com/')],
  },
  {
    id: 'cloud-deployment', title: 'Deploy a real AI application', tone: 'gold',
    description: 'Use the complete Google Cloud walkthrough now, then compare the equivalent Azure Container Apps and AWS ECS Express Mode architecture paths.',
    deliverables: ['A deployed service on Azure, AWS, or GCP', 'A public or authenticated demo URL', 'A deployment README with architecture and operating costs', 'A threat model covering identity, data, tools, and provider boundaries'],
    evidence: ['Deployment works from a clean checkout', 'Secrets are stored outside the repository', 'Logs and health checks are visible', 'The service has a documented rollback or recovery path', 'The portfolio records provider, region, service choices, and cost assumptions'],
    resources: [resource('Azure Container Apps quickstart', 'Microsoft Learn', 'Deploy source code to Azure Container Apps with the current Azure CLI workflow.', 'https://learn.microsoft.com/en-us/azure/container-apps/quickstart-code-to-cloud'), resource('Azure Container Apps GitHub Actions', 'Microsoft Learn', 'Automate revisions with Azure login, managed identity, ACR, and the deployment action.', 'https://learn.microsoft.com/en-us/azure/container-apps/github-actions'), resource('AWS ECS Express Mode migration', 'AWS', 'Use the current AWS path recommended for new deployments after App Runner availability changes.', 'https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html'), resource('Google Cloud Architecture Center', 'Google Cloud', 'Study Google Cloud architecture patterns and implementation guidance.', 'https://cloud.google.com/architecture')],
  },
  {
    id: 'cicd-deployment', title: 'Automate CI/CD deployment', tone: 'neutral',
    description: 'Make every change pass tests and security checks before a repeatable deployment promotes the same artifact to an environment.',
    deliverables: ['A GitHub Actions workflow', 'Automated tests and linting on pull requests', 'A built and scanned artifact', 'A staging deployment with a documented promotion or rollback path'],
    evidence: ['A failing test blocks the workflow', 'A successful commit produces a traceable artifact', 'Deployment status and logs are visible', 'The README explains environment variables and approvals', 'The workflow does not expose secrets in logs'],
    resources: [resource('GitHub Actions documentation', 'GitHub', 'Build workflows for testing, artifacts, releases, and deployment automation.', 'https://docs.github.com/en/actions'), resource('DevOps architecture', 'Google Cloud', 'Study continuous integration, delivery, deployment strategies, and operational feedback.', 'https://cloud.google.com/architecture/devops')],
  },
  {
    id: 'infrastructure-as-code-execution', title: 'Execute infrastructure as code', tone: 'gold',
    description: 'Provision a small cloud environment from versioned Terraform, review the plan, apply it safely, and destroy it when finished.',
    deliverables: ['A Terraform repository with variables and outputs', 'A reviewed terraform plan artifact', 'A provisioned environment with least-privilege access', 'A documented destroy and recovery procedure'],
    evidence: ['The infrastructure can be recreated from a clean checkout', 'Remote state and credentials are protected', 'Manual drift is detected or documented', 'Resources are tagged and cost-bounded', 'The portfolio includes the plan, diagram, and provider tradeoffs'],
    resources: [resource('Terraform tutorials', 'HashiCorp', 'Learn providers, state, modules, plans, applies, and infrastructure lifecycle.', 'https://developer.hashicorp.com/terraform/tutorials'), resource('Terraform on Azure', 'Microsoft Learn', 'Practice repeatable Azure infrastructure with Terraform and deployment pipelines.', 'https://learn.microsoft.com/en-us/training/paths/automate-azure-tasks-with-terraform/')],
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

export function isCareerLevelComplete(level: CareerLevel, completedLessonIds: string[]) {
  const lessonsComplete = (level.requiredLessonIds ?? []).every((lessonId) => completedLessonIds.includes(lessonId))
  const projectIds = level.requiredProjectLessonIds ?? []
  const projectsComplete = !projectIds.length || (level.projectCompletion === 'all' ? projectIds.every((lessonId) => completedLessonIds.includes(lessonId)) : projectIds.some((lessonId) => completedLessonIds.includes(lessonId)))
  const providerComplete = !level.providerModuleIds?.length || level.providerModuleIds.some((moduleId) => getModuleProgress(curriculumModules.find((module) => module.id === moduleId)!, completedLessonIds).complete)
  return lessonsComplete && projectsComplete && providerComplete
}

export const firstLesson = lessons[0]
