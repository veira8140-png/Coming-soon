import { Metadata } from 'next';
import ClientApp from '../index';

export const metadata: Metadata = {
  title: 'POS | Veira',
  description: 'Learn how Veira helps businesses with pos through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/pos',
  },
};

export default function Page() {
  return <ClientApp initialRoute="pos" />;
}