
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

import DottedGlowBackground from './components/DottedGlowBackground';
import SideDrawer from './components/SideDrawer';
import { 
    ThinkingIcon, 
    SparklesIcon
} from './components/Icons';

const WHATSAPP_NUMBER = "+254700000000";

// --- Lead Scoring Definitions ---
const SCORING_MODEL = {
  COLD: { min: 0, max: 29, action: "Show educational CTA" },
  WARM: { min: 30, max: 69, action: "Prompt WhatsApp conversation" },
  HOT: { min: 70, max: 100, action: "Trigger sales alert + Talk to Us CTA" }
};

const EVENT_SCORES = {
  TOOL_COMPLETED: 20,
  CTA_CLICKED: 25,
  WHATSAPP_CLICKED: 30,
  MULTIPLE_TOOLS_USED: 15,
  POS_VISITED: 20,
};

// --- Blog Data Structure ---
interface BlogSection {
  id: string;
  title: string;
  body: string;
  internalLinks?: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface BlogPost {
  slug: string;
  meta: {
    title: string;
    description: string;
    primaryKeyword?: string;
  };
  content: {
    headline: string;
    subheadline?: string;
    sections: BlogSection[];
    faqs: FAQ[];
  };
}

// --- Collapsible FAQ Component ---
const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`faq-collapsible ${isOpen ? 'active' : ''}`} role="region">
      <button 
        className="faq-question-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span style={{ flex: 1 }}>{faq.question}</span>
        <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div 
        className="faq-answer-wrap" 
        style={{ 
            height: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
            opacity: isOpen ? 1 : 0
        }}
      >
        <div ref={contentRef} className="faq-answer-inner">
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

// --- All Blog Posts ---
const BLOG_POSTS: BlogPost[] = [
  {
    slug: "free-etims-compliant-pos-kenya",
    meta: {
      title: "Free ETIMS-Compliant POS System in Kenya for Restaurants & Retail | Veira",
      description: "Get a free ETIMS-compliant POS system in Kenya. Veira offers Android POS hardware support, cloud dashboard, WhatsApp sales reports, fraud prevention, and no monthly fees.",
      primaryKeyword: "free etims compliant pos kenya",
    },
    content: {
      headline: "Free ETIMS-Compliant POS System in Kenya: The Complete Guide for Restaurants & Retail Businesses",
      subheadline: "Modernize your business with ETIMS integration, Android hardware, and real-time cloud reporting.",
      sections: [
        {
          id: "what-is-pos",
          title: "What Is a POS System and Why It Matters in Kenya",
          body: "A Point of Sale (POS) system is the heart of any modern business. In Kenya, moving away from manual ledgers to a digital POS helps you track every shilling, manage stock accurately, and understand your best-selling items. For restaurants and retail shops, it reduces errors and provides the data needed to grow.",
          internalLinks: ["/pos"]
        },
        {
          id: "etims-compliance",
          title: "What Is ETIMS and Why Your POS Must Be ETIMS Compliant",
          body: "KRA's Electronic Tax Invoice Management System (eTIMS) is now a requirement for businesses in Kenya. An eTIMS-compliant POS system automatically generates valid tax invoices and syncs them with KRA in real-time. This saves you from the manual work of logging into the portal for every sale and ensures your business remains compliant.",
          internalLinks: ["/ai-tools/etims-compliance-checker"]
        },
        {
          id: "free-pos-future",
          title: "Why Free POS Systems Are the Future for Kenyan Businesses",
          body: "Upfront software costs and heavy monthly fees shouldn't stop you from running a professional business. Free-to-start POS systems like Veira align our success with yours. By removing monthly subscriptions and focusing on value, we allow Kenyan entrepreneurs to scale without financial burden.",
          internalLinks: ["/pos"]
        },
        {
          id: "who-is-it-for",
          title: "Who Veira POS Is Built For",
          body: "Our system is tailored for the high-paced environment of Kenyan commerce. Whether you are running a busy restaurant in Nairobi, a high-volume retail store, a local supermarket, or a specialized clinic, the system adapts to your workflow. We support multi-branch operations and diverse payment methods including M-PESA and cards.",
          internalLinks: ["/pos"]
        },
        {
          id: "features",
          title: "Key Features of Veira POS",
          body: "Veira isn't just a sales tool; it's a complete business management suite. Our key features include full eTIMS compliance, support for Android Smart POS hardware, a real-time cloud-based dashboard, and our signature daily WhatsApp sales reports. We also provide robust inventory management, staff fraud prevention, and smart analytics to help you spot trends before they become problems.",
          internalLinks: ["/pos"]
        },
        {
          id: "why-switch",
          title: "Why Businesses Are Switching to Veira POS",
          body: "Kenyan business owners are switching because they want simplicity. They are tired of complicated software that breaks or requires expensive tech support. Veira offers a managed experience—we handle the setup, the updates, and the compliance so you can focus on your customers.",
          internalLinks: ["/pos"]
        },
        {
          id: "get-started",
          title: "How to Get Started with Veira POS",
          body: "Ready to simplify your operations? The process is simple. Book a free demo via WhatsApp, and our team will show you how the system works. Once you're ready, we help set up your Android POS hardware and train your staff. You could be up and running in as little as 48 hours.",
          internalLinks: ["/talk-to-us"]
        }
      ],
      faqs: [
        {
          question: "Is a free POS system reliable for my business?",
          answer: "Yes. Veira uses enterprise-grade cloud infrastructure. Our 'free' model means we don't charge monthly software fees; we align our revenue with your success through payment processing."
        },
        {
          question: "Do I need to buy expensive hardware to use Veira?",
          answer: "No. Veira supports a wide range of affordable Android Smart POS devices. We can even help you source the right hardware at competitive prices."
        },
        {
          question: "How does the eTIMS integration work?",
          answer: "The POS system is pre-configured to communicate with KRA. When you make a sale, the system generates the eTIMS invoice automatically in the background."
        }
      ]
    }
  },
  {
    slug: "pos-system-for-small-businesses-kenya",
    meta: {
      title: "POS System for Small Businesses in Kenya That Handles Everything for You",
      description: "Looking for a POS system in Kenya that handles sales, payments, compliance, and daily reporting? See how businesses use Veira to run everything without dealing with software.",
      primaryKeyword: "POS system for small businesses in Kenya",
    },
    content: {
      headline: "A Simpler Way to Run Your Business",
      subheadline: "We help you sell, get paid, and stay organized without dealing with software.",
      sections: [
        {
          id: "intro",
          title: "Running a Business Should Not Feel This Hard",
          body: "Running a business in Kenya today is harder than it should be. You are expected to sell, manage stock, accept payments, stay eTIMS compliant, track performance, pay taxes, and still grow. Most business owners are told to just use software. The truth is most business owners do not want software. They want the work handled."
        }
      ],
      faqs: [
        {
          question: "What is the best POS system for small businesses in Kenya?",
          answer: "The best POS system is one that handles sales, payments, compliance, and reporting automatically without requiring constant management."
        },
        {
          question: "Is Veira eTIMS compliant?",
          answer: "Yes. Veira handles eTIMS compliance automatically through the POS."
        }
      ]
    }
  }
];

// --- Tool Configuration ---
interface ToolStep {
  id: string;
  label: string;
  type: 'select' | 'boolean' | 'number';
  options?: string[];
}

interface ToolConfig {
  slug: string;
  name: string;
  category: string;
  title: string;
  subheadline: string;
  steps: ToolStep[];
  cta: string;
  baseScore: number;
  intentLevel: 'medium' | 'high' | 'very_high';
}

interface ToolResult {
  status: 'Green' | 'Yellow' | 'Red';
  summary: string;
  steps: string[];
}

const AI_TOOLS_CONFIG: ToolConfig[] = [
  {
    slug: "inventory-risk-checker",
    name: "Inventory Risk Checker",
    category: "Operations",
    title: "Inventory Risk Checker",
    subheadline: "Identify stock losses or shortages before they hurt your bottom line.",
    steps: [
      { id: 'tracking', label: "How do you track your stock currently?", type: "select", options: ["Eye-balling", "Manual ledger", "Digital tool", "Not tracked"] },
      { id: 'outs', label: "How often do you experience stock-outs?", type: "select", options: ["Daily", "Weekly", "Monthly", "Rarely"] }
    ],
    cta: "Avoid stock losses with Veira's automated tracking.",
    baseScore: 40,
    intentLevel: 'high'
  },
  {
    slug: "etims-compliance-checker",
    name: "eTIMS Compliance Checker",
    category: "Compliance",
    title: "Free eTIMS Compliance Checker",
    subheadline: "Check your status in under 2 minutes. No signup required.",
    steps: [
      { id: 'type', label: "Select business type", type: "select", options: ["Retail", "Service", "Manufacturing", "Wholesale"] },
      { id: 'invoices', label: "Do you issue tax invoices?", type: "boolean" },
      { id: 'pos', label: "Do you use a POS system?", type: "boolean" }
    ],
    cta: "Want this handled automatically? Talk to Us",
    baseScore: 40,
    intentLevel: 'high'
  }
];

type AppView = 'landing' | 'pos' | 'tool' | 'blog';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
  const [activeBlogSlug, setActiveBlogSlug] = useState<string>(BLOG_POSTS[0].slug);
  const [toolStep, setToolStep] = useState(0);
  const [toolAnswers, setToolAnswers] = useState<Record<string, any>>({});
  const [toolResult, setToolResult] = useState<ToolResult | null>(null);
  
  const [numberInputValue, setNumberInputValue] = useState("");
  const [leadScore, setLeadScore] = useState(0);
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [drawerState, setDrawerState] = useState<{ isOpen: boolean; mode: 'code' | null; title: string; data: any; }>({ isOpen: false, mode: null, title: '', data: null });

  const updateScore = useCallback((points: number) => {
    setLeadScore(prev => Math.min(100, prev + points));
  }, []);

  const trackEvent = useCallback((event: string, data?: any) => {
    console.log(`[Analytics] ${event}`, data);
    if (event === 'cta_clicked') updateScore(EVENT_SCORES.CTA_CLICKED);
    if (event === 'whatsapp_clicked') updateScore(EVENT_SCORES.WHATSAPP_CLICKED);
    if (event === 'pos_page_visited') updateScore(EVENT_SCORES.POS_VISITED);
  }, [updateScore]);

  const leadLevel = useMemo(() => {
    if (leadScore >= SCORING_MODEL.HOT.min) return 'HOT';
    if (leadScore >= SCORING_MODEL.WARM.min) return 'WARM';
    return 'COLD';
  }, [leadScore]);

  const resetToLanding = () => {
    setView('landing');
    setActiveTool(null);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setNumberInputValue("");
    window.scrollTo(0, 0);
  };

  const showPOS = () => {
    setView('pos');
    setActiveTool(null);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setNumberInputValue("");
    window.scrollTo(0, 0);
    trackEvent('pos_page_visited');
  }

  const showBlog = (slug?: string) => {
    if (slug) setActiveBlogSlug(slug);
    setView('blog');
    window.scrollTo(0, 0);
  };

  const startTool = (tool: ToolConfig) => {
    trackEvent("tool_viewed", { tool: tool.slug });
    setActiveTool(tool);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setNumberInputValue("");
    setView('tool');
    window.scrollTo(0, 0);
  };

  const handleToolAnswer = (val: any) => {
    if (!activeTool) return;
    if (toolStep === 0) trackEvent("tool_started", { tool: activeTool.slug });

    const currentStepId = activeTool.steps[toolStep].id;
    const newAnswers = { ...toolAnswers, [currentStepId]: val };
    setToolAnswers(newAnswers);
    setNumberInputValue("");

    if (toolStep < activeTool.steps.length - 1) {
      setToolStep(toolStep + 1);
    } else {
      processToolResult(newAnswers);
    }
  };

  const handleInternalLink = (link: string) => {
    if (!link || link === '/') return;
    if (link === '/pos') { showPOS(); return; }
    if (link === '/ai-tools') { resetToLanding(); return; }
    if (link === '/talk-to-us' || link === '/contact') { trackEvent('cta_clicked'); return; }
    
    const parts = link.split('/');
    const slug = parts[parts.length - 1];
    const tool = AI_TOOLS_CONFIG.find(t => t.slug === slug);
    if (tool) { startTool(tool); } else if (link.startsWith('/ai-tools')) { resetToLanding(); }
  };

  const processToolResult = async (answers: Record<string, any>) => {
    if (!activeTool) return;
    setIsLoading(true);
    
    const isNewTool = !completedTools.has(activeTool.slug);
    if (isNewTool) {
      const toolPoints = activeTool.baseScore + EVENT_SCORES.TOOL_COMPLETED;
      const multiPoints = completedTools.size > 0 ? EVENT_SCORES.MULTIPLE_TOOLS_USED : 0;
      updateScore(toolPoints + multiPoints);
      setCompletedTools(prev => new Set(prev).add(activeTool.slug));
    }

    trackEvent("tool_completed", { tool: activeTool.slug });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an AI Business Assistant for a Kenyan fintech platform called Veira.
        Analyze this data for the "${activeTool.name}" tool:
        ${JSON.stringify(answers, null, 2)}
        
        Provide a JSON response with:
        1. "status": "Green" (Good/Compliant), "Yellow" (Needs Attention), or "Red" (Action Required).
        2. "summary": A clear 2-3 sentence plain English summary of the situation, specifically for a Kenyan business owner. Mention KRA requirements where relevant.
        3. "steps": An array of 3 clear, actionable next steps for the owner.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(response.text || '{}') as ToolResult;
      setToolResult(data);
    } catch (e) {
      console.error(e);
      setToolResult({
        status: 'Yellow',
        summary: "We couldn't generate a personalized report right now. Most businesses in this category should prioritize compliance and record keeping.",
        steps: ["Ensure all sales are logged", "Check your KRA portal status", "Talk to our support team"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const toolName = activeTool?.name || "Veira POS";
    const message = `Hi Veira, I'm interested in learning more about your services. (Referencing: ${toolName})`;
    const encoded = encodeURIComponent(message);
    trackEvent("whatsapp_clicked", { tool: activeTool?.slug || "general" });
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encoded}`, '_blank');
  };

  const activeBlog = useMemo(() => BLOG_POSTS.find(p => p.slug === activeBlogSlug) || BLOG_POSTS[0], [activeBlogSlug]);
  const otherPosts = useMemo(() => BLOG_POSTS.filter(p => p.slug !== activeBlogSlug), [activeBlogSlug]);

  const toolsByCategory = useMemo(() => {
    const categories: Record<string, ToolConfig[]> = {};
    AI_TOOLS_CONFIG.forEach(tool => {
      if (!categories[tool.category]) categories[tool.category] = [];
      categories[tool.category].push(tool);
    });
    return categories;
  }, []);

  return (
    <div className="saas-container">
        <nav className="saas-nav">
            <div className="nav-left">
                <div className="saas-logo" onClick={resetToLanding} style={{cursor: 'pointer'}}>Veira</div>
            </div>
            <div className="nav-center">
                <div className="nav-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Agents</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Cloud</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Apps</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Use Cases</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Our Story</a>
                </div>
            </div>
            <div className="nav-right">
                <button className="nav-cta" onClick={() => handleInternalLink('/contact')}>Talk to Us</button>
            </div>
        </nav>

        <SideDrawer isOpen={drawerState.isOpen} onClose={() => setDrawerState(s => ({...s, isOpen: false}))} title={drawerState.title}>
            {drawerState.mode === 'code' && <pre className="code-block"><code>{drawerState.data}</code></pre>}
        </SideDrawer>

        <main className="saas-main">
            <DottedGlowBackground gap={32} radius={0.5} color="rgba(255,255,255,0.05)" glowColor="rgba(255,255,255,0.15)" speedScale={0.1} />

            {view === 'landing' && (
              <>
                <section className="saas-hero">
                  <div className="hero-badge">As Featured on Daily Nation</div>
                  <h1>A simpler way to run your business</h1>
                  <p className="hero-supporting">We help you sell, get paid, and stay organized without dealing with software.</p>
                  <p className="hero-subtext">POS, payments, websites, apps, and automation handled for you.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={() => handleInternalLink('/pos')}>Get POS</button>
                    <button className="secondary-btn" onClick={() => handleInternalLink('/contact')}>Talk to Us</button>
                  </div>
                </section>

                <section className="trust-bar">
                  <p>Trusted by growing businesses and partners across Kenya</p>
                  <div className="partner-logos">
                    <div className="partner-logo">M-PESA</div>
                    <div className="partner-logo">eTIMS</div>
                    <div className="partner-logo">KRA</div>
                    <div className="partner-logo">VISA</div>
                    <div className="partner-logo">MASTERCARD</div>
                  </div>
                </section>

                <section className="who-its-for">
                  <div className="section-header">
                    <h3>Built for businesses that want less stress</h3>
                  </div>
                  <div className="industry-grid">
                    {[
                      "Restaurants and cafés",
                      "Retail and liquor stores",
                      "Salons and service businesses",
                      "Clinics and pharmacies",
                      "Hotels and tourism businesses"
                    ].map((industry, i) => (
                      <div key={i} className="industry-card">
                        <div className="industry-icon" aria-hidden="true"><SparklesIcon /></div>
                        <p>{industry}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="problem-solution-block">
                  <div className="block-half problem">
                    <h3>Running a business shouldn’t feel this complicated</h3>
                    <ul className="points-list">
                      <li>Too many disconnected systems</li>
                      <li>No clear daily visibility</li>
                      <li>Manual reporting and follow-ups</li>
                      <li>Software becoming extra work</li>
                    </ul>
                  </div>
                  <div className="block-half solution">
                    <h3>What changes with Veira</h3>
                    <ul className="points-list success">
                      <li>Sales and payments work smoothly</li>
                      <li>Everything stays organized automatically</li>
                      <li>Daily performance visibility without chasing reports</li>
                      <li>Less admin, more focus on customers</li>
                    </ul>
                  </div>
                </section>

                <section className="testimonials">
                  <div className="section-header">
                    <h3>Business owners like you</h3>
                  </div>
                  <div className="testimonial-grid">
                    <div className="testimonial-card">
                      <p className="quote">"I finally see my business clearly without calling anyone."</p>
                      <p className="author">Restaurant Owner</p>
                    </div>
                    <div className="testimonial-card">
                      <p className="quote">"Payments and reports just work. I don’t think about the system anymore."</p>
                      <p className="author">Retail Store Manager</p>
                    </div>
                  </div>
                </section>

                <section className="tools-showcase">
                  <div className="section-header">
                    <h2>Free AI Business Tools</h2>
                    <p>Quick checks to help Kenyan business owners stay compliant and organized.</p>
                  </div>
                  
                  {(Object.entries(toolsByCategory) as [string, ToolConfig[]][]).map(([category, tools]) => (
                    <div key={category} className="tool-category-group">
                      <h3 className="category-title">{category}</h3>
                      <div className="tools-grid">
                        {tools.map((tool: ToolConfig) => (
                          <div key={tool.slug} className="tool-card" onClick={() => startTool(tool)}>
                            <div className="tool-icon" aria-hidden="true"><SparklesIcon /></div>
                            <div className="tool-content">
                              <h4>{tool.name}</h4>
                              <p>{tool.subheadline}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="whats-included">
                  <div className="section-header">
                    <h3>Everything you need, handled for you</h3>
                  </div>
                  <div className="features-grid">
                    {[
                      "POS and payments",
                      "Websites and apps",
                      "Cloud reliability",
                      "Automation and reporting"
                    ].map((feature, i) => (
                      <div key={i} className="feature-card">
                        <h4>{feature}</h4>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="trust-details">
                  <div className="section-header">
                    <h3>Built for reliability and compliance</h3>
                  </div>
                  <div className="details-grid">
                    {[
                      "Secure payment processing",
                      "eTIMS compliant",
                      "Ongoing support",
                      "Designed for growing businesses"
                    ].map((point, i) => (
                      <div key={i} className="detail-item">
                        <span className="dot" aria-hidden="true"></span>
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="primary-cta">
                  <h2>Ready to simplify how your business runs?</h2>
                  <div className="cta-actions">
                    <button className="primary-btn" onClick={() => handleInternalLink('/contact')}>Get POS</button>
                    <button className="secondary-btn" onClick={() => handleInternalLink('/contact')}>Talk to Us</button>
                  </div>
                </section>
              </>
            )}

            {view === 'pos' && (
              <>
                <section className="saas-hero">
                  <h1>POS that runs quietly in the background</h1>
                  <p className="hero-supporting">Sell, get paid, and stay compliant without dealing with software.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={() => handleInternalLink('/contact')}>Get POS</button>
                    <button className="secondary-btn" onClick={() => handleInternalLink('/contact')}>Talk to Us</button>
                  </div>
                </section>

                <section className="trust-bar">
                  <p>Built for Kenyan businesses. Secure. eTIMS compliant.</p>
                  <div className="partner-logos">
                    <div className="partner-logo">eTIMS</div>
                    <div className="partner-logo">PCI SECURE</div>
                    <div className="partner-logo">M-PESA</div>
                    <div className="partner-logo">VISA</div>
                    <div className="partner-logo">KRA</div>
                  </div>
                </section>

                <section className="hardware-section" style={{ width: '100%', maxWidth: 'var(--container-width)', padding: 'var(--section-padding) clamp(1.5rem, 5vw, 2.5rem)' }}>
                  <div className="block-half solution" style={{ background: '#0a0a0a', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="hardware-content">
                      <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Android Smart POS to get started</h3>
                      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        You receive a modern Android Smart POS device configured with Veira software so you can start selling immediately.
                      </p>
                      <ul className="points-list success" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <li>Android-based Smart POS device</li>
                        <li>Built-in receipt printer</li>
                        <li>Supports cards, mobile money, and NFC</li>
                        <li>Designed for all-day business use</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="who-its-for">
                  <div className="section-header">
                    <h3>Built for everyday businesses</h3>
                  </div>
                  <div className="industry-grid">
                    {[
                      "Restaurants and cafés",
                      "Retail and liquor stores",
                      "Salons and service businesses",
                      "Clinics and pharmacies",
                      "Hotels and tourism businesses"
                    ].map((industry, i) => (
                      <div key={i} className="industry-card">
                        <div className="industry-icon" aria-hidden="true"><SparklesIcon /></div>
                        <p>{industry}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="problem-solution-block">
                  <div className="block-half problem">
                    <h3>Why POS systems usually become a headache</h3>
                    <ul className="points-list">
                      <li>Compliance handled separately</li>
                      <li>Payments that need constant checking</li>
                      <li>Manual end-of-day reconciliation</li>
                      <li>Owners chasing numbers instead of running the business</li>
                    </ul>
                  </div>
                  <div className="block-half solution">
                    <h3>What changes with Veira POS</h3>
                    <ul className="points-list success">
                      <li>Sales and payments are processed securely</li>
                      <li>Transactions sync automatically to the cloud</li>
                      <li>Compliance runs quietly in the background</li>
                      <li>Owners get clarity without logging into dashboards</li>
                    </ul>
                  </div>
                </section>

                <section className="ai-ops-section" style={{ width: '100%', maxWidth: 'var(--container-width)', padding: 'var(--section-padding) clamp(1.5rem, 5vw, 2.5rem)' }}>
                  <div className="section-header">
                    <h3>Your business watches itself</h3>
                    <p style={{ maxWidth: '700px', margin: '1rem auto 3rem auto' }}>Veira uses intelligent systems to monitor sales, payments, and activity so issues are spotted early and reporting happens automatically.</p>
                  </div>
                  <div className="features-grid">
                    {[
                      { title: "WhatsApp Summaries", body: "Daily sales summaries sent to the owner on WhatsApp" },
                      { title: "Payment Performance", body: "Automatic tracking of payment performance" },
                      { title: "Anomaly Detection", body: "Early detection of unusual activity" },
                      { title: "Fraud Protection", body: "Continuous transaction monitoring to reduce fraud" }
                    ].map((benefit, i) => (
                      <div key={i} className="feature-card">
                        <h4 style={{ marginBottom: '0.75rem' }}>{benefit.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{benefit.body}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="cloud-section" style={{ width: '100%', maxWidth: 'var(--container-width)', padding: 'var(--section-padding) clamp(1.5rem, 5vw, 2.5rem)' }}>
                  <div className="block-half solution" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Cloud-based and always in sync</h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                      All transactions and reports are securely stored in the cloud, giving you visibility across locations and peace of mind as you grow.
                    </p>
                    <div className="details-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      {[
                        "Access performance from anywhere",
                        "Automatic backups",
                        "Reliable even during busy periods"
                      ].map((point, i) => (
                        <div key={i} className="detail-item">
                          <span className="dot" aria-hidden="true"></span>
                          <p style={{ fontSize: '0.95rem' }}>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="pricing-section" style={{ width: '100%', maxWidth: 'var(--container-width)', padding: 'var(--section-padding) clamp(1.5rem, 5vw, 2.5rem)' }}>
                  <div className="section-header">
                    <h3>Simple, aligned pricing</h3>
                    <p style={{ maxWidth: '600px', margin: '1rem auto' }}>We process payments for you and charge a simple percentage of revenue. This means we only succeed when your business does.</p>
                  </div>
                  <div className="testimonial-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', border: '1px solid #fff' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Revenue Based</span>
                    <div style={{ fontSize: '4rem', fontWeight: '800', margin: '1.5rem 0' }}>1.5%</div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Everything included, no hidden fees.</p>
                    <div style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto' }}>
                      <ul className="points-list success">
                        <li>Payment processing</li>
                        <li>Fraud monitoring</li>
                        <li>POS software</li>
                        <li>Cloud infrastructure</li>
                        <li>Ongoing support</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="testimonials">
                  <div className="section-header">
                    <h3>What business owners say</h3>
                  </div>
                  <div className="testimonial-grid">
                    <div className="testimonial-card">
                      <p className="quote">"I just receive my sales on WhatsApp. I don’t chase reports anymore."</p>
                      <p className="author">Restaurant Owner</p>
                    </div>
                    <div className="testimonial-card">
                      <p className="quote">"Payments, compliance, and reporting stopped being daily stress."</p>
                      <p className="author">Retail Business Owner</p>
                    </div>
                  </div>
                </section>

                <section className="primary-cta">
                  <h2>Start selling with clarity and confidence</h2>
                  <div className="cta-actions">
                    <button className="primary-btn" onClick={() => handleInternalLink('/contact')}>Get POS</button>
                    <button className="secondary-btn" onClick={() => handleInternalLink('/contact')}>Talk to Us</button>
                  </div>
                </section>

                <section className="blog-post-view" style={{ padding: '4rem clamp(1.5rem, 5vw, 2.5rem)' }}>
                  <div className="section-header">
                    <h3>Frequently asked questions</h3>
                  </div>
                  <div className="faq-list">
                    <FAQItem faq={{ question: "Is Veira POS eTIMS compliant?", answer: "Yes. The system is designed to support Kenya’s eTIMS requirements." }} />
                    <FAQItem faq={{ question: "Do I get a POS device?", answer: "Yes. You receive an Android Smart POS device configured and ready to use." }} />
                    <FAQItem faq={{ question: "How do I receive my sales reports?", answer: "You receive an automatic daily sales summary on WhatsApp." }} />
                    <FAQItem faq={{ question: "How does pricing work?", answer: "We charge a simple 1.5% of processed revenue, which covers payments, fraud monitoring, software, and support." }} />
                  </div>
                </section>
              </>
            )}

            {view === 'tool' && activeTool && (
              <section className="tool-view-container">
                <div className="tool-hero">
                  <h1>{activeTool.title}</h1>
                  <p>{activeTool.subheadline}</p>
                </div>

                {!toolResult ? (
                  <div className="tool-form-card">
                    <div className="progress-info">
                      Step {toolStep + 1} of {activeTool.steps.length}
                      <div className="progress-bar-bg" aria-hidden="true">
                        <div className="progress-bar-fill" style={{ width: `${((toolStep + 1) / activeTool.steps.length) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="form-question">
                      <label>{activeTool.steps[toolStep].label}</label>
                      {activeTool.steps[toolStep].type === 'boolean' && (
                        <div className="input-options-grid">
                          <button className="option-pill" onClick={() => handleToolAnswer("Yes")}>Yes</button>
                          <button className="option-pill" onClick={() => handleToolAnswer("No")}>No</button>
                        </div>
                      )}
                      {activeTool.steps[toolStep].type === 'select' && (
                        <div className="input-options-grid">
                          {activeTool.steps[toolStep].options?.map(opt => (
                            <button key={opt} className="option-pill" onClick={() => handleToolAnswer(opt)}>{opt}</button>
                          ))}
                        </div>
                      )}
                      {activeTool.steps[toolStep].type === 'number' && (
                        <div className="number-input-wrap">
                          <input 
                            type="number" 
                            autoFocus 
                            placeholder="Enter a number..."
                            value={numberInputValue}
                            onChange={(e) => setNumberInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && numberInputValue) handleToolAnswer(numberInputValue); }}
                          />
                          <button 
                            className="continue-btn" 
                            disabled={!numberInputValue}
                            onClick={() => handleToolAnswer(numberInputValue)}
                            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                          >
                            {isLoading ? <ThinkingIcon /> : "Continue →"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="result-container">
                    <div className="result-card">
                      <div className="result-header">
                        <h2>Your Business Report</h2>
                        <div className={`status-badge status-${toolResult.status.toLowerCase()}`}>
                          {toolResult.status}
                        </div>
                      </div>
                      <div className="result-body">
                        <p className="summary-text">{toolResult.summary}</p>
                        <div className="next-steps">
                          <h3>Action Items:</h3>
                          <ul>{(toolResult.steps || []).map((step, i) => <li key={i}>{step}</li>)}</ul>
                        </div>
                      </div>
                    </div>

                    <div className={`upgrade-cta-card lead-level-${leadLevel.toLowerCase()}`}>
                      {leadLevel === 'HOT' && (
                        <div className="hot-intent-header">
                          <div className="urgent-badge">Action Recommended</div>
                          <h3>Our team is ready to help you scale.</h3>
                        </div>
                      )}
                      {leadLevel === 'WARM' && <h3>Ready to take the next step?</h3>}
                      {leadLevel === 'COLD' && <h3>Want to learn more about running a business?</h3>}
                      <div className="cta-actions">
                        <button className="primary-btn" onClick={() => handleInternalLink('/contact')}>Get Free POS</button>
                        {(leadLevel === 'WARM' || leadLevel === 'HOT') && (
                          <button className="secondary-btn whatsapp-btn" onClick={handleWhatsApp}>WhatsApp Us</button>
                        )}
                        <button className="secondary-btn" onClick={() => handleInternalLink('/contact')}>Talk to Us</button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {view === 'blog' && (
              <section className="blog-post-view">
                <header className="blog-header">
                  <h1>{activeBlog.content.headline}</h1>
                  {activeBlog.content.subheadline && <p className="subheadline">{activeBlog.content.subheadline}</p>}
                </header>
                <div className="blog-body">
                  {activeBlog.content.sections.map((section) => (
                    <article key={section.id} id={section.id} className="blog-section">
                      <h2>{section.title}</h2>
                      <p>{section.body}</p>
                      <div className="internal-links-container">
                        {section.internalLinks?.map((link, idx) => (
                          <button key={idx} className="inline-tool-btn" onClick={() => handleInternalLink(link)}>
                            {(link.split('/').pop() || '').replace(/-/g, ' ')} →
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                  <section className="blog-faq">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                      {activeBlog.content.faqs.map((faq, i) => <FAQItem key={i} faq={faq} />)}
                    </div>
                  </section>
                </div>
                <div className="blog-footer-cta">
                  <h3>Ready for a simpler way to run your business?</h3>
                  <button className="primary-btn" onClick={() => handleInternalLink('/contact')}>Get Free POS</button>
                </div>
              </section>
            )}
        </main>

        <footer className="saas-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="saas-logo" onClick={resetToLanding} style={{cursor:'pointer'}}>Veira</div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                        Managed business systems for selling, payments, and operations.
                    </p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kenya</p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Product</h4>
                        <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Agents</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Cloud</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Apps</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Use Cases</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Our Story</a>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <a href="#" onClick={(e) => { e.preventDefault(); resetToLanding(); }}>AI Tools</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); showBlog(); }}>Blog</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleInternalLink('/contact'); }}>Contact</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
                    </div>
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <a href="#" onClick={handleWhatsApp}>WhatsApp</a>
                        <a href="https://www.linkedin.com/company/veira" target="_blank">LinkedIn</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Veira HQ. All rights reserved. Registered in Kenya.
            </div>
        </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
