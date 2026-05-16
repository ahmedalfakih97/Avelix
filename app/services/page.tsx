import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceCard from '@/components/shared/ServiceCard'
import ContactForm from '@/components/pages/ContactForm'

export const metadata: Metadata = {
  title: 'AI Automation Services — Avelix',
  description: 'From AI workflow automation to custom AI agents — we design, build, and deploy AI solutions for businesses in Saudi Arabia, UAE, and beyond.',
  openGraph: {
    title: 'AI Automation Services — Avelix',
    description: 'Skip the learning curve. We build AI workflows, agents, and automation systems for your business.',
    type: 'website',
  },
  alternates: { canonical: '/services' },
}

const SERVICES = [
  {
    index: 1,
    title: 'AI Workflow Consultation',
    icon: 'hub',
    description: 'Map your business processes and identify where AI creates the highest leverage. We audit your operations and deliver a clear AI adoption roadmap.',
    who_its_for: 'Business owners & operations leaders',
    slug: 'ai-workflow-consultation',
  },
  {
    index: 2,
    title: 'AI Tool Selection & Strategy',
    icon: 'search',
    description: 'Stop guessing which tools to use. We audit your existing stack and recommend the exact AI toolkit that fits your workflow, budget, and team.',
    who_its_for: 'Teams overwhelmed by tool options',
    slug: 'ai-tool-selection',
  },
  {
    index: 3,
    title: 'n8n Workflow Development',
    icon: 'webhook',
    description: 'We design and deploy production-grade n8n automations that connect your apps, trigger on events, and run 24/7 without manual intervention.',
    who_its_for: 'Ops teams & founders who need real automation',
    slug: 'n8n-workflow-development',
  },
  {
    index: 4,
    title: 'UGC Content Automation System',
    icon: 'movie',
    description: 'Build an end-to-end pipeline that sources, scripts, generates, and publishes AI-powered user-generated content at scale.',
    who_its_for: 'Marketing teams & content creators',
    slug: 'ugc-content-automation',
  },
  {
    index: 5,
    title: 'AI Content Automation',
    icon: 'edit_note',
    description: 'Automate your entire content pipeline — from research and drafting to SEO optimization and publishing — using AI + workflow tools.',
    who_its_for: 'Content teams, agencies, solo creators',
    slug: 'ai-content-automation',
  },
  {
    index: 6,
    title: 'AI Customer Support Agent',
    icon: 'support_agent',
    description: 'Deploy a custom AI agent trained on your product docs, FAQs, and policies that handles support tickets and escalates when needed.',
    who_its_for: 'E-commerce, SaaS, and service businesses',
    slug: 'ai-customer-support',
  },
  {
    index: 7,
    title: 'AI Sales Assistant',
    icon: 'trending_up',
    description: 'Build an AI-powered lead qualification, follow-up, and proposal system that works while you sleep and closes faster.',
    who_its_for: 'Sales teams & founders closing deals',
    slug: 'ai-sales-assistant',
  },
  {
    index: 8,
    title: 'AI Research Automation',
    icon: 'query_stats',
    description: 'Replace hours of manual research with AI pipelines that gather, summarize, and format intelligence from any source, on schedule.',
    who_its_for: 'Analysts, consultants, researchers',
    slug: 'ai-research-automation',
  },
  {
    index: 9,
    title: 'AI Reporting & Analytics Automation',
    icon: 'monitoring',
    description: 'Automate your weekly/monthly reports — pull data, run analysis, generate summaries, and deliver to stakeholders without manual work.',
    who_its_for: 'Operations & data teams',
    slug: 'ai-reporting-automation',
  },
  {
    index: 10,
    title: 'AI Chatbot / Agent Setup',
    icon: 'smart_toy',
    description: 'We build, configure, and launch AI chatbots or agents on your website, WhatsApp, or internal tools — customized for your specific use case.',
    who_its_for: 'Any business needing conversational AI',
    slug: 'ai-chatbot-setup',
  },
  {
    index: 11,
    title: 'MCP & Tool Integration',
    icon: 'settings_input_component',
    description: 'Extend your AI agents with Model Context Protocol — connecting them to external tools, APIs, databases, and custom data sources.',
    who_its_for: 'Developers & teams building AI products',
    slug: 'mcp-tool-integration',
  },
  {
    index: 12,
    title: 'Business Process Automation',
    icon: 'account_tree',
    description: 'Eliminate the repetitive manual tasks draining your team. We map, design, and automate your core business processes end-to-end.',
    who_its_for: 'Operations-heavy teams at any stage',
    slug: 'business-process-automation',
  },
  {
    index: 13,
    title: 'Custom AI Solution Design',
    icon: 'architecture',
    description: 'Have a unique challenge that doesn\'t fit standard solutions? We design custom AI systems tailored to your specific use case from scratch.',
    who_its_for: 'Founders & enterprises with unique problems',
    slug: 'custom-ai-solution',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Discovery Call', description: 'Free 30-minute call. We learn your business, your pain points, and where AI creates the most value.', icon: 'call' },
  { step: '02', title: 'Strategy & Selection', description: 'We deliver a tailored AI roadmap — exact tools, workflows, and approach for your specific situation.', icon: 'route' },
  { step: '03', title: 'Build & Test', description: 'We build, configure, and test your AI solution with real data before handing it over.', icon: 'code' },
  { step: '04', title: 'Deploy & Train', description: 'We deploy to production and train your team so you can run it confidently on your own.', icon: 'rocket_launch' },
]

const WHO_ITS_FOR = [
  { type: 'Business Owners', goal: 'Save time on manual tasks and scale operations without hiring', icon: 'business' },
  { type: 'Marketing Teams', goal: 'Automate content pipelines and execute campaigns faster', icon: 'campaign' },
  { type: 'Operations Teams', goal: 'Streamline repetitive workflows and eliminate manual errors', icon: 'account_tree' },
  { type: 'Founders', goal: 'Build AI-powered products faster without a dedicated AI team', icon: 'rocket_launch' },
]

const PROBLEM_SOLUTIONS = [
  {
    problem: '"I don\'t know which AI tools are right for my business"',
    solution: 'We audit your workflow and recommend the exact tool stack — no guessing, no waste.',
  },
  {
    problem: '"I tried n8n but got stuck after the second node"',
    solution: 'We build and deploy the full workflow for you, then hand it over with documentation.',
  },
  {
    problem: '"I want to automate my customer support but don\'t know where to start"',
    solution: 'We build a custom AI agent trained on your data that handles tickets from day one.',
  },
  {
    problem: '"My team spends hours on reports that could be automated"',
    solution: 'We build a pipeline that generates, formats, and delivers your reports automatically.',
  },
]

function SectionLabel({ children }: { children: string }) {
  return <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-terminal-border px-4 py-16 bg-surface-container-lowest grid-bg">
          <div className="signal-scan" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-block border border-primary px-2 py-0.5 mb-6">
              <span className="font-mono text-label-caps text-primary uppercase">[SERVICE_CATALOG]</span>
            </div>
            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-6">
              Skip the Learning Curve.{' '}
              <span className="text-electric-teal">We Build It For You.</span>
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-8 max-w-lg">
              From AI workflow automation to custom AI agents — we design, build, and deploy AI solutions for your business. Trusted by teams in Saudi Arabia, UAE, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden"
              >
                <span className="relative z-10">Book a Free Strategy Call</span>
                <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                  Book a Free Strategy Call
                </span>
              </a>
              <a
                href="#services"
                className="bg-transparent border border-terminal-border text-on-surface font-mono text-[11px] py-3 px-6 uppercase hover:border-primary transition-all text-center"
              >
                See All Services
              </a>
            </div>
          </div>
          <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
            <span className="material-symbols-outlined text-[280px] text-primary">hub</span>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="px-4 py-16 border-b border-terminal-border">
          <SectionLabel>[SERVICE_CATALOG]</SectionLabel>
          <h2 className="font-headline text-headline-md text-on-surface uppercase mb-2">What We Build</h2>
          <p className="font-body text-body-sm text-on-surface-variant mb-8 max-w-lg">
            13 specialized AI services. Pick one or combine them into a full AI transformation stack.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16 border-b border-terminal-border bg-surface-container-lowest">
          <SectionLabel>[PROTOCOL]</SectionLabel>
          <h2 className="font-headline text-headline-md text-on-surface uppercase mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-terminal-border border border-terminal-border">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col p-6 bg-surface-container-lowest">
                <span className="font-mono text-[9px] text-primary uppercase mb-4">{step.step}</span>
                <span className="material-symbols-outlined text-primary text-2xl mb-4">{step.icon}</span>
                <h3 className="font-headline text-on-surface uppercase text-[14px] font-bold mb-2">{step.title}</h3>
                <p className="font-body text-body-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who It's For */}
        <section className="px-4 py-16 border-b border-terminal-border">
          <SectionLabel>[WHO_ITS_FOR]</SectionLabel>
          <h2 className="font-headline text-headline-md text-on-surface uppercase mb-8">Who This Is For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
            {WHO_ITS_FOR.map((item) => (
              <div key={item.type} className="flex items-start gap-4 p-6 bg-electromagnetic-ink">
                <div className="w-10 h-10 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline text-on-surface uppercase text-[13px] font-bold mb-1">{item.type}</h3>
                  <p className="font-body text-body-sm text-on-surface-variant">{item.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Problems We Solve */}
        <section className="px-4 py-16 border-b border-terminal-border bg-surface-container-lowest">
          <SectionLabel>[COMMON_PROBLEMS]</SectionLabel>
          <h2 className="font-headline text-headline-md text-on-surface uppercase mb-8">Problems We Solve</h2>
          <div className="flex flex-col gap-4">
            {PROBLEM_SOLUTIONS.map((item, i) => (
              <div key={i} className={`border-l-2 pl-5 py-3 ${i === 0 ? 'border-primary' : 'border-terminal-border hover:border-primary transition-colors'}`}>
                <span className="font-mono text-[9px] text-data-dim uppercase block mb-2">
                  {String(i + 1).padStart(2, '0')} // PROBLEM
                </span>
                <p className="font-body text-body-sm text-on-surface mb-2 italic">{item.problem}</p>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm flex-shrink-0 mt-0.5">arrow_forward</span>
                  <p className="font-body text-body-sm text-on-surface-variant">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="px-4 py-16">
          <div className="max-w-xl">
            <SectionLabel>[INITIATE_CONTACT]</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase mb-2">Book a Free Strategy Call</h2>
            <p className="font-body text-body-sm text-on-surface-variant mb-8">
              Tell us about your business and what you want to automate. We respond within 24 hours.
            </p>
            <ContactForm />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
