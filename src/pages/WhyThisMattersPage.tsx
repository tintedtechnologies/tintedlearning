import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const teacherAccess = [
  {
    figure: '27% vs 11% (fall 2023)',
    text: 'of school districts had given teachers AI training by fall 2023. The first number is for districts serving mostly White students. The second is for districts serving mostly students of color. The figure counts districts that offered training, not how many teachers attended.',
    source: 'RAND, The State of Public Education in 2024',
    url: 'https://www.rand.org/pubs/commentary/2024/08/five-charts-that-tell-us-about-the-state-of-public.html',
  },
]

const courseAccess = [
  {
    figure: 'Fewer than half (2020-21)',
    text: 'of Black high school students attend a school that offers a full range of math, science and computer science courses.',
    source: 'Civil Rights Data Collection, 2020-21, reported by K-12 Dive',
    url: 'https://www.k12dive.com/news/black-latino-access-stem-courses-civil-rights-data-collection/716794/',
  },
  {
    figure: '32% (2023-24)',
    text: 'of high schools where Black and Latino students make up more than three-quarters of enrollment offer calculus. Schools with fewer of those students are 18 percentage points more likely to offer it.',
    source: 'U.S. Department of Education, Office for Civil Rights, 2023-24 Civil Rights Data Collection, analyzed by Gopalan and Frankenberg',
    url: 'https://www.advancedequity.org/briefs/a-second-look-202324crdc',
  },
  {
    figure: '51% and 45% (2023-24)',
    text: 'of all U.S. high schools offered computer science and calculus, respectively, in 2023-24. Nearly half of high schools did not offer computer science.',
    source: 'U.S. Department of Education, Office for Civil Rights, 2023-24 Civil Rights Data Collection, analyzed by Gopalan and Frankenberg',
    url: 'https://www.advancedequity.org/briefs/a-second-look-202324crdc',
  },
]

const resourceAccess = [
  {
    figure: '25% (2018)',
    text: 'of Black teens say they are at least sometimes unable to finish homework because they lack a reliable computer or internet connection. Across all teens, the figure is 17%. This survey is from 2018, so it shows the pattern, not today\'s level.',
    source: 'Pew Research Center, 2018 survey of 743 teens',
    url: 'https://www.pewresearch.org/fact-tank/2018/10/26/nearly-one-in-five-teens-cant-always-finish-their-homework-because-of-the-digital-divide/',
  },
  {
    figure: 'About 1 in 5 (2026)',
    text: 'Among teens who use chatbots, about 1 in 5 in households under $30,000 do all or most of their schoolwork with them, compared with 7% in households over $75,000.',
    source: 'Pew Research Center, 2026 survey of 1,458 teens ages 13 to 17, conducted September 25 to October 9, 2025',
    url: 'https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/',
  },
  {
    figure: 'About 6 in 10 (2026)',
    text: 'Black or Hispanic teens have used chatbots for help with schoolwork. This counts any use, not only doing all or most of the work, and it covers Black and Hispanic teens together.',
    source: 'Pew Research Center, 2026',
    url: 'https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/',
  },
]

const sources = [
  {
    text: 'RAND, "The State of Public Education in 2024 in Five Charts"',
    url: 'https://www.rand.org/pubs/commentary/2024/08/five-charts-that-tell-us-about-the-state-of-public.html',
  },
  {
    text: 'Gopalan and Frankenberg, "A Second Look at the 2023-24 Civil Rights Data Collection," AdvancED Equity (analysis of the federal data)',
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
    <li className="flex flex-col items-center gap-3 border-t border-line pt-6 text-center">
      <p className="font-display text-3xl font-bold leading-tight text-teal">{figure}</p>
      <p className="mx-auto max-w-2xl text-base leading-7 text-ink">{text}</p>
      <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-teal hover:text-gold">{source}<ExternalLink size={15} className="ml-2" /></a>
    </li>
  )
}

export function WhyThisMattersPage() {
  return <><SeoMetadata title="Why this matters" description="For Black students and students without the resources to learn computing, the gap starts in school. The sourced evidence, with links to each study." /><main className="shell max-w-4xl py-12 text-center sm:py-16">
    <p className="eyebrow">Why this matters</p>
    <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-teal sm:text-5xl">The gap starts in high school, and it falls hardest on some students, including Black students and students without resources.</h1>
    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink">A student who never gets a computer science or calculus class has fewer ways into AI and computing later. Each figure below links to the study it comes from.</p>

    <section className="mt-14">
      <h2 className="font-display text-3xl font-bold text-teal">Teachers are part of the gap too</h2>
      <ul className="mt-8 space-y-6">
        {teacherAccess.map((item) => <EvidenceRow key={item.figure} {...item} />)}
      </ul>
    </section>

    <section className="mt-16">
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
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink">Home internet is now almost universal for school-age children. The National Center for Education Statistics reports that 97.2% of Black children ages 3 to 18 had home internet in 2023, compared with 97.9% of White children. The gap that remains is less about whether a home is connected and more about which courses a school offers and what a student can do with the tools they have.</p>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink">These are surveys and school counts. They show patterns and associations. They do not prove what caused them.</p>
      <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-ink">Tinted Learning is built around that gap. Lessons explain ideas in plain language, practice runs in your browser with no setup, and projects give you something to show. If your school did not offer the course, this is one place to start.</p>
    </section>

    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold text-teal">Sources</h2>
      <ol className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-7 text-ink">
        {sources.map((source) => (
          <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className={linkClass}>{source.text}</a></li>
        ))}
      </ol>
    </section>

    <div className="mt-12"><Link to="/about" className="text-sm font-bold text-teal hover:text-gold">Back to About</Link></div>
  </main></>
}
