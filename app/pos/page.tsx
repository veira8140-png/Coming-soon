import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Veira POS | Smart POS for Businesses in Africa",
  description: "Veira POS helps businesses accept payments, manage sales, stay eTIMS compliant, and get daily reports on WhatsApp. Works on Android hardware. Cloud-based. Built for growth.",
  keywords: [
    "best POS system in Kenya",
    "free POS system Kenya",
    "android POS for small business",
    "eTIMS compliant POS",
    "POS with WhatsApp reports",
    "cloud POS Africa",
    "POS for law firms",
    "POS for clinics",
    "POS for bars and clubs",
    "service business POS software",
    "modern POS for Africa"
  ],
  alternates: {
    canonical: 'https://veirahq.com/pos',
  },
  openGraph: {
    title: "Veira POS | One POS That Actually Works",
    description: "Accept payments. Stay compliant. Get reports on WhatsApp. Veira POS is the modern point of sale built for African businesses.",
    url: "https://veirahq.com/pos",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Veira POS | Smart POS for Growing Businesses",
    description: "Payments, compliance, reports, and peace of mind. All in one POS."
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Veira POS free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Veira POS is available with no upfront software cost. A small processing fee applies to help manage payments, security, and infrastructure."
        }
      },
      {
        "@type": "Question",
        "name": "Is Veira POS eTIMS compliant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Veira POS is fully eTIMS compliant and handles tax reporting automatically."
        }
      },
      {
        "@type": "Question",
        "name": "Does Veira POS work on Android hardware?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Veira POS runs on modern Android POS devices designed for reliability and speed."
        }
      },
      {
        "@type": "Question",
        "name": "Do I get sales reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You receive daily sales summaries directly on WhatsApp."
        }
      },
      {
        "@type": "Question",
        "name": "Can Veira POS work for service businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Veira POS works well for law firms, clinics, service providers, and any business that needs clear records and simple payments."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientApp initialRoute="pos" />
    </>
  );
}
