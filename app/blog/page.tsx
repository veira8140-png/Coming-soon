import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Blog | Business Intelligence & Operations | Veira',
  description: 'Insights on business automation, digital payments, and high-performance infrastructure for modern commerce in East Africa.',
  alternates: {
    canonical: 'https://veirahq.com/blog',
  },
};

export default function Page() {
  return <ClientApp initialRoute="blog" />;
}
