import { Metadata } from 'next';
import ClientApp from '../index';

export const metadata: Metadata = {
  title: 'Cloud | Veira',
  description: 'Learn how Veira helps businesses with cloud through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/cloud',
  },
};

export default function Page() {
  return <ClientApp initialRoute="cloud" />;
}