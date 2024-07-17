'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page not found',
    description: 'Page not found',
};

const NotFoundPage = () => {
    return (
        <>
            <div className="w-full h-[90vh] flex flex-col justify-center">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                        <div className="text-center text-xl">
                            Oops! The page you are looking for could not be
                            found
                        </div>
                        <div className="text-center text-lg text-neutral-600">
                            The page you are looking for might have been
                            removed, had its name changed, or is temporarily
                            unavailable.
                        </div>
                    </div>
                    <div className="flex justify-center ">
                        <Image
                            src="/not-found/404.png"
                            alt="404 Not Found"
                            width={300}
                            height={300}
                            className="rounded-md object-cover"
                        />
                    </div>
                    <div className="flex justify-center gap-3">
                        <Link href="">
                            <Button onClick={() => window.location.reload()}>
                                Refresh
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;
