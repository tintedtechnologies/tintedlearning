import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const courseAccess = [
  {
    figure: 'Fewer than half',
    text: 'of Black high school students attend a school that offers a full range of math, science and computer science courses.',
    source: 'Civil Rights Data Collection, 2020-21, reported by K-12 Dive',
    url: 'https://www.k12dive.com/news/black-latino-access-stem-courses-civil-rights-data-collection/716794/',
  },
  {
    figure: '32%',
    text: 'of high schools where Black and Latino students make up more than three-quarters of enrollment offer calculus. Schools with fewer of those students are 18 percentage points more likely to offer it.',
    source: 'Civil Rights Data Collection, 2023-24, analyzed by Gopalan and Frankenberg',
    url: 'https://www.advancedequity.org/briefs/a-second-look-202324crdc',
  },
  {
    figure: '51% and 45%',
    text: 'of all U.S. high schools offered computer science and calculus, respectively, in 2023-24. Nearly half of high schools did not offer computer science.',
    source: 'Civil Rights Data Collection, 2023-24, analyzed by Gopalan and Frankenberg',
    url: 'https://www.advancedequity.org/briefs/a-second-look-202324crdc',
  },
]

const resourceAccess = [
  {
    figure: '25%',
    text: 'of Black teens say they are at least sometimes unable to finish homework because they lack a reliable computer or internet connection. Across all teens, the figure is 17%. This survey is from 2018, so it shows the pattern, not today\'s level.',
    source: 'Pew Research Center, 2018 survey of 743 teens',
    url: 'https://www.pewresearch.org/fact-tank/2018/10/26/nearly-one-in-five-teens-cant-always-finish-their-homework-because-of-the-digital-divide/',
  },
  {
    figure: 'About 1 in 5',
    text: 'teens in households earning under $30,000 a year do all or most of their schoolwork with chatbots\' help. In higher-income households, the figure is 7%.',
    source: 'Pew Research Center, February 2026, survey of 1,458 teens',
    url: 'https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/',
  },
  {
    figure: 'About 6 in 10',
    text: 'Black or Hispanic teens say they have used chatbots for schoolwork help. About half of White teens say the same.',
    source: 'Pew Research Center, February 2026',
    url: 'https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/',
  },
]

const sources = [
  {
    text: 'Gopalan and Frankenberg, "A Second Look at the 2023-24 Civil Rights Data Collection," AdvancED Equity',
    url: 'https://www.advancedequity.org/briefs/a-second-look-202324crdc',
  },
  {
    text: 'K-12 Dive, "Black and Latino access to certain STEM courses still inequitable," on the 2020-21 Civil Rights Data Collection',
    url: 'https://www.k12dive.com/news/black-latino-access-stem-courses-civil-rights-data-collection/716794/',
  },
  {
    text: 'Pew Research Center, "Nearly one-in-five teens can\'t always finish their homework because of the digital divide," October 2018',
    url: 'https://www.pewresearch.org/fact-tank/2018/10/26/nearly-one-in-five-teens-cant-always-finish-their-homework-because-of-the-digital-divide/',
  },
  {
    text: 'Pew Research Center, "How Teens Use and View AI," February 2026',
    url: 'https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/',
  },
  {
    text: 'National Center for Education Statistics, Digest of Education Statistics, Table 702.12 (home internet access, ages 3 to 18, 2023)',
    url: 'https://nces.ed.gov/programs/digest/d24/tables/dt24_702.12.asp',
  },
]

const linkClass = 'font-bold text-teal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold'

function EvidenceRow({ figure, text, source, url }: { figure: string; text: string; source: string; url: string }) {
  return (
    <li className="grid gap-3 border-t border-line pt-6 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-8">
      <p className="font-display text-3xl font-bold leading-tight text-teal">{figure}</p>
      <div>
        <p className="text-base leading-7 text-ink">{text}</p>
        <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center text-sm font-bold text-teal hover:text-gold">{source}<ExternalLink size={15} className="ml-2" /></a>
      </div>
    </li>
  )
}

export function WhyThisMattersPage() {
  return <><SeoMetadata title="Why this matters" description="For Black students and students without the resources to learn computing, the gap starts in school. The sourced evidence, with links to each study." /><main className="shell max-w-4xl py-12 sm:py-16">
    <p className="eyebrow">Why this matters</p>
    <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-teal sm:text-5xl">The gap starts in high school, and it falls hardest on Black students and students without resources.</h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-ink">A student who never gets a computer science or calculus class has fewer ways into AI and computing later. Each figure below links to the study it comes from.</p>

    <section className="mt-14">
      <h2 className="font-display text-3xl font-bold text-teal">Black students have less access to the courses that lead to computing</h2>
      <ul className="mt-8 space-y-6">
        {courseAccess.map((item) => <EvidenceRow key={item.figure} {...item} />)}
      </ul>
    </section>

    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold text-teal">Students without resources have less time and fewer tools</h2>
      <ul className="mt-8 space-y-6">
        {resourceAccess.map((item) => <EvidenceRow key={item.figure} {...item} />)}
      </ul>
    </section>

    <section className="mt-16 rounded-3xl bg-mist p-6 sm:p-10">
      <h2 className="font-display text-3xl font-bold text-teal">What the data does not show</h2>
      <p className="mt-5 text-base leading-7 text-ink">Home internet is now almost universal for school-age children. The National Center for Education Statistics reports that 97.2% of Black children ages 3 to 18 had home internet in 2023, compared with 97.9% of White children. The gap that remains is less about whether a home is connected and more about which courses a school offers and what a student can do with the tools they have.</p>
      <p className="mt-5 text-base leading-7 text-ink">These are surveys and school counts. They show patterns and associations. They do not prove what caused them.</p>
      <p className="mt-8 text-base leading-7 text-ink">Tinted Learning is built around that gap. Lessons explain ideas in plain language, practice runs in your browser with no setup, and projects give you something to show. If your school did not offer the course, this is one place to start.</p>
    </section>

    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold text-teal">Sources</h2>
      <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-7 text-ink">
        {sources.map((source) => (
          <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className={linkClass}>{source.text}</a></li>
        ))}
      </ol>
    </section>

    <div className="mt-12"><Link to="/about" className="text-sm font-bold text-teal hover:text-gold">Back to About</Link></div>
  </main></>
}
