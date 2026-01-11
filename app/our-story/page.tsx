import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Our Story | Veira',
  description: 'Learn how Veira helps businesses with our story through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/our-story',
  },
};

export default function Page() {
  return <ClientApp initialRoute="ourStory" />;
}