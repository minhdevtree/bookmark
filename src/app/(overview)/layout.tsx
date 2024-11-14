import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: `Homepage | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `Welcome to our site ${siteConfig.name}!`,
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="bg-background px-4 pb-2">{children}</main>;
}
