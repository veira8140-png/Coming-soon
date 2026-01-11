
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

const AGENTS_CONTENT = {
  meta: {
    title: "AI Business Assistants for WhatsApp, Sales and Support | Veira Agents",
    description: "Veira provides AI business assistants that help handle sales, customer support, follow ups, invoicing and reports across WhatsApp, calls and business systems."
  },
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
  meta: {
    title: "Veira Cloud | The Calm Behind Your Business",
    description: "Veira Cloud quietly keeps your business organised. Sales, reports, customers and activity from POS, AI agents, apps and websites in one simple place."
  },
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
  meta: {
    title: "Veira Apps & Websites | Simple Software That Just Works",
    description: "Veira designs modern apps and websites that feel effortless. Built to be fast, clear, and quietly powerful for real businesses."
  },
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
  meta: {
    title: "Our Story | Veira",
    description: "Veira builds calm, reliable software for real businesses and commits 10% of annual net profit to fighting gender based violence and supporting survivors."
  },
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
  meta: {
    title: "Use Cases | How Businesses Use Veira Every Day",
    description: "See how restaurants, retail shops, clinics, law firms, service businesses, bars and clubs use Veira POS, Cloud, AI agents, apps and websites to run calmer operations."
  },
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
  meta: {
    title: "Talk to Us | Veira",
    description: "Get in touch with Veira for POS systems, AI agents, cloud platforms, and custom software solutions."
  },
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

type AppView = 'landing' | 'pos' | 'agents' | 'compare' | 'cloud' | 'apps' | 'use-cases' | 'story' | 'blog' | 'contact';

// Map views to paths for SEO/Canonical logic
const ROUTE_PATH_MAP: Record<AppView, string> = {
  landing: '/',
  pos: '/pos',
  agents: '/agents',
  cloud: '/cloud',
  apps: '/apps',
  'use-cases': '/use-cases',
  story: '/our-story',
  contact: '/talk-to-us',
  blog: '/blog',
  compare: '/compare'
};

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [activeCompId, setActiveCompId] = useState("chatgpt");
  const [activeContextId, setActiveContextId] = useState("whatsapp-business");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Programmatic SEO: Navigation Helper ---
  const navigate = (newView: AppView, slug?: string) => {
    setView(newView);
    setActiveSlug(slug || null);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulated URL push (for demonstration of pSEO routing structure)
    const newPath = slug ? `/compare/${slug}` : ROUTE_PATH_MAP[newView];
    console.debug(`Navigating to canonical: ${BASE_URL}${newPath}`);
  };

  const showCompare = (compId?: string, ctxId?: string) => {
    const cid = compId || activeCompId;
    const ctxid = ctxId || activeContextId;
    setActiveCompId(cid);
    setActiveContextId(ctxid);
    
    // Programmatic slug generation
    const slug = `${cid}-vs-veira-for-${ctxid}`;
    navigate('compare', slug);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Veira, I'm interested in your business solutions.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  };

  // --- Internal Linking Randomizer (pSEO Crawl discovery) ---
  const internalLinks = useMemo(() => {
    const links: { compId: string; ctxId: string }[] = [];
    const used = new Set();
    while (links.length < 12) {
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

  // --- Comparison Engine Logic ---
  const activeCompareData = useMemo(() => {
    // If we have a slug, parse it to extract IDs
    if (activeSlug) {
      const parts = activeSlug.split('-vs-veira-for-');
      if (parts.length === 2) {
        const foundComp = COMPETITORS.find(c => c.id === parts[0]);
        const foundCtx = USE_CASES.find(u => u.id === parts[1]);
        if (foundComp && foundCtx) {
          // Sync state if navigating from a link
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
  }, [activeCompId, activeContextId, activeSlug]);

  // --- Dynamic Meta, Canonical & Schema Injection ---
  useEffect(() => {
    const isCompare = view === 'compare';
    const isPOS = view === 'pos';
    const isAgents = view === 'agents';
    const isCloud = view === 'cloud';
    const isApps = view === 'apps';
    const isStory = view === 'story';
    const isUseCases = view === 'use-cases';
    const isContact = view === 'contact';
    
    // Default Fallback
    let pageTitle = `${view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ')} | Veira`;
    let metaDescription = `Learn how Veira helps businesses with ${view.replace('-', ' ')} through calm, reliable software.`;

    const canonicalPath = activeSlug ? `/compare/${activeSlug}` : ROUTE_PATH_MAP[view];
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    let mainSchema: any = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Veira",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, WhatsApp, Voice",
        "url": BASE_URL,
        "description": "Infrastructure for modern commerce.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    if (view === 'landing') {
        pageTitle = "Veira — Simpler Business Systems";
        metaDescription = "Modern business infrastructure for East African commerce. Managed POS, AI Agents, and Digital Payments.";
    } else if (isCompare) {
        const { comp, context, faqs } = activeCompareData;
        pageTitle = `Veira vs ${comp.name} for ${context.label} | Best AI for Business`;
        metaDescription = `Compare Veira and ${comp.name} for ${context.label}. See why Veira's WhatsApp-native operational agents lead in regional commerce execution.`;
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
        metaDescription = POS_CONTENT.meta.description;
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
    } else if (isAgents) {
        pageTitle = AGENTS_CONTENT.meta.title;
        metaDescription = AGENTS_CONTENT.meta.description;
        mainSchema = [
            mainSchema,
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": AGENTS_CONTENT.faq.items.map(f => ({
                  "@type": "Question",
                  "name": f.question,
                  "acceptedAnswer": { "@type": "Answer", "text": f.answer }
                }))
            }
        ];
    } else if (isCloud) {
        pageTitle = CLOUD_CONTENT.meta.title;
        metaDescription = CLOUD_CONTENT.meta.description;
        mainSchema = [
            mainSchema,
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": CLOUD_CONTENT.faq.items.map(f => ({
                  "@type": "Question",
                  "name": f.question,
                  "acceptedAnswer": { "@type": "Answer", "text": f.answer }
                }))
            }
        ];
    } else if (isApps) {
        pageTitle = APPS_CONTENT.meta.title;
        metaDescription = APPS_CONTENT.meta.description;
        mainSchema = [
            mainSchema,
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Veira Apps & Websites",
              "description": APPS_CONTENT.meta.description
            }
        ];
    } else if (isStory) {
        pageTitle = STORY_CONTENT.meta.title;
        metaDescription = STORY_CONTENT.meta.description;
        mainSchema = [
            mainSchema,
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Veira",
              "url": BASE_URL,
              "description": STORY_CONTENT.meta.description
            }
        ];
    } else if (isUseCases) {
        pageTitle = USE_CASES_PAGE_CONTENT.meta.title;
        metaDescription = USE_CASES_PAGE_CONTENT.meta.description;
        mainSchema = [
            mainSchema,
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Veira Use Cases",
              "description": USE_CASES_PAGE_CONTENT.meta.description
            }
        ];
    } else if (isContact) {
        pageTitle = CONTACT_PAGE_CONTENT.meta.title;
        metaDescription = CONTACT_PAGE_CONTENT.meta.description;
        mainSchema = [
            mainSchema,
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Talk to Us",
              "url": `${BASE_URL}/talk-to-us`,
              "description": "Get in touch with Veira HQ."
            }
        ];
    }

    document.title = pageTitle;
    
    // Manage meta description
    const updateOrCreateMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    };

    updateOrCreateMeta('description', metaDescription);
    
    // Canonical link injection
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Schema injection
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(mainSchema);
    script.id = 'dynamic-seo-schema';
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('dynamic-seo-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, [view, activeCompareData, activeSlug]);

  return (
    <div className="saas-container">
        {/* Navigation Bar (Strict Header Items) */}
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
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Talk to Us</a>
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
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Talk to Us</a>
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

                <section className="journal-landing-preview reveal">
                  <div className="section-header">
                    <h2>Market Intelligence</h2>
                    <p>How Veira compares against the global ecosystem.</p>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {COMPETITORS.slice(0, 6).map(comp => (
                        <div key={comp.id} className="tool-card" onClick={() => showCompare(comp.id, "whatsapp-business")}>
                            <h4>Veira vs {comp.name}</h4>
                            <p className="excerpt">WhatsApp & Voice Native operational efficiency for regional businesses.</p>
                            <span className="category-tag" style={{ marginTop: '1rem' }}>Comparison</span>
                        </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button className="secondary-btn" onClick={() => showCompare()}>View All Comparisons</button>
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
                        <h2>Explore Related Contexts</h2>
                        <p>Deep dive into alternative configurations for {activeCompareData.comp.name} and beyond.</p>
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
                  <h1>{AGENTS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{AGENTS_CONTENT.hero.subheadline}</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={handleWhatsApp}>{AGENTS_CONTENT.hero.primaryCTA}</button>
                    <button className="secondary-btn" onClick={handleWhatsApp}>{AGENTS_CONTENT.hero.secondaryCTA}</button>
                  </div>
                </section>

                <section className="pos-content-section reveal">
                   <div className="section-header">
                      <h2>{AGENTS_CONTENT.intro.title}</h2>
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        {AGENTS_CONTENT.intro.text}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{AGENTS_CONTENT.howTheyWork.title}</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {AGENTS_CONTENT.howTheyWork.points.map((point, i) => (
                      <div key={i} className="tool-card">
                        <span className="check-icon" style={{ display: 'block', marginBottom: '1rem' }}>✓</span>
                        <p style={{ fontWeight: 600 }}>{point}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{AGENTS_CONTENT.agents.title}</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {AGENTS_CONTENT.agents.list.map((agent, i) => (
                      <div key={i} className="tool-card agent-profile-card">
                        <div style={{ marginBottom: '1.5rem' }}>
                           <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{agent.name}</h3>
                           <span className="category-tag">{agent.role}</span>
                        </div>
                        <p className="excerpt">{agent.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{AGENTS_CONTENT.useCases.title}</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {AGENTS_CONTENT.useCases.items.map((item, i) => (
                      <div key={i} className="tool-card feature-item">
                        <span className="check-icon" style={{ display: 'block', marginBottom: '1rem' }}>✓</span>
                        <p style={{ fontWeight: 600 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{AGENTS_CONTENT.whoItsFor.title}</h2>
                  </div>
                  <div className="control-pills" style={{ justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    {AGENTS_CONTENT.whoItsFor.businesses.map((biz, i) => (
                      <span key={i} className="pill" style={{ cursor: 'default' }}>{biz}</span>
                    ))}
                  </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{AGENTS_CONTENT.benefits.title}</h2>
                  </div>
                  <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {AGENTS_CONTENT.benefits.items.map((item, i) => (
                      <div key={i} className="faq-item" style={{ padding: '1.5rem 2rem' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                          <span className="check-icon">✓</span> {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="faq-section reveal">
                    <div className="section-header">
                        <h2>{AGENTS_CONTENT.faq.title}</h2>
                    </div>
                    <div className="faq-container">
                        {AGENTS_CONTENT.faq.items.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="primary-cta reveal">
                   <h2>Start Using Veira Agents</h2>
                   <p className="hero-supporting" style={{ marginTop: '1rem' }}>Talk to us and see how AI assistants can help run your business day to day.</p>
                   <div className="cta-actions" style={{ marginTop: '2.5rem' }}>
                      <button className="primary-btn" onClick={handleWhatsApp}>Talk to Us</button>
                   </div>
                </section>
              </div>
            )}

            {view === 'pos' && (
              <div className="pos-page reveal">
                <section className="saas-hero">
                  <h1>{POS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{POS_CONTENT.hero.subheadline}</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={handleWhatsApp}>{POS_CONTENT.hero.primaryCTA}</button>
                    <button className="secondary-btn" onClick={handleWhatsApp}>{POS_CONTENT.hero.secondaryCTA}</button>
                  </div>
                </section>

                <section className="pos-content-section reveal">
                   <div className="section-header">
                      <h2>{POS_CONTENT.intro.title}</h2>
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        {POS_CONTENT.intro.text}
                      </p>
                   </div>
                </section>

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

                <section className="pos-content-section reveal" style={{ background: 'var(--bg-surface)', padding: '6rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div className="section-header">
                    <h2>{POS_CONTENT.pricing.title}</h2>
                    <p style={{ maxWidth: '800px', margin: '2rem auto 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                      {POS_CONTENT.pricing.text}
                    </p>
                  </div>
                </section>

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
                  <h1>{CLOUD_CONTENT.opening.headline}</h1>
                  <p className="hero-supporting">{CLOUD_CONTENT.opening.body}</p>
                </section>

                <section className="pos-content-section reveal">
                   <div className="section-header">
                      <h2>{CLOUD_CONTENT.reframe.headline}</h2>
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '2rem auto 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        {CLOUD_CONTENT.reframe.body}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{CLOUD_CONTENT.whatActuallyHappens.headline}</h2>
                  </div>
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    {CLOUD_CONTENT.whatActuallyHappens.items.map((item, i) => (
                      <div key={i} className="tool-card feature-item">
                        <span className="check-icon" style={{ display: 'block', marginBottom: '1rem' }}>✓</span>
                        <p style={{ fontWeight: 600 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="verdict-section reveal">
                  <div className="section-header">
                    <h2>The Quiet Shift</h2>
                  </div>
                  <div className="verdict-grid">
                    <div className="verdict-card card-b">
                      <div className="card-header"><h3>{CLOUD_CONTENT.contrast.headline}</h3></div>
                      <ul style={{ listStyle: 'none' }}>
                        {CLOUD_CONTENT.contrast.items.map((item, i) => (
                          <li key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                             {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="verdict-card card-a">
                      <div className="card-header"><h3>{CLOUD_CONTENT.contrastAfter.headline}</h3></div>
                      <ul style={{ listStyle: 'none' }}>
                        {CLOUD_CONTENT.contrastAfter.items.map((item, i) => (
                          <li key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', color: '#fff', display: 'flex', gap: '12px' }}>
                             <span className="check-icon" style={{ fontSize: '1.1rem' }}>✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="pos-content-section reveal" style={{ background: 'var(--bg-surface)', padding: '6rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div className="section-header">
                    <h2>{CLOUD_CONTENT.psychologicalBenefit.headline}</h2>
                    <p style={{ maxWidth: '800px', margin: '2rem auto 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                      {CLOUD_CONTENT.psychologicalBenefit.body}
                    </p>
                  </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="section-header">
                    <h2>{CLOUD_CONTENT.whoItsReallyFor.headline}</h2>
                  </div>
                  <div className="control-pills" style={{ justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    {CLOUD_CONTENT.whoItsReallyFor.items.map((biz, i) => (
                      <span key={i} className="pill" style={{ cursor: 'default' }}>{biz}</span>
                    ))}
                  </div>
                </section>

                <section className="pos-content-section reveal">
                  <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                    <div className="tool-card">
                       <h3 style={{ marginBottom: '1rem', color: '#fff' }}>{CLOUD_CONTENT.howItFits.headline}</h3>
                       <p className="excerpt">{CLOUD_CONTENT.howItFits.body}</p>
                    </div>
                    <div className="tool-card">
                       <h3 style={{ marginBottom: '1rem', color: '#fff' }}>{CLOUD_CONTENT.securityWithoutFear.headline}</h3>
                       <p className="excerpt">{CLOUD_CONTENT.securityWithoutFear.body}</p>
                    </div>
                  </div>
                </section>

                <section className="faq-section reveal">
                    <div className="section-header">
                        <h2>Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-container">
                        {CLOUD_CONTENT.faq.items.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="primary-cta reveal">
                   <h2>{CLOUD_CONTENT.closing.headline}</h2>
                   <p className="hero-supporting" style={{ marginTop: '1rem' }}>{CLOUD_CONTENT.closing.body}</p>
                   <div className="cta-actions" style={{ marginTop: '2.5rem' }}>
                      <button className="primary-btn" onClick={handleWhatsApp}>{CLOUD_CONTENT.closing.cta}</button>
                   </div>
                </section>
              </div>
            )}

            {view === 'apps' && (
              <div className="apps-page reveal">
                <section className="saas-hero">
                  <h1>{APPS_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{APPS_CONTENT.hero.body}</p>
                  <button className="primary-btn" onClick={handleWhatsApp} style={{ marginTop: '2rem' }}>Experience Veira Apps</button>
                </section>

                <section className="pos-content-section reveal" style={{ paddingBottom: '3rem' }}>
                   <div className="section-header">
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.8' }}>
                        {APPS_CONTENT.story.body}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>{APPS_CONTENT.designPhilosophy.headline}</h3>
                         <p className="excerpt">{APPS_CONTENT.designPhilosophy.body}</p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>{APPS_CONTENT.experience.headline}</h3>
                         <p className="excerpt">{APPS_CONTENT.experience.body}</p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>{APPS_CONTENT.performance.headline}</h3>
                         <p className="excerpt">{APPS_CONTENT.performance.body}</p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>{APPS_CONTENT.integration.headline}</h3>
                         <p className="excerpt">{APPS_CONTENT.integration.body}</p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>{APPS_CONTENT.devices.headline}</h3>
                         <p className="excerpt">{APPS_CONTENT.devices.body}</p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>{APPS_CONTENT.ownership.headline}</h3>
                         <p className="excerpt">{APPS_CONTENT.ownership.body}</p>
                      </div>
                   </div>
                </section>

                <section className="primary-cta reveal">
                   <h2>{APPS_CONTENT.closing.headline}</h2>
                   <p className="hero-supporting" style={{ marginTop: '1rem' }}>{APPS_CONTENT.closing.body}</p>
                   <div className="cta-actions" style={{ marginTop: '2.5rem' }}>
                      <button className="primary-btn" onClick={handleWhatsApp}>{APPS_CONTENT.closing.cta}</button>
                   </div>
                </section>
              </div>
            )}

            {view === 'use-cases' && (
              <div className="use-cases-page reveal">
                <section className="saas-hero">
                  <h1>{USE_CASES_PAGE_CONTENT.hero.headline}</h1>
                  <p className="hero-supporting">{USE_CASES_PAGE_CONTENT.hero.body}</p>
                </section>

                <section className="pos-content-section reveal" style={{ paddingBottom: '3rem' }}>
                   <div className="section-header">
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.8' }}>
                        {USE_CASES_PAGE_CONTENT.intro.body}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      {USE_CASES_PAGE_CONTENT.useCases.map((uc, i) => (
                        <div key={i} className="tool-card feature-item">
                           <h3 style={{ marginBottom: '1.2rem', color: '#fff', fontSize: '1.4rem' }}>{uc.name}</h3>
                           <p className="excerpt" style={{ lineHeight: '1.7' }}>{uc.body}</p>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="pos-content-section reveal" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                   <div className="section-header">
                      <h2>{USE_CASES_PAGE_CONTENT.crossChannel.headline}</h2>
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '2rem auto 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                        {USE_CASES_PAGE_CONTENT.crossChannel.body}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal">
                   <div className="section-header">
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: '#fff', fontSize: '1.3rem', fontWeight: 500, fontStyle: 'italic' }}>
                        "{USE_CASES_PAGE_CONTENT.psychologicalBenefit.body}"
                      </p>
                   </div>
                </section>

                <section className="primary-cta reveal">
                   <h2>{USE_CASES_PAGE_CONTENT.closing.headline}</h2>
                   <p className="hero-supporting" style={{ marginTop: '1.5rem' }}>{USE_CASES_PAGE_CONTENT.closing.body}</p>
                   <div className="cta-actions" style={{ marginTop: '3rem' }}>
                      <button className="primary-btn" onClick={handleWhatsApp}>{USE_CASES_PAGE_CONTENT.closing.cta}</button>
                   </div>
                </section>
              </div>
            )}

            {view === 'story' && (
              <div className="story-page reveal">
                <section className="saas-hero">
                  <h1>{STORY_CONTENT.story.opening.headline}</h1>
                  <p className="hero-supporting">{STORY_CONTENT.story.opening.body}</p>
                </section>

                <section className="pos-content-section reveal">
                   <div className="section-header">
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.8' }}>
                        {STORY_CONTENT.story.philosophy.body}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal" style={{ background: 'var(--bg-surface)', padding: '6rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                   <div className="section-header">
                      <p className="intro-text" style={{ maxWidth: '800px', margin: '0 auto', color: '#fff', fontSize: '1.2rem' }}>
                        {STORY_CONTENT.story.howWeWork.body}
                      </p>
                   </div>
                </section>

                <section className="pos-content-section reveal">
                   <div className="tools-grid" style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
                      <div className="tool-card" style={{ gridColumn: 'span 2', textAlign: 'center', borderColor: 'var(--orb-pink)' }}>
                         <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>{STORY_CONTENT.story.profitWithPurpose.headline}</h2>
                         <p className="intro-text" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            {STORY_CONTENT.story.profitWithPurpose.body}
                         </p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Why It Matters</h3>
                         <p className="excerpt">{STORY_CONTENT.story.whyItMatters.body}</p>
                      </div>
                      <div className="tool-card">
                         <h3 style={{ marginBottom: '1rem', color: '#fff' }}>The Long View</h3>
                         <p className="excerpt">{STORY_CONTENT.story.longView.body}</p>
                      </div>
                   </div>
                </section>

                <section className="primary-cta reveal">
                   <h2 style={{ fontSize: '2.5rem' }}>{STORY_CONTENT.story.closing.body}</h2>
                   <div className="cta-actions" style={{ marginTop: '2.5rem' }}>
                      <button className="primary-btn" onClick={handleWhatsApp}>Join the Journey</button>
                   </div>
                </section>
              </div>
            )}

            {view === 'contact' && (
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
                           <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{ch.value}</p>
                           <a 
                             href={ch.link} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="primary-btn" 
                             style={{ display: 'inline-block', textDecoration: 'none', width: '100%' }}
                           >
                              {ch.actionLabel}
                           </a>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="primary-cta reveal" style={{ marginTop: '4rem' }}>
                   <p className="hero-supporting" style={{ margin: '0 auto' }}>Typical response time is under 2 hours during business hours.</p>
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
                    <a href="#" onClick={(e) => { e.preventDefault(); showCompare("meta-ai", "lead-qualification"); }}>vs Meta AI</a>
                </div>
                <div className="footer-col">
                    <h4>Infrastructure</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('pos'); }}>POS System</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('agents'); }}>AI Agents</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('cloud'); }}>Cloud Platform</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('apps'); }}>Apps and Websites</a>
                </div>
                <div className="footer-col">
                    <h4>Corporate</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('use-cases'); }}>Use Cases</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('story'); }}>Our Story</a>
                    <a href="https://linkedin.com/company/veira" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Talk to Us</a>
                </div>
            </div>
            <div className="footer-bottom">&copy; {new Date().getFullYear()} Veira Systems. High-Performance Infrastructure.</div>
        </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
