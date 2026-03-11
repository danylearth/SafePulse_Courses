'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to guides page instead of showing dashboard
        router.replace('/lessons/athlete-code');
    }, [router]);

    return null;
}
