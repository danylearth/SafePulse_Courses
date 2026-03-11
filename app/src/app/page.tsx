'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function Home() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isLoggedIn ? '/lessons/athlete-code' : '/signup');
    }
  }, [isLoggedIn, isLoading, router]);

  return null;
}
