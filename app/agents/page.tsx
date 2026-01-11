import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Agents | Veira',
  description: 'Learn how Veira helps businesses with agents through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/agents',
  },
};

export default function Page() {
  return <ClientApp initialRoute="agents" />;
}