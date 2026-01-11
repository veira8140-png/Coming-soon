import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Cloud POS | Veira',
  description: 'eTIMS ready, offline-first Cloud POS for modern retail and hospitality.',
  alternates: {
    canonical: 'https://veirahq.com/pos',
  },
};

export default function Page() {
  return <ClientApp initialRoute="pos" />;
}
