export const siteConfig = {
    name: process.env.FRONTEND_SITE_NAME || 'Minhdevtree Bookmarks',
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export type SiteConfig = typeof siteConfig;
