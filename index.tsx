
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
    XIcon
} from './components/Icons';

const WHATSAPP_NUMBER = "+254700000000";

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

type AppView = 'landing' | 'pos' | 'tool';

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
      const prompt = `Analyze business state: ${JSON.stringify(answers)}. Status: Green/Yellow/Red. Summary (2 sentences). 3 next steps. Format as JSON.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      setToolResult(JSON.parse(response.text || '{}'));
    } catch (e) {
      setToolResult({
        status: 'Yellow',
        summary: "Assessment complete. Your business shows potential for operational optimization through digital systems.",
        steps: ["Review inventory logging frequency", "Audit tax compliance workflows", "Consult with Veira for automated tools"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent("Hi Veira, I'm interested in modernizing my business operations.");
    trackEvent("whatsapp_clicked");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  }, [trackEvent]);

  return (
    <div className="saas-container">
        {/* Navigation - Guaranteed Single Instance */}
        <nav className="saas-nav">
            <div className="nav-left" onClick={resetToLanding} style={{ cursor: 'pointer' }}>
                <OrganicOrbLogo size={32} />
                <span className="saas-logo">Veira</span>
            </div>
            
            <div className="nav-center">
                <div className="nav-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS</a>
                    <a href="https://veirahq.com/agents" target="_blank">Agents</a>
                    <a href="https://veirahq.com/cloud" target="_blank">Cloud</a>
                    <a href="https://veirahq.com/usecases" target="_blank">Cases</a>
                    <a href="https://veirahq.com/ourstory" target="_blank">Story</a>
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
            <button className="mobile-toggle" style={{ position: 'absolute', top: '24px', right: '24px' }} onClick={() => setIsMobileMenuOpen(false)}>
                <XIcon />
            </button>
            <div className="mobile-menu-links">
                <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS Systems</a>
                <a href="#" onClick={(e) => { e.preventDefault(); resetToLanding(); }}>Audit Tools</a>
                <a href="https://veirahq.com/agents" target="_blank">Agents</a>
                <a href="https://veirahq.com/cloud" target="_blank">Cloud Infrastructure</a>
                <button className="primary-btn" style={{ marginTop: '2rem' }} onClick={handleWhatsApp}>WhatsApp Us</button>
            </div>
        </div>

        {/* Main Content Area */}
        <main className="saas-main">
            <DottedGlowBackground gap={32} radius={0.5} color="rgba(255,255,255,0.02)" glowColor="rgba(255,255,255,0.05)" speedScale={0.05} />

            {view === 'landing' && (
              <>
                <section className="saas-hero reveal">
                  <div className="hero-badge">A Better Way to Sell</div>
                  <h1>Simpler systems for modern business.</h1>
                  <p className="hero-supporting">Managed operations for high-growth commerce. We handle the hardware, payments, and compliance.</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={showPOS}>Explore POS</button>
                    <button className="secondary-btn" onClick={() => trackEvent('cta_clicked')}>Talk to Us</button>
                  </div>
                </section>

                <section className="trust-bar reveal">
                    <p>Powered by global infrastructure</p>
                    <div className="partner-logos">
                        <div className="partner-logo">M-PESA</div>
                        <div className="partner-logo">eTIMS</div>
                        <div className="partner-logo">KRA</div>
                        <div className="partner-logo">VISA</div>
                        <div className="partner-logo">STRIPE</div>
                    </div>
                </section>

                <section className="features-section reveal">
                    <div className="section-header">
                        <h2>Quiet Operations</h2>
                        <p>Total operational visibility without the daily management overhead.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h4>Managed POS</h4>
                            <p>High-performance Android hardware configured for your specific retail or hospitality needs.</p>
                        </div>
                        <div className="feature-card">
                            <h4>Auto-Compliance</h4>
                            <p>Every sale is automatically validated against eTIMS, keeping you legal and stress-free.</p>
                        </div>
                        <div className="feature-card">
                            <h4>Real-time Sync</h4>
                            <p>Watch your revenue performance from any device with our unified cloud dashboard.</p>
                        </div>
                    </div>
                </section>

                <section className="tools-showcase reveal">
                  <div className="section-header">
                    <h2>Intelligence Audit</h2>
                    <p>Professional checks to identify bottlenecks in your current business workflows.</p>
                  </div>
                  <div className="tools-grid">
                    {STATIC_TOOLS.map((tool) => (
                      <div key={tool.slug} className="tool-card" onClick={() => startTool(tool)} style={{ cursor: 'pointer' }}>
                        <div className="tool-content">
                          <h4>{tool.name}</h4>
                          <p>{tool.subheadline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="industry-section reveal">
                   <div className="section-header">
                        <h2>Built for Focus</h2>
                        <p>We solve the technical complexity so you can focus on your craft.</p>
                    </div>
                    <div className="industry-grid">
                        <div className="industry-card">
                            <h4>Hospitality</h4>
                            <p>Tableside ordering, split bills, and kitchen management that never lags.</p>
                        </div>
                        <div className="industry-card">
                            <h4>Modern Retail</h4>
                            <p>Inventory precision for boutiques, liquor stores, and neighborhood grocers.</p>
                        </div>
                        <div className="industry-card">
                            <h4>Service Centers</h4>
                            <p>Appointment booking and secure payment processing for clinics and wellness centers.</p>
                        </div>
                    </div>
                </section>

                <section className="primary-cta reveal" style={{ textAlign: 'center', maxWidth: '800px' }}>
                  <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Ready for clarity?</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Join the forward-thinking businesses using Veira to automate their commercial engine.</p>
                  <div className="cta-actions">
                    <button className="primary-btn" onClick={() => trackEvent('cta_clicked')}>Request System</button>
                    <button className="secondary-btn" onClick={handleWhatsApp}>WhatsApp</button>
                  </div>
                </section>
              </>
            )}

            {view === 'pos' && (
              <section className="saas-hero reveal">
                <div className="hero-badge">Hardware + Software</div>
                <h1>Total Operational Clarity.</h1>
                <p className="hero-supporting">Our Android Smart POS is built for high-volume environments that require speed and zero downtime.</p>
                <div className="hero-actions">
                    <button className="primary-btn" onClick={() => trackEvent('cta_clicked')}>Order Device</button>
                    <button className="secondary-btn" onClick={resetToLanding}>Return Home</button>
                </div>
              </section>
            )}

            {view === 'tool' && activeTool && (
                <section className="tool-view-container reveal">
                    <div className="tool-hero">
                        <h1>{activeTool.title}</h1>
                        <p className="hero-supporting">{activeTool.subheadline}</p>
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
                                            <button className="option-pill" onClick={() => handleToolAnswer("Yes")}>Yes, absolutely</button>
                                            <button className="option-pill" onClick={() => handleToolAnswer("No")}>No, not yet</button>
                                        </>
                                    )}
                                </div>
                            </div>
                         </div>
                    ) : (
                        <div className="result-container reveal">
                            <div className="tool-form-card">
                                <h2 style={{ marginBottom: '8px' }}>Analysis Report</h2>
                                <div className={`status-badge status-${toolResult.status.toLowerCase()}`} style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginBottom: '24px', fontSize: '12px', fontWeight: 800 }}>{toolResult.status} Intent</div>
                                <p style={{ fontSize: '1.2rem', marginBottom: '32px' }}>{toolResult.summary}</p>
                                <div className="next-steps">
                                    <h3 style={{ marginBottom: '16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recommended:</h3>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {toolResult.steps.map((s,i) => <li key={i} style={{ paddingLeft: '24px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>✓</span> {s}</li>)}
                                    </ul>
                                </div>
                                <button className="primary-btn" style={{ marginTop: '48px', width: '100%' }} onClick={resetToLanding}>Back to Dashboard</button>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>

        {/* Footer - Single Instance */}
        <footer className="saas-footer reveal">
            <div className="footer-content">
                <div className="footer-brand">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <OrganicOrbLogo size={28} />
                        <span className="saas-logo">Veira</span>
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '14px' }}>
                        Managed business systems designed for high-performance operators in the modern Kenyan market.
                    </p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Solutions</h4>
                        <a href="#" onClick={(e) => { e.preventDefault(); showPOS(); }}>POS Systems</a>
                        <a href="#">Payments</a>
                        <a href="#">Cloud Sync</a>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <a href="#" onClick={(e) => { e.preventDefault(); resetToLanding(); }}>Audit Tools</a>
                        <a href="#">Security</a>
                        <a href="#">Privacy</a>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <a href="#" onClick={handleWhatsApp}>WhatsApp Support</a>
                        <a href="https://linkedin.com/company/veira" target="_blank">LinkedIn</a>
                        <a href="#">Careers</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <span>&copy; {new Date().getFullYear()} Veira Systems. Registered in Kenya.</span>
                <span>High Performance. Endless Possibility.</span>
            </div>
        </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
