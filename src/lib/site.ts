// Facts about the author used in structured data and links. Not UI copy.
export const AUTHOR = {
  name: 'Diego Mancassola',
  jobTitle: 'Technical Solution Architect',
  worksFor: 'PA Expertise - Alveo group',
  locality: 'Vicenza',
  country: 'IT',
  linkedin: 'https://www.linkedin.com/in/diego-mancassola-81a9a11b/',
  oldBlog: 'https://dynamicsaxnotes.blogspot.com/',
  portrait: '/images/portrait.jpg',
} as const;

export const SUPER_USER_SLUG = 'super-user-2026-season-2';
export const OG_DEFAULT = '/og-default.png';

export function personJsonLd(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': new URL('/#person', site).href,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    worksFor: { '@type': 'Organization', name: AUTHOR.worksFor },
    address: { '@type': 'PostalAddress', addressLocality: AUTHOR.locality, addressCountry: AUTHOR.country },
    image: new URL(AUTHOR.portrait, site).href,
    url: new URL('/', site).href,
    sameAs: [AUTHOR.linkedin, AUTHOR.oldBlog],
    knowsAbout: ['Microsoft Dynamics 365 Finance and Operations', 'X++', 'Azure API Management', 'Azure Functions', 'Artificial intelligence'],
  };
}

/** "<page> · Diego Mancassola": the name sits in every title for search. */
export const pageTitle = (page: string) => `${page} · ${AUTHOR.name}`;
