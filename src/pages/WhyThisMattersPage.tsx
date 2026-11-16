import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const facts = [
  {
    title: 'PISA 2025 measured computational problem-solving',
    body: 'The OECD published PISA 2025 results on 8 September 2026. The assessment covered about 760,000 15-year-olds in 91 countries and economies, and it added a new domain: computational problem-solving, which includes modelling, programming tools, experiments and digital-product design.',
    source: 'OECD, PISA 2025 Results (Volume I)',
    url: 'https://www.oecd.org/en/publications/2026/09/pisa-2025-results-volume-i_5265bfb1.html',
  },
  {
    title: 'The highest scores were in East Asia and Singapore',
    body: 'In computational problem-solving, the top systems were Macao (China) at 572 points, Singapore at 563, Beijing, Shanghai, Jiangsu and Zhejiang (China) at 560, and Japan at 557. The OECD average was 500.',
    source: 'OECD, PISA 2025 Results (Volume I)',
    url: 'https://www.oecd.org/en/publications/2026/09/pisa-2025-results-volume-i_5265bfb1.html',
  },
  {
    title: 'Access to AI-literacy learning follows family advantage',
    body: 'The OECD reports that school opportunities to build AI literacy are more common among socio-economically advantaged students. This is an association the report describes as a pattern, not as proof of cause.',
    source: 'OECD, PISA 2025 Results (Volume I)',
    url: 'https://www.oecd.org/en/publications/2026/09/pisa-2025-results-volume-i_5265bfb1.html',
  },
  {
    title: 'Technology helps only with the right conditions',
    body: 'UNESCO\'s 2023 Global Education Monitoring Report, Technology in Education: A tool on whose terms?, finds that technology can support access, equity, inclusion and quality. It does so when systems also provide access, governance and teacher preparation.',
    source: 'UNESCO, Global Education Monitoring Report 2023',
    url: 'https://www.unesco.org/gem-report/en/technology',
  },
]

export function WhyThisMattersPage() {
  return <><SeoMetadata title="Why this matters" description="The OECD and UNESCO evidence behind Tinted Learning, with links to each source." /><main className="shell max-w-3xl py-12 sm:py-16">
    <p className="eyebrow">Why this matters</p>
    <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-teal sm:text-5xl">What the evidence says</h1>
    <p className="mt-5 text-lg leading-8 text-muted">Each figure below links to the report it comes from. The OECD results are correlational, so they describe patterns rather than causes.</p>
    <div className="mt-10 space-y-6">
      {facts.map((fact) => <section key={fact.title} className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-teal">{fact.title}</h2>
        <p className="mt-3 text-base leading-7 text-muted">{fact.body}</p>
        <a href={fact.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center text-sm font-bold text-teal hover:text-gold">{fact.source}<ExternalLink size={15} className="ml-2" /></a>
      </section>)}
    </div>
    <div className="mt-10"><Link to="/about" className="text-sm font-bold text-muted hover:text-teal">Back to About</Link></div>
  </main></>
}
