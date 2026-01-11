import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Pricing | Veira',
  description: 'Transparent pricing for modern business infrastructure.',
  alternates: {
    canonical: 'https://veirahq.com/pricing',
  },
};

export default function Page() {
  return <ClientApp initialRoute="pricing" />;
}
