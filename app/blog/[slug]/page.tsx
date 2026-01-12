import { Metadata } from 'next';
import ClientApp from '../../../index';

export const dynamic = "force-static";

// Mock content for metadata generation
const BLOG_POSTS = [
  {
    slug: "reconciliation-silent-killer",
    title: "Why M-PESA reconciliation is the silent killer of SME time",
    description: "Manual verification of mobile money transactions is costing Kenyan businesses hours of productivity every single day."
  },
  {
    slug: "moving-from-cash-to-digital",
    title: "Moving from Cash to Digital: A guide for Kenyan retailers",
    description: "A structured approach to digitizing your storefront while maintaining speed and customer trust."
  },
  {
    slug: "ai-agents-customer-support-future",
    title: "The future of AI agents in customer support",
    description: "How native WhatsApp automation is changing the way law firms and clinics handle initial client intake."
  }
];

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.slug === params.slug);
  
  return {
    title: post ? `${post.title} | Veira Blog` : 'Blog Post | Veira',
    description: post?.description || 'Insights on business automation and digital infrastructure.',
    alternates: {
      canonical: `https://veirahq.com/blog/${params.slug}`,
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ClientApp initialRoute="blog" initialBlogSlug={params.slug} />;
}
