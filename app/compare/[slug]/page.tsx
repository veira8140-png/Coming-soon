import { Metadata } from 'next';
import ClientApp from '../../../index';

export const dynamic = "force-static";

// Optional: Generate static params if you have a known list of competitors
// export async function generateStaticParams() { ... }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const parts = params.slug.split('-vs-');
  const competitor = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  
  return {
    title: `Veira vs ${competitor} | Market Intelligence`,
    description: `A detailed comparison of Veira and ${competitor} business infrastructure.`,
    alternates: {
      canonical: `https://veirahq.com/compare/${params.slug}`,
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ClientApp initialRoute="home" initialCompareSlug={params.slug} />;
}
