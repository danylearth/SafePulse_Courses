'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import styles from './page.module.css';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

function LoginInner() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/lessons/athlete-code';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }

        setLoading(true);
        // Simulate async auth (replace with real Supabase auth later)
        await new Promise((r) => setTimeout(r, 600));

        login({
            name: email.split('@')[0],
            email: email.trim(),
            username: email.split('@')[0].toLowerCase(),
        });

        router.push(decodeURIComponent(redirectTo));
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h1>Welcome back</h1>
                <p>Sign in to continue your learning journey.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        className={styles.input}
                        type="email"
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        autoComplete="email"
                    />
                </div>

                <div className={styles.field}>
                    <div className={styles.labelRow}>
                        <label htmlFor="password">Password</label>
                        <a href="#" className={styles.forgot}>Forgot password?</a>
                    </div>
                    <div className={styles.passwordWrap}>
                        <input
                            id="password"
                            className={styles.input}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.loading : ''}`} disabled={loading}>
                    {loading ? 'Signing in…' : <><span>Sign In</span> <ArrowRight size={16} /></>}
                </button>
            </form>

            <p className={styles.switchAuth}>
                Don&apos;t have an account?{' '}
                <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}>Create one</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginInner />
        </Suspense>
    );
}
