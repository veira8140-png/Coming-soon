import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Use Cases | Veira',
  description: 'Learn how Veira helps businesses with use cases through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/use-cases',
  },
};

export default function Page() {
  return <ClientApp initialRoute="useCases" />;
}