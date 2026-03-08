'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            const redirect = encodeURIComponent(pathname);
            router.replace(`/login?redirect=${redirect}`);
        }
    }, [isLoggedIn, isLoading, pathname, router]);

    // While loading or redirecting, render nothing (avoids flash)
    if (isLoading || !isLoggedIn) return null;

    return <>{children}</>;
}
