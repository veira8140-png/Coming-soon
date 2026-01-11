import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://veirahq.com';
  const routes = [
    '',
    '/pos',
    '/agents',
    '/cloud',
    '/apps',
    '/use-cases',
    '/our-story',
    '/talk-to-us',
    '/pricing',
    '/faq'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}