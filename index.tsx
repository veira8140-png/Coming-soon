'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

import DottedGlowBackground from './components/DottedGlowBackground';
import OrganicOrbLogo from './components/OrganicOrbLogo';
import { 
    ThinkingIcon, 
    CodeIcon,
    MenuIcon,
    XIcon,
    ArrowRightIcon
} from './components/Icons';

const WHATSAPP_NUMBER = "+254755792377";
const CONTACT_EMAIL = "hello@veirahq.com";
const BASE_URL = "https://veirahq.com";

// --- Massive Programmatic Dataset ---

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

const BLOG_POSTS = [
  { id: 1, title: "How AI Agents are Revolutionizing WhatsApp Commerce", category: "AI Trends", date: "Oct 24, 2024", excerpt: "Learn how modern businesses are scaling customer engagement with zero human intervention." },
  { id: 2, title: "M-PESA Sync: The Missing Link in Automated Retail", category: "Payments", date: "Oct 22, 2024", excerpt: "Bridging the gap between digital payment confirmation and automated order fulfillment." },
  { id: 3, title: "Scaling Branch Operations with Multi-Cloud POS", category: "Operations", date: "Oct 18, 2024", excerpt: "Why centralizing branch data is the single most important move for growing retailers." },
  { id: 4, title: "Why Your CRM Needs a Voice-Native AI Strategy", category: "Sales", date: "Oct 15, 2024", excerpt: "Turning cold calls into intelligent conversations with real-time AI processing." },
  { id: 5, title: "Compliance as Code: Automating eTIMS for Scale", category: "Compliance", date: "Oct 10, 2024", excerpt: "How to stay ahead of regulatory requirements without slowing down your sales floor." }
];

const AGENTS_CONTENT = {
  hero: {
    headline: "AI Assistants That Help Run Your Business",
    subheadline: "Veira agents help you reply to customers, follow up on leads, send invoices and handle daily business tasks automatically.",
    primaryCTA: "Talk to Us",
    secondaryCTA: "Book a Demo"
  },
  intro: {
    title: "What Are Veira Agents",
    text: "Veira agents are AI assistants set up to help with real business work. They do not just chat. They help you reply to customers, manage sales conversations, follow up automatically and handle routine tasks so you can focus on running your business."
  },
  howTheyWork: {
    title: "How Veira Agents Work",
    points: [
      "They work on WhatsApp, phone calls and internal dashboards",
      "They understand common customer questions and requests",
      "They take action such as sending messages, booking appointments or creating invoices",
      "They escalate to a human when needed"
    ]
  },
  agents: {
    title: "Meet the Veira Agents",
    list: [
      {
        name: "Glenn",
        role: "Customer Support Assistant",
        description: "Glenn helps with customer support and follow ups. He answers customer questions on WhatsApp and phone calls, checks ticket status, sends follow up messages and makes sure no customer is ignored."
      },
      {
        name: "Svan",
        role: "Sales Assistant",
        description: "Svan helps you convert leads into customers. She replies to new enquiries, answers questions, qualifies leads, books appointments and follows up automatically across WhatsApp and social messages."
      },
      {
        name: "Tat",
        role: "Operations Assistant",
        description: "Tat helps with daily business operations. She sends invoices, runs reports, checks stock levels, approves payments and handles simple operational requests through WhatsApp or the dashboard."
      }
    ]
  },
  useCases: {
    title: "How Businesses Use Veira Agents",
    items: [
      "Replying instantly to WhatsApp enquiries",
      "Following up on leads automatically",
      "Booking appointments without manual work",
      "Sending invoices and payment reminders",
      "Checking sales or stock reports",
      "Reducing missed messages and lost customers"
    ]
  },
  whoItsFor: {
    title: "Who Veira Agents Are For",
    businesses: [
      "Restaurants and cafes",
      "Retail shops",
      "Service businesses",
      "Sales teams",
      "Support teams",
      "Growing small and medium businesses"
    ]
  },
  benefits: {
    title: "Why Businesses Use Veira Agents",
    items: [
      "Customers get faster replies",
      "Leads are followed up automatically",
      "Less manual work for staff",
      "Better visibility into conversations",
      "More consistent customer experience"
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Are Veira agents real people",
        answer: "No. Veira agents are AI assistants. They are set up to behave like team members and help with common tasks automatically."
      },
      {
        question: "Do Veira agents work on WhatsApp",
        answer: "Yes. Veira agents are built to work primarily on WhatsApp and can also handle phone calls and dashboard requests."
      },
      {
        question: "Can the agents send invoices or reports",
        answer: "Yes. Some agents like Tat can send invoices, payment reminders and business reports depending on your setup."
      },
      {
        question: "What happens if an agent cannot handle a request",
        answer: "The agent will escalate the issue to a human team member so nothing important is missed."
      },
      {
        question: "Can I start with just one agent",
        answer: "Yes. You can start with one agent and add more as your business grows."
      }
    ]
  }
};

const CLOUD_CONTENT = {
  opening: {
    headline: "Most Business Stress Comes From Not Knowing",
    body: "Not knowing how sales are doing today. Not knowing if something was missed. Not knowing whether the numbers you heard are correct. Veira Cloud exists to remove that uncertainty."
  },
  reframe: {
    headline: "Cloud Is Not About Technology",
    body: "Despite what you have been told, cloud software is not really about servers or dashboards. It is about confidence. Confidence that things are running. Confidence that the numbers are real. Confidence that you can check without asking."
  },
  whatActuallyHappens: {
    headline: "What Veira Cloud Quietly Does",
    items: [
      "Collects sales from your POS without reminders",
      "Keeps customer and payment records in one place",
      "Stores activity from AI assistants automatically",
      "Turns daily chaos into a clear picture",
      "Backs everything up so mistakes do not become disasters"
    ]
  },
  contrast: {
    headline: "Before Veira Cloud",
    items: [
      "WhatsApp messages everywhere",
      "Reports arriving late or not at all",
      "Numbers that feel approximate",
      "Too many questions and too few answers"
    ]
  },
  contrastAfter: {
    headline: "After Veira Cloud",
    items: [
      "One place to check what matters",
      "Sales figures you trust",
      "Fewer follow up questions",
      "More time to think instead of chase"
    ]
  },
  psychologicalBenefit: {
    headline: "The Unexpected Benefit",
    body: "Businesses do not fail because they lack features. They fail because decision making becomes exhausting. Veira Cloud reduces cognitive load. And that, quietly, improves judgment."
  },
  whoItsReallyFor: {
    headline: "Who Veira Cloud Is Really For",
    items: [
      "Owners who want fewer surprises",
      "Managers tired of chasing updates",
      "Restaurants and cafes",
      "Retail shops",
      "Service businesses",
      "Law firms",
      "Clinics and medical practices",
      "Bars and clubs",
      "Growing businesses that value clarity"
    ]
  },
  howItFits: {
    headline: "Where It Fits In",
    body: "Veira Cloud sits behind everything you already use. Your POS feeds into it. Your AI assistants report to it. Your apps and website connect to it. You rarely notice it working. Which is exactly the point."
  },
  securityWithoutFear: {
    headline: "Security Without Scare Tactics",
    body: "Access is controlled. Activity is logged. Data is backed up. More importantly, you do not need to think about any of this. Veira manages the cloud so you can manage the business."
  },
  faq: {
    items: [
      {
        question: "Do I need technical knowledge to use Veira Cloud",
        answer: "No. Veira Cloud is built for business owners. If you can read a WhatsApp message, you can use it."
      },
      {
        question: "Can I check my business when I am not on site",
        answer: "Yes. Veira Cloud works on phones, tablets and computers so you can check anytime."
      },
      {
        question: "Does Veira Cloud replace my POS or AI agents",
        answer: "No. It connects them. Veira Cloud is the system that keeps everything in one place."
      },
      {
        question: "What happens if something breaks",
        answer: "Your data is backed up and Veira monitors the system to catch issues early."
      }
    ]
  },
  closing: {
    headline: "Good Systems Feel Boring. In a Good Way.",
    body: "Veira Cloud is not designed to impress you every day. It is designed so you stop worrying. And that turns out to be surprisingly valuable.",
    cta: "Talk to Us"
  }
};

const APPS_CONTENT = {
  hero: {
    headline: "Software Should Feel Obvious",
    body: "The best apps do not need instructions. They respond instantly. They look calm. They feel inevitable. Veira builds apps and websites that work the way people expect them to."
  },
  story: {
    body: "Most business software feels heavy. Too many buttons. Too many steps. Too much explanation. We take the opposite approach. Veira apps and websites are designed to disappear. You open them, do what you need to do, and move on with your day."
  },
  designPhilosophy: {
    headline: "Design is not decoration. It is decision making.",
    body: "Every screen is reduced to what matters. Every interaction is intentional. Nothing is added unless it makes something clearer, faster, or calmer."
  },
  experience: {
    headline: "Consistent Experience",
    body: "Whether it is a mobile app, a business dashboard, or a public website, the experience feels consistent. Clean layouts. Comfortable spacing. Thoughtful motion. Software that feels stable and trustworthy the moment it loads."
  },
  performance: {
    headline: "Speed is not a feature. It is a feeling.",
    body: "Veira apps load fast, respond instantly, and work smoothly across devices. Because waiting is friction. And friction costs trust."
  },
  integration: {
    headline: "Deep Integration",
    body: "Apps and websites do not live alone. They connect naturally with Veira POS, Veira Cloud, and Veira AI agents. Data flows quietly in the background. Nothing to sync. Nothing to export. Nothing to explain."
  },
  devices: {
    headline: "Multi-Device Harmony",
    body: "Phones. Tablets. Laptops. Desktops. Everything adjusts naturally. Text remains readable. Buttons remain reachable. Layouts remain balanced. The experience feels designed, not stretched."
  },
  ownership: {
    headline: "Production Ready",
    body: "These are not templates. And they are not experiments. Veira builds production ready apps and websites that businesses actually rely on. Systems that feel solid enough to grow with you."
  },
  closing: {
    headline: "When Software Is Done Right, You Stop Thinking About It",
    body: "That is the goal. Apps and websites that feel natural. Calm. Reliable. Software that respects your time and your customers attention.",
    cta: "Talk to Us"
  }
};

const STORY_CONTENT = {
  story: {
    opening: {
      headline: "Why Veira Exists",
      body: "Veira was created for businesses that want technology to feel simple, dependable, and quietly effective. Software should reduce stress, not introduce it. It should make work lighter, not heavier."
    },
    philosophy: {
      body: "We believe good systems are not loud. They work in the background. They remove friction. They give people time back. Veira is a productised service because most businesses do not want tools. They want outcomes that just work."
    },
    howWeWork: {
      body: "Everything we build follows the same principle. Fewer decisions. Clear interfaces. Reliable performance. Whether it is POS, cloud, AI agents, apps or websites, the experience should feel calm and considered."
    },
    profitWithPurpose: {
      headline: "Profit With Responsibility",
      body: "Veira allocates ten percent of its annual net profit to fighting gender based violence and supporting survivors. This is not a campaign. It is a standing commitment. The figure is fixed. Ten percent."
    },
    whyItMatters: {
      body: "Technology shapes how people work, earn, and live. We believe businesses have a responsibility to contribute beyond revenue. Supporting survivors and prevention efforts is part of how we choose to operate."
    },
    longView: {
      body: "Veira is built for the long term. We want to create software that businesses trust for years. And we want to grow in a way that leaves a positive mark beyond the products we ship."
    },
    closing: {
      body: "Calm software. Thoughtful growth. Real impact."
    }
  }
};

const USE_CASES_PAGE_CONTENT = {
  hero: {
    headline: "Built For How Work Actually Happens",
    body: "Every business looks different on the surface. But behind the scenes, the problems are often the same. Too many tools. Too many messages. Too much uncertainty. Veira is designed to simplify what happens every day."
  },
  intro: {
    body: "Veira is a productised service that brings POS, cloud, AI agents, apps and websites together. Not as separate tools, but as one system that quietly supports how businesses operate."
  },
  useCases: [
    {
      name: "Restaurants and Cafes",
      body: "Orders move quickly. Payments are processed without friction. Sales are recorded automatically. Managers receive daily reports without asking. Inventory levels stay visible. The business runs smoothly even when it is busy."
    },
    {
      name: "Retail Shops",
      body: "Every sale updates stock in real time. Customer purchases are tracked without manual work. Reports are always available. Staff focus on customers instead of paperwork."
    },
    {
      name: "Bars and Clubs",
      body: "Fast service matters. Veira handles high volume transactions, reduces errors, and provides clear end of day reporting. Owners can check performance without waiting until morning."
    },
    {
      name: "Clinics and Medical Practices",
      body: "Payments, records and daily activity stay organised. Staff spend less time managing systems and more time with patients. Management has visibility without disruption."
    },
    {
      name: "Law Firms",
      body: "Billing, invoicing and payments stay structured. Client activity is recorded clearly. Reports are easy to access. Operations remain professional and predictable."
    },
    {
      name: "Service Businesses",
      body: "Appointments, payments and follow ups stay in sync. AI agents respond to inquiries. Reports arrive automatically. Nothing slips through the cracks."
    }
  ],
  crossChannel: {
    headline: "One System Across Every Channel",
    body: "Whether a customer pays at a counter, messages on WhatsApp, books through a website or interacts with an AI agent, everything connects back to Veira Cloud. The experience feels unified, not stitched together."
  },
  psychologicalBenefit: {
    body: "Most businesses do not need more features. They need fewer worries. Veira reduces mental load by making information easy to access and easy to trust."
  },
  closing: {
    headline: "Different Businesses. Same Relief.",
    body: "Veira adapts to how you work, not the other way around. The result is fewer questions, clearer answers, and calmer days.",
    cta: "Talk to Us"
  }
};

const CONTACT_PAGE_CONTENT = {
  hero: {
    headline: "Let's Talk About Your Business.",
    body: "We prefer conversations over forms. Reach out via WhatsApp or email, and we'll help you find the right systems for your operations."
  },
  channels: [
    {
      name: "WhatsApp",
      value: "+254 755 792 377",
      actionLabel: "Chat Now",
      link: `https://wa.me/254755792377`
    },
    {
      name: "Email",
      value: "hello@veirahq.com",
      actionLabel: "Send Email",
      link: "mailto:hello@veirahq.com"
    }
  ]
};

// Route Keys strictly from JSON
type RouteKey = 'home' | 'pos' | 'agents' | 'cloud' | 'apps' | 'useCases' | 'ourStory' | 'talkToUs';

const ROUTES: Record<RouteKey, { label: string; path: string }> = {
  home: { label: 'Veira', path: '/' },
  pos: { label: 'POS', path: '/pos' },
  agents: { label: 'Agents', path: '/agents' },
  cloud: { label: 'Cloud', path: '/cloud' },
  apps: { label: 'Apps', path: '/apps' },
  useCases: { label: 'Use Cases', path: '/use-cases' },
  ourStory: { label: 'Our Story', path: '/our-story' },
  talkToUs: { label: 'Talk to Us', path: '/talk-to-us' }
};

// Navigation inclusions from JSON
const HEADER_KEYS: RouteKey[] = ['pos', 'agents', 'cloud', 'apps', 'useCases', 'ourStory', 'talkToUs'];
const FOOTER_KEYS: RouteKey[] = ['pos', 'agents', 'cloud', 'apps', 'useCases', 'ourStory'];

export default function App({ initialRoute = 'home' }: { initialRoute?: RouteKey }) {
  const [activeRoute, setActiveRoute] = useState<RouteKey>(initialRoute);
  const [activeCompId, setActiveCompId] = useState("chatgpt");
  const [activeContextId, setActiveContextId] = useState("whatsapp-business");
  const [activeCompareSlug, setActiveCompareSlug] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (key: RouteKey, slug?: string) => {
    setActiveRoute(key);
    setActiveCompareSlug(slug || null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // In Next.js, we would use router.push here if we were actually changing browser URLs,
    // but this initialRoute mechanism handles the landing states for Search Engine 200 responses.
  };

  const showCompare = (compId?: string, ctxId?: string) => {
    const cid = compId || activeCompId;
    const ctxid = ctxId || activeContextId;
    setActiveCompId(cid);
    setActiveContextId(ctxid);
    const slug = `${cid}-vs-veira-for-${ctxid}`;
    navigate('home', slug); 
    setActiveCompareSlug(slug);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Veira, I'm interested in your business solutions.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  };

  const activeCompareData = useMemo(() => {
    if (activeCompareSlug) {
      const parts = activeCompareSlug.split('-vs-veira-for-');
      if (parts.length === 2) {
        const foundComp = COMPETITORS.find(c => c.id === parts[0]);
        const foundCtx = USE_CASES.find(u => u.id === parts[1]);
        if (foundComp && foundCtx) {
          setActiveCompId(foundComp.id);
          setActiveContextId(foundCtx.id);
        }
      }
    }
    const comp = COMPETITORS.find(c => c.id === activeCompId) || COMPETITORS[0];
    const context = USE_CASES.find(ctx => ctx.id === activeContextId) || USE_CASES[0];
    const isHelpdesk = comp.type.includes("Helpdesk") || comp.type.includes("Platform");
    const isLLM = comp.type.includes("LLM") || comp.type.includes("AI");

    const strategicCapabilities = [
      { name: "WhatsApp-native Automation", a: true, b: isHelpdesk || comp.id === 'meta-ai' },
      { name: "Voice AI Call Handling", a: true, b: isLLM && comp.id !== 'perplexity' },
      { name: "M-PESA Payment Verification", a: true, b: false },
      { name: "KRA eTIMS Compliance Sync", a: true, b: false },
      { name: "Multi-Agent Support Handover", a: true, b: isHelpdesk },
      { name: "Invoicing & Automated Billing", a: true, b: false },
      { name: "Operational Command Execution", a: true, b: false },
      { name: "Regional Market Context", a: true, b: false }
    ];

    const faqs = [
      { question: "What are AI agents for business?", answer: "AI agents are role-based AI systems designed to execute real business tasks such as sales, customer support, and operations." },
      { question: "Does Veira work on WhatsApp?", answer: "Yes. Veira is WhatsApp-native and designed specifically for WhatsApp Business workflows." },
      { question: `Is Veira better than ${comp.name} for business?`, answer: `Veira is designed specifically for business workflows like sales, customer support, and operations, while ${comp.name} focuses on general AI usage.` },
      { question: "Can Veira replace multiple tools?", answer: "Yes. Veira combines sales, support, and operational automation into one AI agent system." }
    ];

    return { comp, context, strategicCapabilities, faqs };
  }, [activeCompId, activeContextId, activeCompareSlug]);

  const renderComparisonView = () => (
    <div className="comparison-page reveal">
      <section className="saas-hero">
        <h1>Veira vs {activeCompareData.comp.name}</h1>
        <p className="hero-supporting">The ultimate comparison for {activeCompareData.context.label}. Choose the solution that executes real work.</p>
      </section>
      <section className="comparison-controls">
          <div className="control-group">
              <label>Brand Selection:</label>
              <div className="control-pills">
                  {COMPETITORS.map(c => (
                      <button key={c.id} className={`pill ${activeCompId === c.id ? 'active' : ''}`} onClick={() => setActiveCompId(c.id)}>{c.name}</button>
                  ))}
              </div>
          </div>
          <div className="control-group">
              <label>Target Use Case:</label>
              <div className="control-pills">
                  {USE_CASES.map(ctx => (
                      <button key={ctx.id} className={`pill ${activeContextId === ctx.id ? 'active' : ''}`} onClick={() => setActiveContextId(ctx.id)}>{ctx.label}</button>
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
                  <td className="brand-val brand-a">{cap.a ? <span className="check-icon">✓</span> : <span className="dash-icon">—</span>}</td>
                  <td className="brand-val brand-b">{cap.b ? <span className="check-icon">✓</span> : <span className="dash-icon">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="verdict-section reveal">
        <div className="section-header"><h2>Market Verdict</h2></div>
        <div className="verdict-grid">
          <div className="verdict-card card-a">
            <div className="card-header"><h3>Why Veira Wins</h3></div>
            <ul><li>Operational execution native to WhatsApp</li><li>Direct eTIMS & M-PESA compliance</li></ul>
          </div>
          <div className="verdict-card card-b">
            <div className="card-header"><h3>Why {activeCompareData.comp.name} Wins</h3></div>
            <ul><li>Broad text generation</li><li>Personal productivity</li></ul>
          </div>
        </div>
      </section>
      <section className="primary-cta reveal">
        <button className="primary-btn" onClick={() => navigate('talkToUs')}>Upgrade Your Systems</button>
      </section>
    </div>
  );

  return (
    <div className="saas-container">
        <nav className="saas-nav">
            <div className="logo-link-container" onClick={() => navigate('home')}>
                <OrganicOrbLogo size={32} variant="nav" />
                <span className="saas-logo">Veira</span>
            </div>
            <div className="nav-center">
                <div className="nav-links">
                    {HEADER_KEYS.map(key => (
                        <a key={key} href="#" onClick={(e) => { e.preventDefault(); navigate(key); }}>{ROUTES[key].label}</a>
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
                    <a key={key} href="#" onClick={(e) => { e.preventDefault(); navigate(key); }}>{ROUTES[key].label}</a>
                ))}
                <button className="primary-btn" style={{ marginTop: '2rem' }} onClick={handleWhatsApp}>Get Free POS</button>
            </div>
        </div>

        <main className="saas-main">
            <DottedGlowBackground gap={32} radius={0.5} color="rgba(255,255,255,0.03)" glowColor="rgba(255,255,255,0.08)" speedScale={0.1} />

            {activeRoute === 'home' && !activeCompareSlug && (
              <>
                <section className="saas-hero reveal">
                  <h1>Infrastructure for Modern Business.</h1>
                  <p className="hero-supporting">Managed POS, AI Agents, and Digital Payments in one high-performance stack built for East African commerce.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={() => navigate('pos')}>Explore POS</button>
                    <button className="secondary-btn" onClick={() => navigate('agents')}>Meet the Agents</button>
                  </div>
                </section>
                <section className="journal-landing-preview reveal">
                  <div className="section-header"><h2>Market Intelligence</h2></div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {COMPETITORS.slice(0, 6).map(comp => (
                        <div key={comp.id} className="tool-card" onClick={() => showCompare(comp.id, "whatsapp-business")}>
                            <h4>Veira vs {comp.name}</h4>
                            <p className="excerpt">Comparison for WhatsApp Business optimization.</p>
                        </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeCompareSlug && renderComparisonView()}

            {activeRoute === 'pos' && (
              <div className="pos-page reveal" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <section className="saas-hero" style={{ minHeight: 'auto' }}>
                  <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>Veira POS</h1>
                  <p className="hero-supporting" style={{ margin: '0 auto' }}>
                    Point of sale built for modern businesses.
                  </p>
                </section>
              </div>
            )}

            {activeRoute === 'agents' && (
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

            {activeRoute === 'cloud' && (
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

            {activeRoute === 'apps' && (
              <div className="apps-page reveal">
                <section className="saas-hero">
                  <h1>{APPS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{APPS_CONTENT.hero.body}</p>
                </section>
                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      <div className="tool-card"><h3>{APPS_CONTENT.designPhilosophy.headline}</h3><p className="excerpt">{APPS_CONTENT.designPhilosophy.body}</p></div>
                      <div className="tool-card"><h3>{APPS_CONTENT.experience.headline}</h3><p className="excerpt">{APPS_CONTENT.experience.body}</p></div>
                   </div>
                </section>
              </div>
            )}

            {activeRoute === 'useCases' && (
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

            {activeRoute === 'ourStory' && (
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

            {activeRoute === 'talkToUs' && (
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
                        <a key={key} href="#" onClick={(e) => { e.preventDefault(); navigate(key); }}>{ROUTES[key].label}</a>
                    ))}
                </div>
                <div className="footer-col">
                    <h4>Comparisons</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare("chatgpt", "sales-teams"); }}>vs ChatGPT</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare("claude", "customer-support"); }}>vs Claude</a>
                </div>
                <div className="footer-col">
                    <h4>Connect</h4>
                    <a href="#" onClick={handleWhatsApp}>WhatsApp</a>
                    <a href="https://linkedin.com/company/veira" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </div>
            <div className="footer-bottom">&copy; {new Date().getFullYear()} Veira Systems. High-Performance Infrastructure.</div>
        </footer>
    </div>
  );
}

// Client-side Hydration
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
