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
    return (
        <main className="bg-background md:px-10 md:py-4 lg:px-16 lg:pb-8 lg:pt-5 px-2 py-2">
            {children}
        </main>
    );
}
