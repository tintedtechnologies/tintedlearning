import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const founderNote = [
  'Hi, I\'m Jay. I didn\'t start with a degree. I learned to code from books, free tutorials and a lot of trial and error, and I know how much harder that path is when nobody around you has taken it. Tinted Learning is the free version of what I wish I\'d had: clear explanations, practice you can run in your browser, and projects that show what you can actually do.',
  'I still believe real teachers and peers matter. This site is a starting point, and I say so on purpose. When you need someone to review your work or answer a hard question, look for an instructor, a study group or a community.',
  'I\'m building this in public, so if something is confusing or wrong, tell me. I\'d rather fix it than have you struggle through it.',
]

const howItWorks = [
  { step: '1', title: 'Learn the idea', text: 'Each lesson explains one idea in plain language, with a worked example and a short quiz to check what stuck.' },
  { step: '2', title: 'Practice in your browser', text: 'Run Python, see how text becomes tokens, and try prompts, embeddings and agents without installing anything.' },
  { step: '3', title: 'Build something you can show', text: 'Projects end in finished work, such as a chatbot, an evaluation report or a deployed app, that becomes evidence of what you can do.' },
]

/** What each section teaches, in the learner's terms. Taken from the section's modules. */
const sections = [
  { id: 'foundations', title: 'Foundations', intro: 'Start here if AI is new to you.', learn: ['What AI is, how a learning system improves from examples, and how to frame a useful problem', 'The portable cloud ideas behind every provider: identity, storage, networking and containers', 'The programming workflow and math intuition that the rest of the site builds on'] },
  { id: 'math', title: 'Math', intro: 'The math behind AI, taught for AI.', learn: ['Probability and statistics, vectors and matrices, and what they mean for a model', 'Calculus and gradients: how a model learns by adjusting its numbers', 'Optimization and numerical methods, with a modeling project to finish'] },
  { id: 'python', title: 'Python', intro: 'From your first program to a complete project.', learn: ['Write scripts, use lists and dictionaries, and read and write files', 'Call web APIs, handle errors, and test your code', 'Build a project with packages, classes and iterators, ready to show'] },
  { id: 'research', title: 'Research', intro: 'Answer a question with evidence.', learn: ['Turn a vague question into one you can test, and collect clean data', 'Design a fair comparison and tell real differences from chance', 'Read a research paper and report your results honestly'] },
  { id: 'software-engineering', title: 'Software Engineering', intro: 'Build Study Tracker, a real Python API, step by step.', learn: ['Use the command line, Git and GitHub to save and share your work', 'Build an API with FastAPI, store data in SQLite, and keep secrets out of the code', 'Test the whole app, add logging, and package it with Docker'] },
  { id: 'technical-leadership', title: 'Technical Leadership', intro: 'Make technical work useful to the people who pay for it.', learn: ['Discover what a client really needs, and map the people who decide', 'Write a scope with exclusions and acceptance criteria, and a business case', 'Explain decisions clearly, plan under uncertainty, and lead a team'] },
  { id: 'ai-engineering', title: 'AI Engineering', intro: 'Understand modern AI, then build with it.', learn: ['How language models turn tokens into text, and where they go wrong', 'Call a model from code, get structured output, and add tools, retrieval and agents', 'Observe, control the cost of, and design systems around AI features'] },
  { id: 'cloud-engineering', title: 'Cloud Engineering', intro: 'Run an app as a real production service.', learn: ['Choose Azure, AWS or Google Cloud and set up identity and networking safely', 'Deploy a container, keep the database private, and manage secrets', 'Add monitoring, backups, budget alerts and a recovery plan'] },
  { id: 'security', title: 'Security', intro: 'Attack and defend an AI app, on your own copy.', learn: ['Model the threats to an AI system and rank them by risk', 'Stop prompt injection, protect retrieved documents, and limit what agents can do', 'Protect privacy, check your supply chain, and plan an incident response'] },
  { id: 'projects', title: 'Projects', intro: 'Finished work you can show an employer or a client.', learn: ['Automate a real chore with Python, or analyze a public dataset with a clear chart', 'Ship a chatbot people can use, with a web page, limits and a container', 'Evaluate an AI system, or deliver something for a real client, from scope to case study'] },
]

const isList = ['Clear explanations of the idea, in plain language', 'Practice you can run in your browser, with no setup', 'Projects that become evidence you can show someone']
const isNotList = ['A replacement for teachers, schools or a study group', 'A promise of a job, a certificate or a salary', 'A finished course. The site grows in public, and feedback shapes it']

const linkClass = 'font-bold text-teal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold'
const ctaClass = 'inline-flex items-center font-bold text-teal hover:text-gold'

export function AboutPage() {
  return <><SeoMetadata title="About Tinted Learning" description="Tinted Learning is a free place to learn AI, from plain-language lessons to browser practice and portfolio projects." /><main className="min-h-[calc(100vh-5rem)] bg-cream text-center">

    <header className="shell max-w-4xl pb-12 pt-16 sm:pt-24">
      <p className="eyebrow text-teal">About Tinted Learning</p>
      <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">A free place to learn AI, from the first idea to a project you can show.</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink">Tinted Learning is a free website that teaches AI and the skills behind it. You can read, practice and build without an account, a degree or special software.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-6">
        <Link to="/learn/what-is-ai" className={ctaClass}>Start the 5-minute AI lesson <ArrowRight size={17} className="ml-2" /></Link>
        <Link to="/learn" className={ctaClass}>Browse all sections <ArrowRight size={17} className="ml-2" /></Link>
      </div>
    </header>

    <section className="bg-mist">
      <div className="shell max-w-5xl py-16 sm:py-20">
        <p className="eyebrow text-teal">How it works</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-teal sm:text-4xl">Learn, practice, then build</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <li key={item.step} className="flex flex-col items-center rounded-3xl border border-line bg-white p-7 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal font-display text-base font-bold text-white">{item.step}</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-teal">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-ink">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="shell max-w-5xl py-16 sm:py-20">
      <p className="eyebrow text-teal">What is on the site</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-teal sm:text-4xl">Sections you can start in any order</h2>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink">Each section stands on its own. Start with Foundations if AI is new to you, or go straight to the section for the work you want to do.</p>
      <ul className="mt-10 grid gap-4 text-left sm:grid-cols-2">
        {sections.map((section) => (
          <li key={section.id} className="flex flex-col rounded-2xl border border-line bg-white p-6">
            <Link to={`/learn/sections/${section.id}`} className="font-display text-2xl font-bold text-teal hover:text-gold">{section.title}</Link>
            <p className="mt-2 text-sm leading-6 text-ink">{section.intro}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted">You will learn</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-ink">{section.learn.map((item) => <li key={item}>{item}</li>)}</ul>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-base leading-7 text-ink">Also on the site: browser playgrounds for <Link to="/playground" className={linkClass}>Python, tokens, context windows, temperature, prompts, embeddings and agents</Link>, and a <Link to="/learn/sections/certifications" className={linkClass}>guide to recognized certifications</Link>.</p>
    </section>

    <section className="bg-mist">
      <div className="shell max-w-4xl py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">A note from the founder</p>
        <blockquote className="mx-auto mt-8 max-w-3xl space-y-6 text-lg leading-8 text-ink">
          {founderNote.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </blockquote>
        <p className="mt-10">
          <span className="block font-display text-3xl font-bold text-teal">Jay</span>
          <span className="mt-1 block text-sm leading-6 text-ink">Founder, Tinted Learning, a project of <a href="https://tintedtechnologies.com" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">Tinted Technologies</a></span>
        </p>
      </div>
    </section>

    <section className="shell grid max-w-4xl gap-12 py-16 sm:grid-cols-2 sm:py-20">
      <div>
        <h2 className="font-display text-3xl font-bold text-teal">What it is</h2>
        <ul className="mt-6 space-y-4">{isList.map((item) => <li key={item} className="border-t border-line pt-4 text-base leading-7 text-ink">{item}</li>)}</ul>
      </div>
      <div>
        <h2 className="font-display text-3xl font-bold text-teal">What it is not</h2>
        <ul className="mt-6 space-y-4">{isNotList.map((item) => <li key={item} className="border-t border-line pt-4 text-base leading-7 text-ink">{item}</li>)}</ul>
      </div>
    </section>

    <section className="shell max-w-3xl pb-16">
      <p className="eyebrow text-teal">Why it matters</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-teal sm:text-4xl">Not everyone gets a computer science class.</h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink">Many schools never offered computing, and many learners have no technical network to ask. The data on who has access, and what the gap looks like, is on the <Link to="/why-this-matters" className={linkClass}>Why this matters</Link> page, with a link to every source.</p>
    </section>

    <section className="shell max-w-4xl border-t border-line py-14 text-center">
      <p className="text-lg leading-8 text-ink">Learn the idea, practice the skill, and build something real.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <Link to="/learn/what-is-ai" className={ctaClass}>Start the 5-minute AI lesson <ArrowRight size={17} className="ml-2" /></Link>
        <Link to="/playground/python" className={ctaClass}>Try Python <ArrowRight size={17} className="ml-2" /></Link>
        <a href="https://www.instagram.com/tintedtechnologies" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">Instagram: @tintedtechnologies</a>
      </div>
    </section>
  </main></>
}
