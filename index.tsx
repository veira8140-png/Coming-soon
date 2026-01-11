
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

const POS_CONTENT = {
  meta: {
    title: "Free ETIMS Compliant POS System in Kenya | Android POS by Veira",
    description: "Get a free ETIMS compliant Android POS system for restaurants, retail, clinics, law firms, service businesses, bars and clubs. Daily WhatsApp reports and cloud dashboard included."
  },
  hero: {
    headline: "A Simple POS That Helps You Run Your Business",
    subheadline: "Record sales, manage staff, track inventory and receive clear reports without complicated software.",
    primaryCTA: "Get Started",
    secondaryCTA: "Talk to Us"
  },
  intro: {
    title: "What Is Veira POS",
    text: "Veira POS is a modern Android POS system delivered as a service. It helps businesses handle sales, payments and reporting in a simple and reliable way. Everything is set up for you and works out of the box."
  },
  features: {
    title: "What You Get",
    items: [
      "ETIMS compliant and KRA ready",
      "Android POS devices for fast checkout",
      "Cloud based dashboard you can access anywhere",
      "Daily sales reports sent directly to WhatsApp",
      "Staff and inventory management",
      "Fraud prevention and basic business insights"
    ]
  },
  pricing: {
    title: "Simple Pricing",
    text: "There is no monthly software fee. Veira charges a small transaction fee when you process payments. This helps us maintain the system, improve security and support your business."
  },
  whoItsFor: {
    title: "Who Veira POS Is For",
    businesses: [
      "Restaurants and cafes",
      "Retail shops and mini marts",
      "Law firms",
      "Service based businesses",
      "Clinics and medical practices",
      "Bars and clubs",
      "Pharmacies",
      "Growing small and medium businesses"
    ]
  },
  benefits: {
    title: "Why Businesses Choose Veira POS",
    items: [
      "Easy to use with little training needed",
      "Works well for both product and service businesses",
      "Clear reports sent automatically to WhatsApp",
      "Reliable ETIMS compliance",
      "One system connected to cloud and support"
    ]
  },
  howItWorks: {
    title: "How It Works",
    steps: [
      "We help you set up the POS",
      "You start recording sales and payments",
      "Reports are sent automatically to your WhatsApp",
      "You monitor everything from one dashboard"
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is the Veira POS really free",
        answer: "Yes. There is no monthly software fee. Veira only charges a small transaction fee when payments are processed."
      },
      {
        question: "Is Veira POS ETIMS compliant",
        answer: "Yes. Veira POS is fully ETIMS compliant and ready for KRA requirements."
      },
      {
        question: "Can service businesses like law firms or clinics use the POS",
        answer: "Yes. Veira POS supports service based billing, invoicing and reporting, making it suitable for law firms, clinics and other service businesses."
      },
      {
        question: "Do I get reports on WhatsApp",
        answer: "Yes. Veira sends daily sales reports directly to your WhatsApp so you can track performance easily."
      },
      {
        question: "Does the POS work on Android devices",
        answer: "Yes. Veira POS is designed for Android POS hardware and handheld devices."
      }
    ]
  }
};

type AppView = 'landing' | 'pos' | 'agents' | 'compare' | 'cloud' | 'apps' | 'use-cases' | 'story' | 'blog';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [activeCompId, setActiveCompId] = useState("chatgpt");
  const [activeContextId, setActiveContextId] = useState("whatsapp-business");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Internal Linking Randomizer ---
  const internalLinks = useMemo(() => {
    const links: { compId: string; ctxId: string }[] = [];
    const used = new Set();
    while (links.length < 6) {
      const comp = COMPETITORS[Math.floor(Math.random() * COMPETITORS.length)];
      const ctx = USE_CASES[Math.floor(Math.random() * USE_CASES.length)];
      const key = `${comp.id}-${ctx.id}`;
      if (!used.has(key) && (comp.id !== activeCompId || ctx.id !== activeContextId)) {
        links.push({ compId: comp.id, ctxId: ctx.id });
        used.add(key);
      }
    }
    return links;
  }, [activeCompId, activeContextId]);

  const navigate = (newView: AppView) => {
    setView(newView);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const showCompare = (compId?: string, ctxId?: string) => {
    if (compId) setActiveCompId(compId);
    if (ctxId) setActiveContextId(ctxId);
    navigate('compare');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Veira, I'm interested in your business solutions.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  };

  // --- Comparison Engine Logic ---
  const activeCompareData = useMemo(() => {
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
  }, [activeCompId, activeContextId]);

  // --- Dynamic Meta & Schema Injection ---
  useEffect(() => {
    const isCompare = view === 'compare';
    const isPOS = view === 'pos';
    
    let pageTitle = `Veira — ${view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ')} Systems`;
    let mainSchema: any = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Veira AI Agents",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, WhatsApp, Voice",
        "description": "AI agents for sales, customer support, and operations across WhatsApp and voice.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    if (isCompare) {
        const { comp, context, faqs } = activeCompareData;
        pageTitle = `Veira vs ${comp.name} for ${context.label} | Best AI for Business`;
        mainSchema = [
            mainSchema,
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(f => ({
                  "@type": "Question",
                  "name": f.question,
                  "acceptedAnswer": { "@type": "Answer", "text": f.answer }
                }))
            }
        ];
    } else if (isPOS) {
        pageTitle = POS_CONTENT.meta.title;
        mainSchema = [
            mainSchema,
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": POS_CONTENT.faq.items.map(f => ({
                  "@type": "Question",
                  "name": f.question,
                  "acceptedAnswer": { "@type": "Answer", "text": f.answer }
                }))
            }
        ];
    } else if (view === 'landing') {
        pageTitle = "Veira — Simpler Business Systems";
    }

    document.title = pageTitle;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(mainSchema);
    script.id = 'dynamic-seo-schema';
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('dynamic-seo-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, [view, activeCompareData]);

  return (
    <div className="saas-container">
        {/* Navigation Bar */}
        <nav className="saas-nav">
            <div className="logo-link-container" onClick={() => navigate('landing')}>
                <OrganicOrbLogo size={32} variant="nav" />
                <span className="saas-logo">Veira</span>
            </div>
            <div className="nav-center">
                <div className="nav-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('pos'); }}>POS</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('agents'); }}>Agents</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('cloud'); }}>Cloud</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('apps'); }}>Apps</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('use-cases'); }}>Use Cases</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('story'); }}>Our Story</a>
                </div>
            </div>
            <div className="nav-right">
                <button className="nav-cta primary-btn hide-mobile" onClick={handleWhatsApp}>Get Free POS</button>
                <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-links">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('pos'); }}>POS</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('agents'); }}>Agents</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('cloud'); }}>Cloud</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('apps'); }}>Apps</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('use-cases'); }}>Use Cases</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('story'); }}>Our Story</a>
                <button className="primary-btn" style={{ marginTop: '2rem' }} onClick={handleWhatsApp}>Get Free POS</button>
            </div>
        </div>

        <main className="saas-main">
            <DottedGlowBackground gap={32} radius={0.5} color="rgba(255,255,255,0.03)" glowColor="rgba(255,255,255,0.08)" speedScale={0.1} />

            {view === 'landing' && (
              <>
                <section className="saas-hero reveal">
                  <h1>Infrastructure for Modern Business.</h1>
                  <p className="hero-supporting">Managed POS, AI Agents, and Digital Payments in one high-performance stack built for East African commerce.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={() => navigate('pos')}>Explore POS</button>
                    <button className="secondary-btn" onClick={() => navigate('agents')}>Meet the Agents</button>
                  </div>
                </section>

                {/* Surfaced Blog Posts / Journal */}
                <section className="journal-landing-preview reveal">
                  <div className="section-header">
                    <h2>The Journal</h2>
                    <p>Intelligence on scaling modern operations.</p>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {BLOG_POSTS.slice(0, 3).map(post => (
                        <div key={post.id} className="tool-card journal-card" onClick={() => navigate('blog')}>
                            <span className="category-tag">{post.category}</span>
                            <h4>{post.title}</h4>
                            <p className="excerpt">{post.excerpt}</p>
                            <span className="date-tag">{post.date}</span>
                        </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button className="secondary-btn" onClick={() => navigate('blog')}>Read All Entries</button>
                  </div>
                </section>
              </>
            )}

            {view === 'blog' && (
              <div className="blog-page reveal">
                <section className="saas-hero">
                  <h1>The Veira Journal</h1>
                  <p className="hero-supporting">Insights on AI, Operations, and Business Architecture.</p>
                </section>
                <section className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto 6rem' }}>
                    {BLOG_POSTS.map(post => (
                        <div key={post.id} className="tool-card journal-card-full">
                            <span className="category-tag">{post.category}</span>
                            <h4>{post.title}</h4>
                            <p className="excerpt">{post.excerpt}</p>
                            <p className="date-tag">{post.date}</p>
                        </div>
                    ))}
                </section>
              </div>
            )}

            {view === 'compare' && (
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
                            <td className="brand-val brand-a">
                              {cap.a ? <span className="check-icon">✓</span> : <span className="dash-icon">—</span>}
                            </td>
                            <td className="brand-val brand-b">
                              {cap.b ? <span className="check-icon">✓</span> : <span className="dash-icon">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="verdict-section reveal">
                  <div className="section-header">
                    <h2>Market Verdict</h2>
                    <p>Why businesses choose Veira for real-world execution over general-purpose AI.</p>
                  </div>
                  <div className="verdict-grid">
                    <div className="verdict-card card-a">
                      <div className="card-header"><h3>Why Veira Wins</h3></div>
                      <ul>
                        <li>Purpose-built for operational execution</li>
                        <li>Built-in payment and tax compliance</li>
                        <li>WhatsApp & Voice native support</li>
                      </ul>
                    </div>
                    <div className="verdict-card card-b">
                      <div className="card-header"><h3>Why {activeCompareData.comp.name} Wins</h3></div>
                      <ul>
                        <li>General purpose text generation</li>
                        <li>Broad knowledge retrieval</li>
                        <li>Personal productivity workflows</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="faq-section reveal">
                    <div className="section-header">
                        <h2>Frequently Asked Questions</h2>
                        <p>Detailed insights for {activeCompareData.context.label}.</p>
                    </div>
                    <div className="faq-container">
                        {activeCompareData.faqs.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="compare-more-section reveal">
                    <div className="section-header">
                        <h2>Explore Other Comparisons</h2>
                        <p>Deep dive into how Veira stacks up against the competition in various business contexts.</p>
                    </div>
                    <div className="tools-grid">
                        {internalLinks.map((link, idx) => {
                            const c = COMPETITORS.find(comp => comp.id === link.compId);
                            const u = USE_CASES.find(use => use.id === link.ctxId);
                            return (
                                <div key={idx} className="tool-card" onClick={() => showCompare(link.compId, link.ctxId)}>
                                    <h4>Veira vs {c?.name}</h4>
                                    <p>Optimal for {u?.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="primary-cta reveal">
                  <h2>Upgrade Your Business Infrastructure</h2>
                  <div className="cta-actions" style={{ marginTop: '2rem' }}>
                    <button className="primary-btn" onClick={() => navigate('agents')}>Meet Your AI Team</button>
                    <button className="secondary-btn" onClick={handleWhatsApp}>Consult an Expert</button>
                  </div>
                </section>
              </div>
            )}

            {view === 'agents' && (
              <div className="agents-page reveal">
                <section className="saas-hero">
                  <h1>Specialized AI Agents.</h1>
                  <p className="hero-supporting">Sales, Support, and Operations agents that manage your business on WhatsApp and Voice.</p>
                  <button className="primary-btn" onClick={handleWhatsApp} style={{ marginTop: '2rem' }}>Assign Agents to Your Team</button>
                </section>
              </div>
            )}

            {view === 'pos' && (
              <div className="pos-page reveal">
                {/* Hero */}
                <section className="saas-hero">
                  <h1>{POS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{POS_CONTENT.hero.subheadline}</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={handleWhatsApp}>{POS_CONTENT.hero.primaryCTA}</button>
                    <button className="secondary-btn" onClick={handleWhatsApp}>{POS_CONTENT.hero.secondaryCTA}</button>
                  </div>
                </section>

                {/* Intro */}
                <section className="pos-content-section reveal">
                   <div className="section-header">
                      <h2>{POS_CONTENT.intro.title}</h2>
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        {POS_CONTENT.intro.text}
                      </p>
                   </div>
                </section>

                {/* Features */}
                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{POS_CONTENT.features.title}</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {POS_CONTENT.features.items.map((item, i) => (
                      <div key={i} className="tool-card feature-item">
                        <span className="check-icon" style={{ display: 'block', marginBottom: '1rem' }}>✓</span>
                        <p style={{ fontWeight: 600 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pricing */}
                <section className="pos-content-section reveal" style={{ background: 'var(--bg-surface)', padding: '6rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div className="section-header">
                    <h2>{POS_CONTENT.pricing.title}</h2>
                    <p style={{ maxWidth: '800px', margin: '2rem auto 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                      {POS_CONTENT.pricing.text}
                    </p>
                  </div>
                </section>

                {/* Who it's for */}
                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{POS_CONTENT.whoItsFor.title}</h2>
                  </div>
                  <div className="control-pills" style={{ justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    {POS_CONTENT.whoItsFor.businesses.map((biz, i) => (
                      <span key={i} className="pill" style={{ cursor: 'default' }}>{biz}</span>
                    ))}
                  </div>
                </section>

                {/* Benefits */}
                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{POS_CONTENT.benefits.title}</h2>
                  </div>
                  <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {POS_CONTENT.benefits.items.map((item, i) => (
                      <div key={i} className="faq-item" style={{ padding: '1.5rem 2rem' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                          <span className="check-icon">✓</span> {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* How it Works */}
                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{POS_CONTENT.howItWorks.title}</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {POS_CONTENT.howItWorks.steps.map((step, i) => (
                      <div key={i} className="tool-card">
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orb-violet)', display: 'block', marginBottom: '1rem' }}>0{i+1}</span>
                        <p style={{ fontWeight: 600 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ */}
                <section className="faq-section reveal">
                    <div className="section-header">
                        <h2>{POS_CONTENT.faq.title}</h2>
                    </div>
                    <div className="faq-container">
                        {POS_CONTENT.faq.items.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="primary-cta reveal">
                  <h2>Get Started With Veira POS</h2>
                  <p className="hero-supporting" style={{ marginTop: '1rem' }}>Talk to us today and get a POS system that works for your business.</p>
                  <div className="cta-actions" style={{ marginTop: '2.5rem' }}>
                    <button className="primary-btn" onClick={handleWhatsApp}>Talk to Us</button>
                  </div>
                </section>
              </div>
            )}

            {view === 'cloud' && (
              <div className="cloud-page reveal">
                <section className="saas-hero">
                  <h1>Veira Cloud.</h1>
                  <p className="hero-supporting">The backbone of your operational intelligence. Real-time data sync across every branch.</p>
                </section>
              </div>
            )}

            {view === 'apps' && (
              <div className="apps-page reveal">
                <section className="saas-hero">
                  <h1>Integrated Apps.</h1>
                  <p className="hero-supporting">A growing ecosystem of tools for billing, compliance, and staff management.</p>
                </section>
              </div>
            )}

            {view === 'use-cases' && (
              <div className="use-cases-page reveal">
                <section className="saas-hero">
                  <h1>Solving for Industry.</h1>
                  <p className="hero-supporting">From small retail stores to massive logistics enterprises.</p>
                </section>
              </div>
            )}

            {view === 'story' && (
              <div className="story-page reveal">
                <section className="saas-hero">
                  <h1>Our Story.</h1>
                  <p className="hero-supporting">Building the operating system for the next generation of commerce.</p>
                </section>
              </div>
            )}
        </main>

        <footer className="saas-footer reveal">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="logo-link-container" onClick={() => navigate('landing')}>
                        <OrganicOrbLogo size={28} variant="nav" />
                        <span className="saas-logo">Veira</span>
                    </div>
                    <p style={{ marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>The operating system for modern commerce.</p>
                </div>
                <div className="footer-col">
                    <h4>Top Comparisons</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare("chatgpt", "sales-teams"); }}>vs ChatGPT</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare("claude", "customer-support"); }}>vs Claude</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare("intercom-ai", "whatsapp-business"); }}>vs Intercom</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare(); }}>All Comparisons</a>
                </div>
                <div className="footer-col">
                    <h4>Solutions</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('pos'); }}>POS Systems</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('agents'); }}>AI Agents</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('cloud'); }}>Cloud Systems</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('blog'); }}>Blog Posts</a>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <a href="#" onClick={handleWhatsApp}>WhatsApp</a>
                    <a href="https://linkedin.com/company/veira" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('story'); }}>Our Story</a>
                </div>
            </div>
            <div className="footer-bottom">&copy; {new Date().getFullYear()} Veira Systems. High-Performance Enterprise.</div>
        </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
