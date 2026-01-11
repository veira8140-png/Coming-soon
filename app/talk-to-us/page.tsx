import { Metadata } from 'next';
import ClientApp from '../../index';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: 'Talk to Us | Veira',
  description: 'Learn how Veira helps businesses with talk to us through calm, reliable software.',
  alternates: {
    canonical: 'https://veirahq.com/talk-to-us',
  },
};

export default function Page() {
  return <ClientApp initialRoute="talkToUs" />;
}