import { Metadata } from 'next';
import ClientApp from '../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Veira — Simpler Business Systems',
  description: 'Managed POS, AI Agents, and Digital Payments in one high-performance stack built for East African commerce.',
  alternates: {
    canonical: 'https://veirahq.com/',
  },
};

export default function Page() {
  return <ClientApp />;
}