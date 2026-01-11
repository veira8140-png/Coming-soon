import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'FAQ | Veira',
  description: 'Frequently asked questions about Veira business systems.',
  alternates: {
    canonical: 'https://veirahq.com/faq',
  },
};

export default function Page() {
  return <ClientApp initialRoute="faq" />;
}
