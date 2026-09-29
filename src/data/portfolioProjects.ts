import type { GuidedProject } from '../types/curriculum'

export const portfolioProjects: Record<string, GuidedProject> = {
  cloudDeployment: {
    goal: 'Deploy a small Python service to Google Cloud Run, verify it from the public URL, inspect logs, and document the architecture and cost assumptions in your portfolio. This is the primary provider walkthrough; repeat the same design on Azure or AWS using the linked provider resources.',
    prerequisites: ['A GitHub repository containing a small Python service.', 'A Google Cloud account with billing enabled and a project.', 'Google Cloud CLI installed and authenticated.', 'Docker installed for local testing.', 'A public repository with no secrets or private data.'],
    setup: ['Clone your project and enter its directory.', 'Choose a Google Cloud project ID and region such as us-central1.', 'Create the files listed below if your project does not already have them.', 'Never commit service-account keys, API keys, .env files, or local credentials.'],
    files: [
      { path: 'app.py', purpose: 'Run a small HTTP service and expose a health endpoint.' },
      { path: 'requirements.txt', purpose: 'Pin the Python runtime dependency.' },
      { path: 'Dockerfile', purpose: 'Describe the production container image.' },
      { path: '.dockerignore', purpose: 'Keep local environments and secrets out of the build context.' },
      { path: 'README.md', purpose: 'Document deployment, URL, architecture, cost assumptions, and rollback.' },
    ],
    platformNotes: ['Cloud Run bills by usage, but billing still must be enabled for the project.', 'Use a dedicated project for learning and set budget alerts before deploying.', 'The first deployment allows unauthenticated access for a portfolio demo. Remove that flag and configure authentication for private workloads.', 'The commands below use macOS/Linux shell syntax. Windows PowerShell users can run the same gcloud commands and create files in VS Code.'],
    dependencies: ['python -m pip install flask', 'gcloud auth login', 'gcloud auth application-default login'],
    steps: [
      { title: 'Create a health endpoint', instructions: ['Create app.py, requirements.txt, Dockerfile, and .dockerignore from the examples below.', 'Run the service locally before deploying it.', 'The service must listen on the PORT environment variable because Cloud Run injects it.'], commands: ['python -m venv .venv', 'source .venv/bin/activate', 'python -m pip install -r requirements.txt', 'python app.py'], code: 'import os\nfrom flask import Flask\n\napp = Flask(__name__)\n\n\n@app.get("/health")\ndef health():\n    return {"status": "ok"}\n\n\n@app.get("/")\ndef home():\n    return {"service": "portfolio-demo", "status": "running"}\n\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))\n\n# requirements.txt\n# flask==3.1.2\n\n# Dockerfile\n# FROM python:3.12-slim\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir -r requirements.txt\n# COPY app.py .\n# CMD ["python", "app.py"]\n\n# .dockerignore\n# .venv\n# __pycache__\n# .env\n# .git\n# *.tfstate*', checkpoint: 'Run python app.py and open http://127.0.0.1:8080/health. You should receive {"status":"ok"}.' },
      { title: 'Configure the cloud project', instructions: ['Replace PROJECT_ID and REGION with your values.', 'Enable only the services this walkthrough needs.', 'Create a budget alert in the Cloud Billing console before continuing.'], commands: ['gcloud auth login', 'gcloud config set project PROJECT_ID', 'gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com', 'gcloud config set run/region REGION'], checkpoint: 'Run gcloud config list and confirm the active project and region are the values you intend to use.' },
      { title: 'Deploy to Cloud Run', instructions: ['Commit the working files before deployment so the deployed state has a Git reference.', 'Deploy from the repository root.', 'Copy the service URL printed by gcloud for your README and portfolio site.'], commands: ['git add app.py requirements.txt Dockerfile .dockerignore README.md', 'git commit -m "Deploy portfolio service to Cloud Run"', 'gcloud run deploy portfolio-demo --source . --allow-unauthenticated --region REGION --project PROJECT_ID'], checkpoint: 'Open the printed URL and append /health. The response should show status ok.' },
      { title: 'Inspect production behavior', instructions: ['Describe the service configuration.', 'Read recent logs.', 'Record the region, URL, revision, memory, concurrency, and authentication choice in README.md.'], commands: ['gcloud run services describe portfolio-demo --region REGION --format="yaml(status.url,spec.template.metadata.annotations)"', 'gcloud run services logs read portfolio-demo --region REGION --limit 20'], checkpoint: 'README.md should explain what runs, where it runs, who can access it, and what happens if the deployment fails.' },
      { title: 'Add the portfolio evidence', instructions: ['Add the live URL, source repository, architecture diagram, deployment command, and cost assumptions to README.md.', 'Take a screenshot of the health endpoint and Cloud Run service page.', 'Link the project from your GitHub Pages portfolio.'], checkpoint: 'A reviewer should be able to open the repository, understand the architecture, and verify the live endpoint without needing your local machine.' },
    ],
    verification: ['The service deploys from a clean Git checkout.', 'The live /health endpoint returns a successful response.', 'Logs and service configuration are inspectable.', 'README.md documents provider, region, authentication, cost assumptions, and rollback.', 'The repository contains no credentials or private data.'],
    nextSteps: ['Add a database or queue only after documenting why the service needs state.', 'Add authentication and remove unauthenticated access for private data.', 'Repeat the deployment on Azure Container Apps or AWS ECS Express Mode and compare the tradeoffs.'],
  },
  cicdDeployment: {
    goal: 'Automate tests and deployment of the Cloud Run service with GitHub Actions. Every pull request runs checks; every approved merge to main deploys the same repository through a traceable workflow.',
    prerequisites: ['Complete the Cloud Run deployment walkthrough.', 'A GitHub repository with the service code.', 'A Google Cloud project and Cloud Run service.', 'A GitHub Actions identity configured with Workload Identity Federation.', 'A reviewer who can inspect the workflow before it can deploy.'],
    setup: ['Create .github/workflows/deploy.yml.', 'Create a dedicated deploy service account with only the permissions required by the workflow.', 'Configure GitHub repository variables GCP_PROJECT_ID and GCP_REGION.', 'Configure the non-secret workload identity provider and service account names as repository variables or organization configuration.', 'Keep service-account keys out of GitHub. Prefer short-lived federated credentials.'],
    files: [{ path: '.github/workflows/deploy.yml', purpose: 'Run checks on pull requests and deploy the approved main branch.' }, { path: 'requirements.txt', purpose: 'Provide reproducible application dependencies.' }, { path: 'README.md', purpose: 'Document workflow triggers, permissions, rollback, and deployment evidence.' }],
    platformNotes: ['GitHub Actions can deploy with short-lived identity federation; do not store a JSON service-account key as a repository secret for this walkthrough.', 'The deploy job should have id-token: write and only the cloud permissions it needs.', 'Use a staging service or environment before production. Require approval for production if the project handles real data.'],
    dependencies: ['No local dependency beyond Git and a working test command.', 'GitHub Actions: google-github-actions/auth@v3', 'GitHub Actions: google-github-actions/setup-gcloud@v3'],
    steps: [
      { title: 'Add a deterministic test', instructions: ['Ensure the repository has a test command that does not call a paid model API.', 'The workflow must be able to run from a clean checkout without local credentials.', 'Fail the test when the health contract changes unexpectedly.'], commands: ['python -m pip install -r requirements.txt', 'pytest -q'], code: 'def test_health_payload():\n    response = client.get("/health")\n    assert response.status_code == 200\n    assert response.json == {"status": "ok"}', checkpoint: 'Run the test locally without an API key. It should pass before you add deployment automation.' },
      { title: 'Add the workflow', instructions: ['Create .github/workflows/deploy.yml.', 'Replace the identity placeholders with your configured provider values.', 'Review the permissions and deployment command before pushing.'], commands: ['mkdir -p .github/workflows', 'git add .github/workflows/deploy.yml', 'git commit -m "Automate Cloud Run deployment"', 'git push origin main'], code: 'name: test-and-deploy\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n  id-token: write\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - run: python -m pip install -r requirements.txt\n      - run: pytest -q\n\n  deploy:\n    if: github.event_name == "push" && github.ref == "refs/heads/main"\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - id: auth\n        uses: google-github-actions/auth@v3\n        with:\n          workload_identity_provider: ${{ vars.GCP_WORKLOAD_IDENTITY_PROVIDER }}\n          service_account: ${{ vars.GCP_DEPLOY_SERVICE_ACCOUNT }}\n      - uses: google-github-actions/setup-gcloud@v3\n      - run: gcloud run deploy portfolio-demo --source . --region ${{ vars.GCP_REGION }} --project ${{ vars.GCP_PROJECT_ID }} --quiet', checkpoint: 'Open the Actions tab. A pull request should run tests without deploying; a merge to main should test first and then deploy.' },
      { title: 'Test a failure and a rollback', instructions: ['Open a branch and intentionally break the health test.', 'Push the branch and confirm the workflow fails before deployment.', 'Restore the test, merge it, and record the deployment revision.', 'Document how to route traffic back to the previous revision if a deployment is bad.'], commands: ['git switch -c test-ci-failure', 'git push -u origin test-ci-failure', 'gcloud run revisions list --service portfolio-demo --region REGION'], checkpoint: 'Your README should show evidence of one blocked deployment and one successful deployment.' },
      { title: 'Publish the delivery evidence', instructions: ['Add the workflow file, a screenshot of a passing run, a screenshot of a blocked run, and the rollback command to your portfolio.', 'Do not publish logs containing secrets, tokens, or private user data.'], checkpoint: 'A reviewer can see that tests run before deployment and that the release path is repeatable.' },
    ],
    verification: ['Pull requests run tests without deploying.', 'Merges to main deploy only after tests pass.', 'Credentials use short-lived federation rather than committed keys.', 'A failed test blocks release and a previous revision can be restored.', 'The workflow and evidence are linked from the portfolio site.'],
    nextSteps: ['Add a staging environment and an approval gate.', 'Add dependency and container scanning.', 'Add smoke tests against the deployed health endpoint after release.'],
  },
  infrastructureAsCode: {
    goal: 'Provision the Cloud Run service and its supporting API configuration with Terraform, review the plan, apply it, inspect the outputs, and destroy the learning environment safely.',
    prerequisites: ['Terraform installed.', 'Google Cloud CLI authenticated with application-default credentials.', 'A dedicated learning project with billing alerts.', 'A container image or source service you are allowed to deploy.', 'The Cloud Engineering IAM and Infrastructure as Code lessons.'],
    setup: ['Create a folder named terraform in your repository.', 'Create the files listed below.', 'Choose a project ID, region, and globally unique service name.', 'Never commit terraform.tfstate, terraform.tfstate.backup, .terraform/, or secret variable values.', 'For team work, configure remote state with locking before sharing the project.'],
    files: [{ path: 'terraform/main.tf', purpose: 'Declare provider APIs and the Cloud Run service.' }, { path: 'terraform/variables.tf', purpose: 'Define configurable project and service inputs.' }, { path: 'terraform/outputs.tf', purpose: 'Expose the deployed URL and service identity.' }, { path: 'terraform/.gitignore', purpose: 'Exclude state, plans, plugins, and local variables.' }, { path: 'terraform/README.md', purpose: 'Document plan, apply, destroy, ownership, and cost boundaries.' }],
    platformNotes: ['Terraform apply can create billable resources. Use a dedicated project and budget alert.', 'Review terraform plan before every apply. Never apply a plan you cannot explain.', 'State can contain sensitive values. Use protected remote state for shared work and never publish it on GitHub.', 'This walkthrough uses Google Cloud resources; map the same concepts to Azure or AWS only after understanding state and lifecycle.'],
    dependencies: ['terraform init', 'terraform fmt -check', 'terraform validate', 'terraform plan', 'terraform apply', 'terraform destroy'],
    steps: [
      { title: 'Declare the provider and service', instructions: ['Create terraform/main.tf and terraform/variables.tf.', 'Use an existing container image for the first run so Terraform focuses on infrastructure lifecycle.', 'Replace the image placeholder with a container you control.'], commands: ['cd terraform', 'terraform init', 'terraform fmt', 'terraform validate'], code: 'terraform {\n  required_providers {\n    google = {\n      source  = "hashicorp/google"\n      version = "~> 7.0"\n    }\n  }\n}\n\nprovider "google" {\n  project = var.project_id\n  region  = var.region\n}\n\nresource "google_project_service" "run" {\n  service = "run.googleapis.com"\n}\n\nresource "google_cloud_run_v2_service" "app" {\n  name     = var.service_name\n  location = var.region\n  ingress  = "INGRESS_TRAFFIC_ALL"\n\n  template {\n    containers {\n      image = var.image\n    }\n  }\n\n  depends_on = [google_project_service.run]\n}\n\n# variables.tf\n# variable "project_id" { type = string }\n# variable "region" { type = string, default = "us-central1" }\n# variable "service_name" { type = string }\n# variable "image" { type = string }', checkpoint: 'terraform validate should report a valid configuration before you create anything.' },
      { title: 'Plan before apply', instructions: ['Create outputs.tf for the service URL.', 'Pass variables through terraform.tfvars locally or -var flags; never commit secrets.', 'Save the plan so the exact reviewed changes are the changes applied.'], commands: ['terraform plan -out=tfplan', 'terraform show tfplan'], code: 'output "service_url" {\n  value = google_cloud_run_v2_service.app.uri\n}\n\n# terraform.tfvars.example\n# project_id   = "your-learning-project"\n# region       = "us-central1"\n# service_name = "portfolio-demo"\n# image        = "us-docker.pkg.dev/cloudrun/container/hello"', checkpoint: 'The plan should show only the resources you expect. Save a screenshot or artifact of the reviewed plan for your portfolio.' },
      { title: 'Apply and inspect', instructions: ['Apply the saved plan only after reviewing it.', 'Read the output URL and inspect the service with gcloud.', 'Record the resource names, region, identity, and cost assumptions.'], commands: ['terraform apply tfplan', 'terraform output service_url', 'gcloud run services describe portfolio-demo --region REGION'], checkpoint: 'The service URL should resolve, and the Terraform output should match the deployed resource.' },
      { title: 'Destroy and recover', instructions: ['When finished, run terraform plan -destroy before destroying the learning environment.', 'Apply the destroy plan and confirm the service is gone.', 'Document what state would be needed to recover or recreate the service.'], commands: ['terraform plan -destroy -out=destroy.tfplan', 'terraform show destroy.tfplan', 'terraform apply destroy.tfplan'], checkpoint: 'The environment should be removed without deleting unrelated project resources. Commit the configuration, not local state.' },
      { title: 'Publish the IaC evidence', instructions: ['Add the Terraform files, reviewed plan, architecture diagram, service output, and destroy evidence to your portfolio.', 'Explain why Terraform is used, what it owns, what it does not own, and how drift would be handled.'], checkpoint: 'A reviewer can clone the repository, inspect the plan, understand the state boundary, and reproduce the environment with their own project variables.' },
    ],
    verification: ['terraform fmt, validate, and plan pass from a clean checkout.', 'The reviewed plan is the plan that gets applied.', 'The deployed service is visible through Terraform outputs.', 'State and credentials are protected and excluded from Git.', 'Destroy and recreation procedures are documented.'],
    nextSteps: ['Move state to a protected remote backend with locking.', 'Add policy checks and CI plan review.', 'Provision the CI/CD service identity with least privilege instead of using a personal account.'],
  },
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
  technicalLeadershipPortfolio: {
    goal: 'Lead a bounded initiative from customer evidence to a clear scope, value case, decision, delivery plan, and reflective portfolio. The project may be real, simulated, or based on a public case study, but it must preserve evidence and make every commitment inspectable.',
    prerequisites: ['Complete the Technical Leadership & Communication stage or equivalent senior project experience.', 'A real or simulated problem with at least three stakeholder perspectives.', 'A reviewer who can challenge your assumptions and communication.'],
    setup: ['Create a public repository named technical-leadership-portfolio.', 'Use fictional, public, or fully anonymized information. Do not publish confidential customer data.', 'Create the files listed below and keep a dated decision log as the project changes.', 'Choose a problem small enough to investigate in two to four weeks but ambiguous enough to require judgment.'],
    files: [
      { path: 'README.md', purpose: 'Executive summary, context, outcome, links to artifacts, and what changed after feedback.' },
      { path: 'discovery.md', purpose: 'Conversation plan, anonymized evidence, observations, open questions, and stakeholder map.' },
      { path: 'scope-of-work.md', purpose: 'Outcome, deliverables, exclusions, assumptions, milestones, acceptance criteria, and change process.' },
      { path: 'business-case.md', purpose: 'Baseline, value hypothesis, costs, risks, alternatives, sensitivity, and pilot recommendation.' },
      { path: 'decision-memo.md', purpose: 'Decision, audience-specific summary, options, recommendation, owner, and review trigger.' },
      { path: 'delivery-plan.md', purpose: 'Risk-first milestones, dependencies, owners, confidence ranges, and evidence checkpoints.' },
      { path: 'demo-script.md', purpose: 'Customer-centered demo narrative, proof points, limits, and next-step request.' },
      { path: 'negotiation-log.md', purpose: 'Requests, interests, constraints, trades, agreements, and unresolved items.' },
      { path: 'reflection.md', purpose: 'Feedback, changed assumptions, outcomes, conflict, ethical boundaries, and next practice.' },
    ],
    platformNotes: ['This is a leadership evidence project, not a fictional sales pitch. Label assumptions and simulated data clearly.', 'A reviewer should be able to distinguish what you observed, what you inferred, what you promised, and what remains unknown.', 'Do not claim customer revenue, savings, adoption, or approval unless you have permission and evidence to support it.'],
    dependencies: ['No software dependency is required.', 'Optional: a diagram tool, spreadsheet, or static site for presenting the portfolio.'],
    steps: [
      { title: 'Choose and frame the initiative', instructions: ['Write the desired outcome, users, non-goals, constraints, decision owner, and time boundary in README.md.', 'Choose a problem where a solution is not obvious and where multiple people experience different consequences.', 'Write three assumptions that could invalidate the initiative.'], checkpoint: 'A reader can explain the problem and why it matters without seeing a proposed feature.' },
      { title: 'Conduct discovery', instructions: ['Prepare neutral questions about recent behavior, workarounds, cost, risk, and decision process.', 'Collect at least three stakeholder perspectives or use three clearly labeled public case sources.', 'Separate direct evidence, interpretation, and open questions in discovery.md.', 'Map the user, buyer, operator, approver, and person affected by failure.'], checkpoint: 'The discovery record contains evidence that could disconfirm your initial framing.' },
      { title: 'Write scope and value', instructions: ['Define deliverables, exclusions, assumptions, dependencies, milestones, and acceptance criteria.', 'Build a value hypothesis from baseline, intervention, behavior change, outcome, and cost.', 'Show at least two alternatives and a sensitivity check for the most important assumption.'], checkpoint: 'A reviewer can identify what is promised, what is not promised, how value will be measured, and what could change the recommendation.' },
      { title: 'Make and communicate the decision', instructions: ['Write a decision memo for a mixed technical and non-technical audience.', 'Create a five-minute demo script that shows the before, after, evidence, limit, and next decision.', 'Ask your reviewer to challenge scope, value, risk, and ethical boundaries. Record the response.'], checkpoint: 'The memo makes a specific decision request and the demo does not hide uncertainty or unsupported capability.' },
      { title: 'Plan, negotiate, and reflect', instructions: ['Create a risk-first delivery plan with owners, dependencies, confidence ranges, and review triggers.', 'Record one negotiation where scope, timing, quality, price, or support was traded explicitly.', 'Write a final reflection describing what changed, what you would stop, and how your communication affected the work.'], checkpoint: 'The portfolio shows judgment over time rather than a polished answer created after the fact.' },
    ],
    verification: ['A public repository contains all core artifacts and a clear executive summary.', 'At least three stakeholder perspectives are represented without exposing private information.', 'Scope includes deliverables, exclusions, assumptions, acceptance criteria, and change control.', 'The business case includes baseline, value, cost, risk, alternatives, and sensitivity.', 'The portfolio records feedback, a changed assumption or plan, and a concrete next practice.'],
    nextSteps: ['Ask a senior practitioner to review the portfolio against the evidence checklist.', 'Turn the initiative into a real pilot only with explicit authorization and data protections.', 'Create a second version for a different audience, such as an executive one-pager or customer-facing proposal.'],
  },
  aiMathematicsResearchPortfolio: {
    goal: 'Complete a reproducible mathematical investigation connected to AI. Formulate a question, derive the method, implement a baseline, run controlled experiments, quantify uncertainty or sensitivity, and publish the evidence with honest limitations.',
    prerequisites: ['Complete probability, statistics, linear algebra, calculus, optimization, Python, and experiment design lessons.', 'Python 3.12 or newer and a Git repository.', 'A mathematical question that can be answered with simulated or public data.'],
    setup: ['Create a public repository named ai-mathematics-research.', 'Create src/, tests/, reports/, and notebooks/ or experiments/ directories.', 'Create a pyproject.toml or requirements.txt with pinned dependencies.', 'Choose a random seed and record the Python, NumPy, SciPy, and plotting-library versions.', 'Use synthetic or public data and document its source and license.'],
    files: [
      { path: 'README.md', purpose: 'Research question, result summary, reproduction commands, and limitations.' },
      { path: 'proposal.md', purpose: 'Hypothesis, variables, assumptions, baseline, evaluation measure, and planned experiments.' },
      { path: 'src/', purpose: 'Reusable implementation of the mathematical method with clear inputs and outputs.' },
      { path: 'tests/', purpose: 'Known-case, shape, boundary, and numerical-stability tests.' },
      { path: 'experiments/', purpose: 'Versioned scripts or configurations that generate results from clean inputs.' },
      { path: 'reports/results.md', purpose: 'Derivation, tables, plots, uncertainty, failure analysis, and conclusion.' },
    ],
    platformNotes: ['A notebook is useful for exploration, but the final result must be runnable from scripts or documented notebook cells in a clean environment.', 'Do not present a single attractive plot as proof. Include a baseline, repeated trials where randomness matters, and cases where the method performs poorly.', 'Distinguish mathematical error, implementation error, measurement noise, and model mismatch.'],
    dependencies: ['python -m pip install numpy scipy matplotlib pandas pytest', 'python -m pip install -e .'],
    steps: [
      { title: 'Write the research proposal', instructions: ['Choose one bounded question, such as optimizer convergence, estimator behavior under noise, matrix conditioning, or representation quality.', 'Define every variable, unit, assumption, baseline, metric, and failure case.', 'State what result would support, weaken, or falsify your hypothesis.'], checkpoint: 'A reviewer can tell what claim will be tested and what evidence would change your mind.' },
      { title: 'Derive and test the method', instructions: ['Explain the key equation or algorithm in reports/results.md.', 'Implement the method in src/ with small functions and explicit shape or domain checks.', 'Add a known-case test and at least one boundary or numerical-stability test.'], commands: ['python -m pytest'], checkpoint: 'The implementation agrees with a hand-worked case, analytic solution, or documented reference before the main experiment runs.' },
      { title: 'Run controlled experiments', instructions: ['Change one important variable at a time and keep the baseline visible.', 'Record seed, parameters, runtime, error, convergence behavior, and output.', 'Repeat trials when sampling or initialization creates meaningful variation.'], commands: ['python experiments/run_baseline.py', 'python experiments/run_sensitivity.py'], checkpoint: 'A clean run recreates the results table without manual notebook state.' },
      { title: 'Analyze uncertainty and failure', instructions: ['Report intervals, variance, sensitivity, residuals, or another appropriate uncertainty measure.', 'Inspect cases where the method fails or becomes unstable.', 'Compare the observed behavior with the assumptions made in the proposal.'], checkpoint: 'The report explains where the result is reliable, where it is fragile, and why.' },
      { title: 'Publish the research artifact', instructions: ['Add reproduction commands, environment versions, data provenance, and a limitations section to README.md.', 'Include the derivation, code, tests, results, and one follow-up experiment.', 'Ask a reviewer to challenge the conclusion and record what you changed.'], checkpoint: 'Another person can reproduce the main result and understand what it does not prove.' },
    ],
    verification: ['A clean checkout installs dependencies and reruns the main result.', 'The derivation, code, and results use consistent variables and assumptions.', 'Tests cover a known case and a numerical edge case.', 'Results include uncertainty, sensitivity, or error analysis.', 'The report distinguishes evidence from interpretation and includes limitations.'],
    nextSteps: ['Compare the method with a stronger or simpler baseline.', 'Present the work in a ten-minute technical talk.', 'Connect the mathematical result to an AI system only after the underlying behavior is understood.'],
  },
}

const cloudProject = portfolioProjects.cloudDeployment
cloudProject.steps[0].code = `cat > app.py <<'PY'
import os
from flask import Flask

app = Flask(__name__)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def home():
    return {"service": "portfolio-demo", "status": "running"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
PY

cat > requirements.txt <<'EOF'
flask==3.1.2
EOF

cat > Dockerfile <<'EOF'
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
EOF

cat > .dockerignore <<'EOF'
.venv
__pycache__
.env
.git
*.tfstate*
EOF`
cloudProject.steps[1].instructions = ['Replace PROJECT_ID, REGION, DEPLOY_SA, and RUNTIME_SA with your values.', 'Enable only the services this walkthrough needs.', 'Create a budget alert in the Cloud Billing console before continuing.', 'For source deployment, the deploy identity needs Cloud Run Admin, Service Account User on the runtime identity, Cloud Build Editor, and Artifact Registry Writer. Use a dedicated service account.']
cloudProject.steps[1].commands = [
  'gcloud auth login',
  'gcloud config set project PROJECT_ID',
  'gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com',
  'gcloud projects add-iam-policy-binding PROJECT_ID --member="serviceAccount:DEPLOY_SA" --role="roles/run.admin"',
  'gcloud iam service-accounts add-iam-policy-binding RUNTIME_SA --member="serviceAccount:DEPLOY_SA" --role="roles/iam.serviceAccountUser"',
  'gcloud projects add-iam-policy-binding PROJECT_ID --member="serviceAccount:DEPLOY_SA" --role="roles/cloudbuild.builds.editor"',
  'gcloud projects add-iam-policy-binding PROJECT_ID --member="serviceAccount:DEPLOY_SA" --role="roles/artifactregistry.writer"',
  'gcloud config set run/region REGION',
]
cloudProject.steps[2].commands = ['git add app.py requirements.txt Dockerfile .dockerignore README.md', 'git commit -m "Deploy portfolio service to Cloud Run"', 'gcloud run deploy portfolio-demo --source . --allow-unauthenticated --region REGION --project PROJECT_ID --service-account RUNTIME_SA']

const cicdProject = portfolioProjects.cicdDeployment
cicdProject.setup = [...cicdProject.setup, 'Grant the deploy service account roles/run.admin, roles/iam.serviceAccountUser on the Cloud Run runtime service account, roles/cloudbuild.builds.editor, and roles/artifactregistry.writer.', 'Grant the GitHub workload identity principal roles/iam.workloadIdentityUser on the deploy service account, restricted to the repository subject.']
cicdProject.platformNotes = [...(cicdProject.platformNotes ?? []), 'The Google deploy action still requires Google IAM permissions; Workload Identity Federation only authenticates the workflow.', 'The workflow below uses the maintained google-github-actions/deploy-cloudrun action and deploys from source.']
cicdProject.steps[0].code = `from app import app

client = app.test_client()


def test_health_payload():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}`
cicdProject.steps[1].code = `name: test-and-deploy

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: python -m pip install -r requirements.txt pytest
      - run: pytest -q

  deploy:
    if: github.event_name == "push" && github.ref == "refs/heads/main"
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v3
        with:
          project_id: \${{ vars.GCP_PROJECT_ID }}
          workload_identity_provider: \${{ vars.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: \${{ vars.GCP_DEPLOY_SERVICE_ACCOUNT }}
      - uses: google-github-actions/deploy-cloudrun@v3
        id: deploy
        with:
          service: portfolio-demo
          source: .
          region: \${{ vars.GCP_REGION }}
          project_id: \${{ vars.GCP_PROJECT_ID }}
      - run: echo "Deployed URL: \${{ steps.deploy.outputs.url }}"`

const terraformProject = portfolioProjects.infrastructureAsCode
terraformProject.steps[0].code = `terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "run" {
  service = "run.googleapis.com"
}

resource "google_cloud_run_v2_service" "app" {
  name     = var.service_name
  location = var.region

  template {
    containers {
      image = var.image
    }
  }

  depends_on = [google_project_service.run]
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  name     = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# variables.tf
# variable "project_id" { type = string }
# variable "region" { type = string, default = "us-central1" }
# variable "service_name" { type = string }
# variable "image" { type = string }`
terraformProject.steps[2].commands = ['terraform apply tfplan', 'terraform output service_url', 'gcloud run services describe SERVICE_NAME --region REGION']
