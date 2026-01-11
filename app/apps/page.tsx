import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Apps | Veira',
  description: 'Learn how Veira helps businesses with apps through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/apps',
  },
};

export default function Page() {
  return <ClientApp initialRoute="apps" />;
}