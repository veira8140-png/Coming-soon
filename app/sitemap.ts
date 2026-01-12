import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://veirahq.com';
  
  const staticRoutes = [
    '',
    '/pos',
    '/agents',
    '/cloud',
    '/apps',
    '/use-cases',
    '/our-story',
    '/talk-to-us',
    '/pricing',
    '/faq',
    '/blog'
  ];

  const blogPosts = [
    '/blog/reconciliation-silent-killer',
    '/blog/moving-from-cash-to-digital',
    '/blog/ai-agents-customer-support-future'
  ];

  const allRoutes = [...staticRoutes, ...blogPosts];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
