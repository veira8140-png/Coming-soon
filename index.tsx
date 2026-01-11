
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

import DottedGlowBackground from './components/DottedGlowBackground';
import SideDrawer from './components/SideDrawer';
import OrganicOrbLogo from './components/OrganicOrbLogo';
import { 
    ThinkingIcon, 
    SparklesIcon,
    MenuIcon,
    XIcon,
    CodeIcon
} from './components/Icons';

const WHATSAPP_NUMBER = "+254755792377"; // Updated as per CTA spec

// --- Lead Scoring & Analytics ---
const EVENT_SCORES = {
  TOOL_COMPLETED: 20,
  CTA_CLICKED: 25,
  WHATSAPP_CLICKED: 30,
  POS_VISITED: 20,
};

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
}

interface ToolResult {
  status: 'Green' | 'Yellow' | 'Red';
  summary: string;
  steps: string[];
}

const STATIC_TOOLS: ToolConfig[] = [
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
    cta: "Avoid stock losses with Veira.",
    baseScore: 40
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
    cta: "Get compliant with Veira.",
    baseScore: 40
  }
];

const AGENT_DATA = [
  {
    name: "Glenn",
    role: "Support & Follow-Up Agent",
    description: "Glenn manages customer support and follow-ups across all communication channels, ensuring fast responses and zero dropped requests.",
    voice: ["Answer incoming customer support calls", "Triage issues and provide accurate information", "Route complex cases to human teams"],
    text: ["Respond on WhatsApp and social media DMs", "Handle FAQs and ticket status checks", "Send follow-ups and reminders"],
    triggers: ["Check my last ticket", "What’s the status of my issue?", "Send a follow-up to client X"]
  },
  {
    name: "Svan",
    role: "Sales & Marketing Agent",
    description: "Svan drives growth by qualifying leads, engaging prospects, and booking appointments across inbound channels.",
    voice: ["Qualify inbound sales leads", "Answer product and pricing questions", "Book demos and consultations"],
    text: ["Respond to leads on WhatsApp & Instagram", "Capture lead details and requirements", "Send promotional messages"],
    triggers: ["Schedule a consultation for tomorrow", "Message leads about a promotion", "Qualify this lead"]
  },
  {
    name: "Tat",
    role: "Operational & Transaction Agent",
    description: "Tat executes operational tasks and financial workflows with precision, giving business owners real-time control.",
    voice: ["Answer operational queries", "Run sales and performance reports", "Confirm and execute actions"],
    text: ["Accept commands via WhatsApp & Slack", "Send invoices and receipts", "Check inventory and approve payments"],
    triggers: ["Send invoice to client Y", "Check stock levels", "Approve payment"]
  }
];

type AppView = 'landing' | 'pos' | 'tool' | 'agents';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
  const [toolStep, setToolStep] = useState(0);
  const [toolAnswers, setToolAnswers] = useState<Record<string, any>>({});
  const [toolResult, setToolResult] = useState<ToolResult | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadScore, setLeadScore] = useState(0);

  const updateScore = useCallback((points: number) => {
    setLeadScore(prev => Math.min(100, prev + points));
  }, []);

  const trackEvent = useCallback((event: string, data?: any) => {
    console.log(`[Analytics] ${event}`, data);
    const win = window as any;
    if (win.gtag) win.gtag('event', event, data);
    if (event === 'cta_clicked') updateScore(EVENT_SCORES.CTA_CLICKED);
    if (event === 'whatsapp_clicked') updateScore(EVENT_SCORES.WHATSAPP_CLICKED);
  }, [updateScore]);

  const resetToLanding = useCallback(() => {
    setView('landing');
    setActiveTool(null);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showPOS = useCallback(() => {
    setView('pos');
    setActiveTool(null);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('pos_page_visited');
  }, [trackEvent]);

  const showAgents = useCallback(() => {
    setView('agents');
    setActiveTool(null);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('agents_page_visited');
  }, [trackEvent]);

  const startTool = useCallback((tool: ToolConfig) => {
    setActiveTool(tool);
    setToolStep(0);
    setToolAnswers({});
    setToolResult(null);
    setView('tool');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent("tool_viewed", { tool: tool.slug });
  }, [trackEvent]);

  const handleToolAnswer = useCallback((val: any) => {
    if (!activeTool) return;
    const currentStepId = activeTool.steps[toolStep].id;
    setToolAnswers(prev => {
        const next = { ...prev, [currentStepId]: val };
        if (toolStep >= activeTool.steps.length - 1) {
            setTimeout(() => processToolResult(next), 0);
        }
        return next;
    });

    if (toolStep < activeTool.steps.length - 1) {
      setToolStep(toolStep + 1);
    }
  }, [activeTool, toolStep]);

  const processToolResult = async (answers: Record<string, any>) => {
    if (!activeTool) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze: ${JSON.stringify(answers)}. Context: Veira, Kenyan fintech. Return JSON: status (Green/Yellow/Red), summary, steps (array).`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      setToolResult(JSON.parse(response.text || '{}'));
    } catch (e) {
      setToolResult({
        status: 'Yellow',
        summary: "Assessment complete. Most businesses in your category should prioritize digital record keeping.",
        steps: ["Review your eTIMS status", "Automate sales logging", "Contact Veira for a full audit"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent("Hi Veira, I'm interested in learning more about your AI Agents.");
    trackEvent("whatsapp_clicked");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  }, [trackEvent]);

  // Partners for the slide show
  const partners = ["M-PESA", "eTIMS", "KRA", "VISA", "MASTERCARD", "STRIPE", "CHASE", "REVOLUT"];

  // Responsive sizes based on CSS variables
  const getOrbSize = () => window.innerWidth <= 900 ? 22 : 32;

  return (
    <div className="saas-container">
        {/* Unified Navigation */}
        <nav className="saas-nav">
            <div className="logo-link-container" onClick={resetToLanding}>
                <OrganicOrbLogo size={getOrbSize()} variant="nav" />
                <span className="saas-logo">Veira</span>
            </div>
            
            <div className="nav-center">
                <div className="nav-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); showAgents(); }}>Agents</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Cloud</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Apps</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Use Cases</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Our Story</a>
                </div>
            </div>
            
            <div className="nav-right">
                <button className="nav-cta hide-mobile" onClick={() => trackEvent('cta_clicked')}>Talk to Us</button>
                <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-links">
                <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS Systems</a>
                <a href="#" onClick={(e) => { e.preventDefault(); showAgents(); }}>AI Agents</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>Cloud Infra</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>Apps</a>
                <button className="primary-btn" style={{ marginTop: '2rem', width: '200px' }} onClick={handleWhatsApp}>WhatsApp Us</button>
            </div>
        </div>

        <main className="saas-main">
            <DottedGlowBackground gap={32} radius={0.5} color="rgba(255,255,255,0.03)" glowColor="rgba(255,255,255,0.08)" speedScale={0.1} />

            {view === 'landing' && (
              <>
                <section className="saas-hero reveal">
                  <h1>Simpler systems for modern business.</h1>
                  <p className="hero-supporting">We handle the POS, the payments, and the compliance. You handle the growth.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={showPOS}>Explore POS</button>
                    <button className="secondary-btn" onClick={() => trackEvent('cta_clicked')}>Book a Demo</button>
                  </div>
                </section>

                <section className="trust-bar reveal">
                    <p>Standardized by innovators</p>
                    <div className="marquee-container">
                        <div className="marquee-content">
                            {/* Original set */}
                            {partners.map((partner, idx) => (
                                <div key={`p1-${idx}`} className="partner-logo">{partner}</div>
                            ))}
                            {/* Duplicate set for infinite loop */}
                            {partners.map((partner, idx) => (
                                <div key={`p2-${idx}`} className="partner-logo">{partner}</div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="features-section reveal">
                    <div className="section-header">
                        <h2>Managed Intelligence</h2>
                        <p>Everything you need to run, quietly handled by Veira.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h4>Quiet Operations</h4>
                            <p>Systems that sync in the background so you never have to chase a report again.</p>
                        </div>
                        <div className="feature-card">
                            <h4>Total Compliance</h4>
                            <p>Built-in KRA eTIMS validation for every transaction, handled automatically.</p>
                        </div>
                        <div className="feature-card">
                            <h4>Cloud-First</h4>
                            <p>Access your business performance from anywhere, on any device, in real-time.</p>
                        </div>
                    </div>
                </section>

                <section className="tools-showcase reveal">
                  <div className="section-header">
                    <h2>Business Audit Tools</h2>
                    <p>Professional checks for the modern commercial operator.</p>
                  </div>
                  <div className="tools-grid">
                    {STATIC_TOOLS.map((tool) => (
                      <div key={tool.slug} className="tool-card" onClick={() => startTool(tool)}>
                        <div className="tool-content">
                          <h4>{tool.name}</h4>
                          <p>{tool.subheadline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="primary-cta reveal">
                  <h2>Ready for better systems?</h2>
                  <div className="cta-actions">
                    <button className="primary-btn" onClick={() => trackEvent('cta_clicked')}>Talk to Us</button>
                    <button className="secondary-btn" onClick={handleWhatsApp}>WhatsApp</button>
                  </div>
                </section>
              </>
            )}

            {view === 'pos' && (
              <section className="saas-hero reveal">
                <h1>Operational Clarity.</h1>
                <p className="hero-supporting">Our Android Smart POS is designed to handle high-volume sales without the technical overhead.</p>
                <div className="hero-actions">
                    <button className="primary-btn" onClick={() => trackEvent('cta_clicked')}>Order Device</button>
                    <button className="secondary-btn" onClick={resetToLanding}>Go Back</button>
                </div>
              </section>
            )}

            {view === 'agents' && (
              <div className="agents-page reveal">
                <section className="saas-hero">
                  <h1>AI Agents That Work Across Voice, WhatsApp, and Your Systems</h1>
                  <p className="hero-supporting">Veira agents handle sales, support, and operations across every channel your customers and team already use.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={handleWhatsApp}>Talk to Veira Agents</button>
                    <button className="secondary-btn" onClick={showPOS}>Book a Demo</button>
                  </div>
                </section>

                <section className="agents-grid-container">
                    <div className="section-header">
                        <h2>The Specialized Agent Team</h2>
                        <p>One AI system. Multiple specialized agents designed for real business work.</p>
                    </div>
                    <div className="agents-grid">
                        {AGENT_DATA.map((agent) => (
                            <div key={agent.name} className="agent-card">
                                <div className="agent-header">
                                    <div className="agent-meta">
                                        <h3>{agent.name}</h3>
                                        <span className="agent-role">{agent.role}</span>
                                    </div>
                                </div>
                                <p className="agent-desc">{agent.description}</p>
                                
                                <div className="agent-capabilities">
                                    <div className="cap-section">
                                        <h5><ThinkingIcon /> Voice Capabilities</h5>
                                        <ul>{agent.voice.map((v, i) => <li key={i}>{v}</li>)}</ul>
                                    </div>
                                    <div className="cap-section">
                                        <h5><CodeIcon /> Text & Digital</h5>
                                        <ul>{agent.text.map((t, i) => <li key={i}>{t}</li>)}</ul>
                                    </div>
                                </div>

                                <div className="agent-triggers">
                                    <h5>Triggers:</h5>
                                    <div className="trigger-pills">
                                        {agent.triggers.map((trig, i) => (
                                            <span key={i} className="trigger-pill">"{trig}"</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="system-benefits reveal">
                    <div className="benefits-card">
                        <h3>Built for Scaling Businesses</h3>
                        <ul className="benefits-list">
                            <li>Works across voice, WhatsApp, social DMs, and internal tools</li>
                            <li>Logs every action automatically in your central dashboard</li>
                            <li>Escalates to humans seamlessly when complex issues arise</li>
                            <li>Integrates directly with POS, CRM, and payment systems</li>
                            <li>Native support for Kenyan business compliance workflows</li>
                        </ul>
                    </div>
                </section>

                <section className="primary-cta reveal">
                  <h2>Start Automating Today</h2>
                  <div className="cta-actions">
                    <button className="primary-btn" onClick={handleWhatsApp}>Talk to Veira Agents</button>
                    <button className="secondary-btn" onClick={resetToLanding}>Return Home</button>
                  </div>
                </section>
              </div>
            )}

            {view === 'tool' && activeTool && (
                <section className="tool-view-container reveal">
                    <div className="tool-hero">
                        <h1>{activeTool.title}</h1>
                        <p>{activeTool.subheadline}</p>
                    </div>

                    {!toolResult ? (
                         <div className="tool-form-card">
                            <div className="form-question">
                                <label>{activeTool.steps[toolStep].label}</label>
                                <div className="input-options-grid">
                                    {activeTool.steps[toolStep].type === 'select' ? (
                                        activeTool.steps[toolStep].options?.map(opt => (
                                            <button key={opt} className="option-pill" onClick={() => handleToolAnswer(opt)}>{opt}</button>
                                        ))
                                    ) : (
                                        <>
                                            <button className="option-pill" onClick={() => handleToolAnswer("Yes")}>Yes</button>
                                            <button className="option-pill" onClick={() => handleToolAnswer("No")}>No</button>
                                        </>
                                    )}
                                </div>
                            </div>
                         </div>
                    ) : (
                        <div className="result-container">
                            <div className="result-card">
                                <h2>Audit Summary</h2>
                                <p className={`status-badge status-${toolResult.status.toLowerCase()}`}>{toolResult.status}</p>
                                <p>{toolResult.summary}</p>
                                <div className="next-steps">
                                    <h3>Recommended Actions:</h3>
                                    <ul>{toolResult.steps.map((s,i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                                <button className="primary-btn" style={{ marginTop: '2rem' }} onClick={resetToLanding}>Back to Dashboard</button>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>

        <footer className="saas-footer reveal">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="logo-link-container" style={{ cursor: 'default' }}>
                        <OrganicOrbLogo size={28} variant="nav" />
                        <span className="saas-logo">Veira</span>
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Managed business systems for the modern commercial operator.
                    </p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); showAgents(); }}>Agents</a>
                        <a href="#">Cloud</a>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <a href="#" onClick={(e) => { e.preventDefault(); resetToLanding(); }}>Tools</a>
                        <a href="#">Privacy</a>
                    </div>
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <a href="#" onClick={handleWhatsApp}>WhatsApp</a>
                        <a href="https://linkedin.com/company/veira" target="_blank">LinkedIn</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Veira Systems. High-Performance Enterprise.
            </div>
        </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
