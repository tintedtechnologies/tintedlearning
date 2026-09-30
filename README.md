# Tinted Learning

Tinted Learning is a free, beginner-friendly source map for becoming an AI Developer, AI Engineer, or AI Architect.

The goal is practical understanding:

> Build the system. Explain the decisions.
Tinted Learning teaches the essential mental model in the app, then points learners to trusted free resources for deeper study and practice.

## Current Release

**v1.0.0**

This release adds the expanded source-map learning experience: 163 lessons across seven stages, advanced Python and AI Mathematics & Research paths, a standalone Technical Leadership & Communication stage, animated concept explanations, 14-lesson Azure, AWS, and Google Cloud provider paths with enterprise architecture capstones, an expanded browser playground, current cloud certification paths, updated AI security and governance guidance, foldable curriculum stages, and optional Clerk accounts for synced progress, stage tracking, dashboards, and portfolio direction.

## What This Is

Tinted Learning is:
- A guided map through the foundations of modern AI engineering
- A beginner-friendly explanation layer over high-quality free resources
- A place to practice concepts with code, math, quizzes, and project checkpoints
- A no-login learning tool that works locally in the browser

Tinted Learning is not:
- A replacement for a university degree or a complete computer-science program
- A guarantee of employment or professional certification
- A hosted cloud lab that pays for learner infrastructure

## No Account Required

Learners do not need to create an account.
Lesson completion is stored locally in the browser using `localStorage`. The app does not require a backend for curriculum progress, and clearing browser storage or using another browser will remove or reset that local progress.

Cloud projects use the learner's own provider accounts. They may require billing-enabled accounts and can create charges. Learners should use dedicated projects, budget alerts, least-privilege identities, and cleanup commands.

## The Learning Path

The curriculum has seven stages.

### 1. Foundation

- AI fundamentals
- Computing and math
- Python
- Git and GitHub
- Linux and the command line

The Python module does not require advanced mathematics. Learners need basic computer skills, files, folders, a terminal, and a willingness to run and modify small programs.

### 2. Software Engineering

- APIs and REST
- HTTP and networking
- Databases and SQL
- Data structures
- Testing and debugging
- Docker

### 3. AI Engineering

- LLMs
- Prompting
- Structured outputs
- Embeddings
- Vector databases
- Retrieval-augmented generation
- Tool and function calling
- Agents
- Evaluation
- Guardrails
- Observability

### 4. Cloud Engineering

- Cloud Foundations: shared responsibility, IAM, compute, storage, networking, containers, serverless, CI/CD, and infrastructure as code
- Azure: 14 lessons from resource organization and identity through governance, data, AKS, security, resilience, AI platforms, and enterprise architecture
- AWS: 14 lessons from accounts and IAM through governance, data, ECS/EKS, security, resilience, AI platforms, and enterprise architecture
- Google Cloud: 14 lessons from resource hierarchy and IAM through governance, data, GKE, security, resilience, AI platforms, and enterprise architecture

The complete executable portfolio deployment path is currently Google Cloud-first. Azure Container Apps and AWS ECS Express Mode are linked as current provider comparison and extension paths.

Each 14-lesson provider path ends with a certification readiness checklist and official foundational, associate, and professional credential links. Always confirm current exam versions, prerequisites, pricing, delivery options, and retirement notices on the provider page before booking.

### 5. AI Architecture

- System design
- Distributed systems
- Scalability
- Reliability
- Security and governance
- Cost optimization
- Architecture patterns
- Enterprise integration
- Architecture decision records

### 6. Technical Leadership & Communication

- Customer discovery and stakeholder requirements
- Scope of work and proposals
- Value propositions and business cases
- Consultative selling and solution demos
- Commercial negotiation and procurement
- Executive writing and presentations
- Planning, prioritization, feedback, and conflict resolution
- Mentoring, delegation, coaching, and organizational systems
- Professional leadership practicum

This stage does not require programming. It produces customer briefs, scopes, business cases, decision memos, delivery plans, demo scripts, negotiation records, and leadership reflections.

### 7. Projects

Projects are the evidence stage, not another lecture catalog. Learners should leave projects with working code, tests, documentation, diagrams, deployment evidence, and explicit tradeoffs.

## Career Outcomes

The pathway has four visible outcomes:

1. **Start Here**
2. **AI Developer**
3. **AI Engineer**
4. **AI Architect**

Milestones are not based on reading alone. The later outcomes require project work and portfolio evidence.

### AI Developer Evidence

- Public Git repository
- Clear README
- Automated tests
- Working API-backed or local AI application
- Documented setup and decisions

### AI Engineer Evidence

- Tested RAG or agent repository
- Evaluation dataset and results
- Threat model and guardrail decisions
- Tracing or observability evidence
- Documented failure analysis

### AI Architect Evidence

- Deployed cloud architecture
- Architecture diagram and ADRs
- Reliability and incident plan
- Threat model and security controls
- Cost estimate and optimization plan
- Final design review presentation

## Portfolio Studio

The Portfolio Studio helps learners turn projects into public evidence.

Available tracks include:

- **Publish your engineering portfolio**: GitHub repository and GitHub Pages site
- **Deploy a real AI application**: local service to Google Cloud Run
- **Automate CI/CD deployment**: tests, identity federation, deployment, and rollback evidence
- **Evaluate and operate an AI system**: quality, safety, latency, cost, red-team, and failure evidence
- **Execute infrastructure as code**: Terraform plan, apply, outputs, destroy, and state safety
- **Build a technical leadership portfolio**: discovery, scope, business case, communication, negotiation, and reflection
- **Publish an AI mathematics investigation**: derivation, tested implementation, reproducible experiments, and uncertainty analysis

The portfolio should answer:

- What did you build?
- How does it work?
- Why did you choose this architecture?
- What failed?
- How did you test it?
- What does it cost?
- How would you operate or recover it?

## Free Resources

Resources are attached to individual lessons so they match the topic being studied.

The curriculum uses official and open resources such as:

- Python.org
- Git SCM and Pro Git
- MDN Web Docs
- PostgreSQL
- Docker
- Khan Academy
- Google for Developers
- Microsoft Learn
- AWS documentation
- Google Cloud documentation
- Hugging Face
- OpenAI documentation
- OWASP
- NIST
- MITRE ATLAS
- OpenTelemetry
- FinOps Foundation

Provider links can change over time. The app's in-app explanations are intended to remain useful even when a provider changes a URL, SDK, model name, or product interface.

## Run Locally

Requirements:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite server is configured to support both `localhost` and `127.0.0.1`.

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Validate the curriculum, resources, career requirements, prerequisites, and portfolio projects:

```bash
npm run validate:curriculum
```

## Project Structure

```text
src/
	components/
		common/              Shared layout components
		learning/            Curriculum, project, and learning UI
	data/
		curriculum.ts        Stages, modules, lessons, careers, portfolio tracks
		lessonContent.ts     Lesson explanations, examples, quizzes, and projects
		lessonResources.ts   Topic-specific free resources
		orientationLessons.ts Software, cloud, and architecture orientation lessons
		portfolioProjects.ts Cloud, AI evaluation, leadership, and mathematics walkthroughs
	hooks/
		useProgress.ts       Local browser progress storage
	pages/                 Route-level experiences
	types/                 Curriculum and project contracts
scripts/
	validate-curriculum.ts Curriculum integrity and project checks
```

## v1 Release Status

### v1.0: Released

Tinted Learning v1 is the first complete browser-first release: the curriculum, onboarding, personalized plans, portfolio studio, project metadata, accessibility checks, mobile checks, and core browser journeys are in place.

### v1 status

| Area | Status | What is true today |
| --- | --- | --- |
| Curriculum breadth | Complete | 163 lessons across seven stages, including Python, AI Mathematics & Research, and Technical Leadership & Communication. |
| Portfolio breadth | Complete | Seven portfolio tracks cover publishing, cloud deployment, CI/CD, AI evaluation, infrastructure, leadership, and mathematics. |
| Project evidence | Complete | Projects define deliverables, proof points, setup, steps, checkpoints, verification, and next steps. |
| Path selection | Complete | Learning plans support Explore AI, Python Developer, AI Mathematics & Research, Technical Leadership, AI Developer, AI Engineer, Cloud Engineer, and AI Architect. |
| First-time onboarding | Complete | The homepage offers goal-based routes and connects selected goals to the plan builder or free curriculum. |
| Browser QA | Complete | Playwright covers onboarding, stage folding, portfolio routes, guest access, donation links, mobile overflow, and accessibility checks. |
| Mobile and accessibility | Complete | Responsive smoke coverage, contrast checks, focus-visible styling, and dialog focus trapping are in place. |
| Content freshness | Maintained | Provider links and dated guidance are audited as part of release maintenance. |

- Keep every lesson mapped to one authoritative stage and module
- Keep every lesson backed by topic-specific resources
- Keep prerequisites visible and accurate
- Keep progress local and account-free
- Keep project steps and checkpoints understandable inside the hosted site
- Keep provider links current and labeled honestly
- Keep the 163-lesson, seven-stage curriculum validated before release

## After v1 Roadmap

### v1.1: Stronger beginner experience

- Add a dedicated onboarding path for learners new to programming
- Show a recommended next lesson and estimated weekly pace
- Add clearer “required” versus “optional” resource labels
- Add troubleshooting guidance for common setup failures
- Keep in-site project difficulty, time, cost, and setup summaries current
- Add a visible project difficulty, time estimate, and required-cost warning before setup

### v1.2: Evidence-based projects

- Add complete cloud walkthroughs for the selected primary provider
- Add smoke-test scripts for deployed services
- Add deployment evidence templates
- Add browser verification for project routes and interactive controls
- Add architecture review and portfolio submission checklists
- Add AI evaluation, technical leadership, and mathematics project templates to the portfolio publishing flow

### v1.3: Multi-provider depth

- Add a complete Azure Container Apps walkthrough
- Add a complete AWS ECS Express Mode walkthrough
- Add provider-specific IAM and identity labs
- Add provider-specific Terraform execution paths
- Compare cost, networking, identity, and operations across providers

### Next steps after v1

1. Add a dedicated signed-in Clerk browser test with a stable test account and cross-session plan persistence.
2. Continue auditing external links and dated provider guidance as providers change documentation.
3. Add visual regression snapshots for the homepage, learning plan, portfolio studio, and project guides.
4. Expand screen-reader testing with a dedicated accessibility review.
5. Run external learner reviews and prioritize improvements from real usage evidence.

### Later

- Optional account-backed progress synchronization
- Optional project artifact review
- Optional mentor or peer feedback
- More complete automated project verification
- Certification only if assessment standards and review processes are defined honestly

## Definition of Done for v1

Tinted Learning v1 is successful when a new learner can:

1. Start without an account or prior AI knowledge.
2. Understand what to learn before opening a module.
3. Explain the core idea in their own words.
4. Run or modify a relevant code or math example.
5. Follow a topic-specific free resource for deeper study.
6. Build at least one tested AI application.
7. Publish the work to GitHub.
8. Explain the system's architecture and tradeoffs.
9. Produce a portfolio page with working links and evidence.
10. Understand which skills still require real-world practice or review.
11. Choose a path that matches their goal, including Python development, AI mathematics, or technical leadership.
12. Complete a portfolio project with visible evidence, limitations, and a clear next step from the hosted site.

## Contribution

Before changing curriculum data:

1. Preserve existing lesson IDs unless a migration is planned.
2. Add lesson-specific resources rather than broad unrelated resource bundles.
3. Add prerequisites that match the actual content and setup requirements.
4. Add project verification criteria for new guided projects.
5. Run both checks:

```bash
npm run validate:curriculum
npm run build
```

Keep claims specific, examples executable, and provider guidance linked to current official documentation.

## License

See [LICENSE](LICENSE).