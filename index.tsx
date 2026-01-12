'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Link from 'next/link';
import DottedGlowBackground from './components/DottedGlowBackground';
import OrganicOrbLogo from './components/OrganicOrbLogo';
import { 
    MenuIcon,
    XIcon
} from './components/Icons';

const WHATSAPP_NUMBER = "+254755792377";
const BASE_URL = "https://veirahq.com";

const COMPETITORS = [
  { id: "chatgpt", name: "ChatGPT", type: "LLM" },
  { id: "claude", name: "Claude", type: "LLM" },
  { id: "gemini", name: "Gemini", type: "LLM" },
  { id: "perplexity", name: "Perplexity", type: "Search AI" },
  { id: "copilot", name: "Copilot", type: "Enterprise LLM" },
  { id: "grok", name: "Grok", type: "Social AI" },
  { id: "intercom-ai", name: "Intercom AI", type: "Customer Support Platform" },
  { id: "zendesk-ai", name: "Zendesk AI", type: "Helpdesk" },
  { id: "hubspot-ai", name: "HubSpot AI", type: "CRM" },
  { id: "drift", name: "Drift", type: "Conversational Marketing" },
  { id: "freshchat", name: "Freshchat", type: "Messaging Software" },
  { id: "meta-ai", name: "Meta AI", type: "Consumer AI" }
];

const USE_CASES = [
  { id: "whatsapp-business", label: "WhatsApp Business" },
  { id: "sales-teams", label: "Sales Teams" },
  { id: "customer-support", label: "Customer Support" },
  { id: "operations", label: "Business Operations" },
  { id: "smes", label: "SMEs" },
  { id: "enterprises", label: "Enterprises" },
  { id: "lead-qualification", label: "Lead Qualification" },
  { id: "invoicing", label: "Invoicing & Billing" },
  { id: "payments", label: "Payment Collection" },
  { id: "internal-teams", label: "Internal Team Ops" }
];

const AGENTS_CONTENT = {
  hero: {
    headline: "AI Assistants That Help Run Your Business",
    subheadline: "Veira agents help you reply to customers, follow up on leads, send invoices and handle daily business tasks automatically.",
    primaryCTA: "Talk to Us",
    secondaryCTA: "Book a Demo"
  },
  agents: {
    list: [
      {
        name: "Glenn",
        role: "Customer Support Assistant",
        description: "Glenn helps with customer support and follow ups. He answers customer questions on WhatsApp and phone calls, checks ticket status, sends follow up messages."
      },
      {
        name: "Svan",
        role: "Sales Assistant",
        description: "Svan helps you convert leads into customers. She replies to new enquiries, answers questions, qualifies leads, and books appointments."
      },
      {
        name: "Tat",
        role: "Operations Assistant",
        description: "Tat helps with daily business operations. She sends invoices, runs reports, checks stock levels, and approves payments."
      }
    ]
  }
};

const CLOUD_CONTENT = {
  opening: {
    headline: "Most Business Stress Comes From Not Knowing",
    body: "Not knowing how sales are doing today. Not knowing if something was missed. Veira Cloud exists to remove that uncertainty."
  },
  whatActuallyHappens: {
    items: [
      "Collects sales from your POS without reminders",
      "Keeps customer and payment records in one place",
      "Stores activity from AI assistants automatically",
      "Turns daily chaos into a clear picture"
    ]
  }
};

const APPS_CONTENT = {
  hero: {
    headline: "Software Should Feel Obvious",
    body: "The best apps do not need instructions. They respond instantly. They look calm. They feel inevitable. Veira builds apps that work the way people expect."
  }
};

const STORY_CONTENT = {
  story: {
    opening: {
      headline: "Why Veira Exists",
      body: "Veira was created for businesses that want technology to feel simple, dependable, and quietly effective. Software should reduce stress, not introduce it."
    },
    profitWithPurpose: {
      headline: "Profit With Responsibility",
      body: "Veira allocates ten percent of its annual net profit to fighting gender based violence and supporting survivors. This is a standing commitment."
    }
  }
};

const USE_CASES_PAGE_CONTENT = {
  hero: {
    headline: "Built For How Work Actually Happens",
    body: "Every business looks different on the surface. But behind the scenes, the problems are often the same. Veira is designed to simplify what happens every day."
  },
  useCases: [
    { name: "Restaurants and Cafes", body: "Orders move quickly. Payments are processed without friction. Sales are recorded automatically." },
    { name: "Retail Shops", body: "Every sale updates stock in real time. Customer purchases are tracked without manual work." },
    { name: "Law Firms", body: "Billing, invoicing and payments stay structured. Client activity is recorded clearly." }
  ]
};

const PRICING_CONTENT = {
  hero: {
    headline: "Simple, Transparent Pricing.",
    body: "We believe infrastructure should be accessible. No hidden fees, just value-driven tiers for every stage of growth."
  },
  tiers: [
    { name: "Starter", price: "Free", description: "Essential POS and cloud features.", features: ["Basic POS", "Real-time Sales", "Cloud Dashboard", "WhatsApp Support"] },
    { name: "Professional", price: "Contact Us", description: "Advanced automation for scale.", features: ["AI Agent Integration", "Custom Workflows", "Priority Support", "eTIMS Compliance"] },
    { name: "Enterprise", price: "Contact Us", description: "Full business infrastructure.", features: ["Multi-outlet Sync", "Custom App Dev", "Dedicated Account Manager", "White-label Options"] }
  ]
};

const FAQ_CONTENT = {
  hero: {
    headline: "Frequently Asked Questions",
    body: "Everything you need to know about our platform and how it helps your business grow."
  },
  items: [
    { q: "Is the POS really free?", a: "Yes, our starter tier POS is free to use forever. We grow with you as you need more advanced features." },
    { q: "Do AI Agents work on WhatsApp?", a: "Absolutely. Our agents are natively built to handle conversations, bookings, and inquiries directly on WhatsApp." },
    { q: "Can I use Veira with M-PESA?", a: "Yes, we support automated M-PESA payment verification and reconciliation across all our tiers." }
  ]
};

const CONTACT_PAGE_CONTENT = {
  hero: {
    headline: "Let's Talk About Your Business.",
    body: "We prefer conversations over forms. Reach out via WhatsApp or email, and we'll help you find the right systems for your operations."
  },
  channels: [
    { name: "WhatsApp", value: "+254 755 792 377", actionLabel: "Chat Now", link: `https://wa.me/254755792377` },
    { name: "Email", value: "hello@veirahq.com", actionLabel: "Send Email", link: "mailto:hello@veirahq.com" }
  ]
};

type RouteKey = 'home' | 'pos' | 'agents' | 'cloud' | 'apps' | 'useCases' | 'ourStory' | 'talkToUs' | 'pricing' | 'faq';

const ROUTES: Record<RouteKey, { label: string; path: string }> = {
  home: { label: 'Veira', path: '/' },
  pos: { label: 'POS', path: '/pos' },
  agents: { label: 'Agents', path: '/agents' },
  cloud: { label: 'Cloud', path: '/cloud' },
  apps: { label: 'Apps', path: '/apps' },
  useCases: { label: 'Use Cases', path: '/use-cases' },
  ourStory: { label: 'Our Story', path: '/our-story' },
  talkToUs: { label: 'Talk to Us', path: '/talk-to-us' },
  pricing: { label: 'Pricing', path: '/pricing' },
  faq: { label: 'FAQ', path: '/faq' }
};

const HEADER_KEYS: RouteKey[] = ['pos', 'agents', 'cloud', 'apps', 'pricing', 'faq', 'talkToUs'];
const FOOTER_KEYS: RouteKey[] = ['pos', 'agents', 'cloud', 'apps', 'useCases', 'ourStory', 'pricing', 'faq'];

export default function App({ initialRoute = 'home', initialCompareSlug = null }: { initialRoute?: RouteKey, initialCompareSlug?: string | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active states for comparison UI based on URL slug if present
  const activeCompId = initialCompareSlug ? initialCompareSlug.split('-vs-')[0] : "chatgpt";
  const activeContextId = "whatsapp-business";

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Veira, I'm interested in your business solutions.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  };

  const activeCompareData = useMemo(() => {
    const comp = COMPETITORS.find(c => c.id === activeCompId) || COMPETITORS[0];
    const context = USE_CASES.find(ctx => ctx.id === activeContextId) || USE_CASES[0];
    
    return { 
        comp, 
        context, 
        strategicCapabilities: [
          { name: "WhatsApp-native Automation", a: true, b: false },
          { name: "Voice AI Call Handling", a: true, b: false },
          { name: "M-PESA Payment Verification", a: true, b: false },
          { name: "KRA eTIMS Compliance Sync", a: true, b: false }
        ]
    };
  }, [activeCompId, activeContextId]);

  const renderComparisonView = () => (
    <div className="comparison-page reveal">
      <section className="saas-hero">
        <h1>Veira vs {activeCompareData.comp.name}</h1>
        <p className="hero-supporting">The ultimate comparison for {activeCompareData.context.label}. Choose the solution that executes real work.</p>
      </section>
      <section className="comparison-controls">
          <div className="control-group">
              <label>Select Competitor:</label>
              <div className="control-pills">
                  {COMPETITORS.slice(0, 8).map(c => (
                      <Link key={c.id} href={`/compare/${c.id}-vs-veira-for-whatsapp-business`} className={`pill ${activeCompId === c.id ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                        {c.name}
                      </Link>
                  ))}
              </div>
          </div>
      </section>
      <section className="comparison-table-section">
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Core Capability</th>
                <th className="brand-col brand-a">Veira</th>
                <th className="brand-col brand-b">{activeCompareData.comp.name}</th>
              </tr>
            </thead>
            <tbody>
              {activeCompareData.strategicCapabilities.map((cap, i) => (
                <tr key={i}>
                  <td className="feature-name">{cap.name}</td>
                  <td className="brand-val brand-a"><span className="check-icon">✓</span></td>
                  <td className="brand-val brand-b"><span className="dash-icon">—</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="primary-cta reveal">
        <Link href="/talk-to-us" className="primary-btn" style={{ textDecoration: 'none' }}>Contact Our Team</Link>
      </section>
    </div>
  );

  return (
    <div className="saas-container">
        <nav className="saas-nav">
            <Link href="/" className="logo-link-container" style={{ textDecoration: 'none' }}>
                <OrganicOrbLogo size={32} variant="nav" />
                <span className="saas-logo">Veira</span>
            </Link>
            <div className="nav-center">
                <div className="nav-links">
                    {HEADER_KEYS.map(key => (
                        <Link 
                          key={key} 
                          href={ROUTES[key].path} 
                          className={initialRoute === key ? 'active' : ''}
                        >
                          {ROUTES[key].label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="nav-right">
                <button className="nav-cta primary-btn hide-mobile" onClick={handleWhatsApp}>Get Free POS</button>
                <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>
        </nav>

        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-links">
                {HEADER_KEYS.map(key => (
                    <Link key={key} href={ROUTES[key].path} onClick={() => setIsMobileMenuOpen(false)}>
                      {ROUTES[key].label}
                    </Link>
                ))}
                <button className="primary-btn" style={{ marginTop: '2rem' }} onClick={handleWhatsApp}>Get Free POS</button>
                <button className="mobile-toggle" style={{ position: 'absolute', top: '2rem', right: '2rem' }} onClick={() => setIsMobileMenuOpen(false)}>
                  <XIcon />
                </button>
            </div>
        </div>

        <main className="saas-main">
            <DottedGlowBackground gap={32} radius={0.5} color="rgba(255,255,255,0.03)" glowColor="rgba(255,255,255,0.08)" speedScale={0.1} />

            {initialRoute === 'home' && !initialCompareSlug && (
              <>
                <section id="hero" className="saas-hero reveal">
                  <h1>Infrastructure for Modern Business.</h1>
                  <p className="hero-supporting">Managed POS, AI Agents, and Digital Payments in one high-performance stack built for East African commerce.</p>
                  <div className="hero-actions">
                    <Link href="/pos" className="primary-btn" style={{ textDecoration: 'none' }}>Explore POS</Link>
                    <Link href="/agents" className="secondary-btn" style={{ textDecoration: 'none' }}>Meet the Agents</Link>
                  </div>
                </section>

                <section id="infrastructure-stack" className="reveal" style={{ padding: '6rem 1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                   <div className="section-header">
                      <span className="category-tag">Integrated Stack</span>
                      <h2>Everything under one roof.</h2>
                   </div>
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      <Link href="/pos" className="tool-card" style={{ textDecoration: 'none' }}>
                         <h4>Cloud POS</h4>
                         <p className="excerpt">Free, eTIMS compliant point of sale that works offline and syncs instantly.</p>
                      </Link>
                      <Link href="/agents" className="tool-card" style={{ textDecoration: 'none' }}>
                         <h4>AI Agents</h4>
                         <p className="excerpt">Assistants that handle your WhatsApp, calls, and daily ops automatically.</p>
                      </Link>
                      <Link href="/cloud" className="tool-card" style={{ textDecoration: 'none' }}>
                         <h4>Veira Cloud</h4>
                         <p className="excerpt">Centralized business intelligence and unified data for all your outlets.</p>
                      </Link>
                   </div>
                </section>

                <section id="market-intelligence" className="journal-landing-preview reveal">
                  <div className="section-header">
                    <span className="category-tag">Older vs New</span>
                    <h2>Market Intelligence</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {COMPETITORS.slice(0, 8).map(comp => (
                        <Link key={comp.id} href={`/compare/${comp.id}-vs-veira-for-whatsapp-business`} className="tool-card" style={{ textDecoration: 'none' }}>
                            <h4>Veira vs {comp.name}</h4>
                            <p className="excerpt">Comparison for WhatsApp Business optimization.</p>
                        </Link>
                    ))}
                  </div>
                </section>
              </>
            )}

            {initialCompareSlug && renderComparisonView()}

            {initialRoute === 'pos' && (
              <div className="pos-page reveal">
                <section className="saas-hero">
                  <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Veira POS</h1>
                  <p className="hero-supporting" style={{ margin: '0 auto' }}>
                    Point of sale built for modern businesses. Fast, offline-first, and fully integrated with digital payments.
                  </p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      <div className="tool-card">
                         <h4>eTIMS Ready</h4>
                         <p className="excerpt">Native integration with KRA eTIMS for effortless compliance with every sale.</p>
                      </div>
                      <div className="tool-card">
                         <h4>Offline First</h4>
                         <p className="excerpt">Sales continue even when the internet doesn't. Data syncs automatically once back online.</p>
                      </div>
                      <div className="tool-card">
                         <h4>M-PESA Integrated</h4>
                         <p className="excerpt">Instant payment verification at the counter. No more fake messages or manual checks.</p>
                      </div>
                   </div>
                </section>
              </div>
            )}

            {initialRoute === 'agents' && (
              <div className="agents-page reveal">
                <section className="saas-hero">
                  <h1>{AGENTS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{AGENTS_CONTENT.hero.subheadline}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {AGENTS_CONTENT.agents.list.map((agent, i) => (
                      <div key={i} className="tool-card agent-profile-card">
                        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>{agent.name}</h3>
                        <span className="category-tag">{agent.role}</span>
                        <p className="excerpt" style={{ marginTop: '1.5rem' }}>{agent.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {initialRoute === 'cloud' && (
              <div className="cloud-page reveal">
                <section className="saas-hero">
                  <h1>{CLOUD_CONTENT.opening.headline}</h1>
                  <p className="hero-supporting">{CLOUD_CONTENT.opening.body}</p>
                </section>
                <section className="pos-content-section reveal">
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {CLOUD_CONTENT.whatActuallyHappens.items.map((item, i) => (
                      <div key={i} className="tool-card feature-item"><span className="check-icon">✓</span> <p>{item}</p></div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {initialRoute === 'apps' && (
              <div className="apps-page reveal">
                <section className="saas-hero">
                  <h1>{APPS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{APPS_CONTENT.hero.body}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tool-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                      <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Custom Development</h3>
                      <p className="excerpt">We build bespoke applications for enterprises that need specific workflows, integrations, or interfaces that standard tools can't provide.</p>
                      <Link href="/talk-to-us" className="primary-btn" style={{ marginTop: '2rem', textDecoration: 'none', display: 'inline-block' }}>Inquire About Custom Apps</Link>
                   </div>
                </section>
              </div>
            )}

            {initialRoute === 'pricing' && (
              <div className="pricing-page reveal">
                <section className="saas-hero">
                  <h1>{PRICING_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{PRICING_CONTENT.hero.body}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      {PRICING_CONTENT.tiers.map((tier, i) => (
                        <div key={i} className="tool-card" style={{ display: 'flex', flexDirection: 'column' }}>
                           <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{tier.name}</h3>
                           <div style={{ fontSize: '2rem', fontWeight: '800', margin: '1rem 0' }}>{tier.price}</div>
                           <p className="excerpt" style={{ marginBottom: '2rem' }}>{tier.description}</p>
                           <ul style={{ listStyle: 'none', padding: 0, marginTop: 'auto' }}>
                             {tier.features.map((f, j) => (
                               <li key={j} style={{ padding: '0.5rem 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                 <span style={{ color: 'var(--status-green)' }}>✓</span> {f}
                               </li>
                             ))}
                           </ul>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            )}

            {initialRoute === 'faq' && (
              <div className="faq-page reveal">
                <section className="saas-hero">
                  <h1>{FAQ_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{FAQ_CONTENT.hero.body}</p>
                </section>
                <section className="faq-section reveal">
                   <div className="faq-container">
                      {FAQ_CONTENT.items.map((item, i) => (
                        <div key={i} className="faq-item">
                           <h3>{item.q}</h3>
                           <p>{item.a}</p>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            )}

            {initialRoute === 'useCases' && (
              <div className="use-cases-page reveal">
                <section className="saas-hero">
                  <h1>{USE_CASES_PAGE_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{USE_CASES_PAGE_CONTENT.hero.body}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      {USE_CASES_PAGE_CONTENT.useCases.map((uc, i) => (
                        <div key={i} className="tool-card feature-item">
                           <h3 style={{ marginBottom: '1.2rem', color: '#fff' }}>{uc.name}</h3>
                           <p className="excerpt">{uc.body}</p>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            )}

            {initialRoute === 'ourStory' && (
              <div className="story-page reveal">
                <section className="saas-hero">
                  <h1>{STORY_CONTENT.story.opening.headline}</h1>
                  <p className="hero-supporting">{STORY_CONTENT.story.opening.body}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tool-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', borderColor: 'var(--orb-pink)' }}>
                      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>{STORY_CONTENT.story.profitWithPurpose.headline}</h2>
                      <p className="intro-text" style={{ color: 'var(--text-secondary)' }}>{STORY_CONTENT.story.profitWithPurpose.body}</p>
                   </div>
                </section>
              </div>
            )}

            {initialRoute === 'talkToUs' && (
              <div className="contact-page reveal">
                <section className="saas-hero">
                  <h1>{CONTACT_PAGE_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{CONTACT_PAGE_CONTENT.hero.body}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
                      {CONTACT_PAGE_CONTENT.channels.map((ch, i) => (
                        <div key={i} className="tool-card" style={{ textAlign: 'center' }}>
                           <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{ch.name}</h3>
                           <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{ch.value}</p>
                           <a href={ch.link} target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: 'none', display: 'block' }}>{ch.actionLabel}</a>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            )}
        </main>

        <footer className="saas-footer reveal">
            <div className="footer-content">
                <div className="footer-brand">
                    <OrganicOrbLogo size={28} variant="nav" />
                    <span className="saas-logo">Veira</span>
                    <p style={{ marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>The operating system for modern commerce.</p>
                </div>
                <div className="footer-col">
                    <h4>Solutions</h4>
                    {FOOTER_KEYS.map(key => (
                        <Link key={key} href={ROUTES[key].path}>{ROUTES[key].label}</Link>
                    ))}
                </div>
                <div className="footer-col">
                    <h4>Sections</h4>
                    <Link href="/#infrastructure-stack">Platform Stack</Link>
                    <Link href="/#market-intelligence">Intelligence</Link>
                    <Link href="/#hero">Hero</Link>
                </div>
                <div className="footer-col">
                    <h4>Connect</h4>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, marginBottom: '1rem', textAlign: 'left', display: 'block' }} 
                      onClick={handleWhatsApp}
                    >
                      WhatsApp
                    </button>
                    <a href="https://linkedin.com/company/veira" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </div>
            <div className="footer-bottom">&copy; {new Date().getFullYear()} Veira Systems. High-Performance Infrastructure.</div>
        </footer>
    </div>
  );
}

// Client-side Hydration logic for non-Next environments
if (typeof window !== 'undefined' && document.getElementById('root') && !document.getElementById('root')?.innerHTML) {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
