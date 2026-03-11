'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import styles from './page.module.css';
import {
    Eye, EyeOff, CheckCircle2, ChevronRight, ChevronLeft,
    CreditCard, MapPin, Briefcase, User, ArrowRight
} from 'lucide-react';

// --- Profession options ---
const PROFESSIONS = [
    'Physician', 'Nurse', 'Paramedic', 'Pharmacist',
    'Personal Trainer', 'Strength Coach', 'Athlete',
    'Researcher', 'Student', 'Other',
];

// --- Step indicator ---
const STEPS = [
    { id: 1, label: 'Account', icon: User },
    { id: 2, label: 'Address', icon: MapPin },
    { id: 3, label: 'Profession', icon: Briefcase },
];

function SignupInner() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/lessons/athlete-code';

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Step 1 — Account
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [step1Error, setStep1Error] = useState('');

    // Step 2 — Address
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postcode, setPostcode] = useState('');
    const [country, setCountry] = useState('');

    // Step 3 — Profession
    const [professions, setProfessions] = useState<string[]>([]);

    // --- Validation ---
    const validateStep1 = () => {
        if (!firstName.trim() || !lastName.trim()) return 'Please enter your full name.';
        if (!email.trim() || !email.includes('@')) return 'Please enter a valid email.';
        if (!username.trim() || username.length < 3) return 'Username must be at least 3 characters.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (password !== confirm) return 'Passwords do not match.';
        return '';
    };

    const handleStep1Next = () => {
        const err = validateStep1();
        if (err) { setStep1Error(err); return; }
        setStep1Error('');
        setStep(2);
    };

    // --- Finish ---
    const finish = useCallback(() => {
        login({
            name: `${firstName} ${lastName}`.trim(),
            email: email.trim(),
            username: username.trim(),
            address: { street, city, state, postcode, country },
            professions,
            hasPayment: false,
        });
        router.push(decodeURIComponent(redirectTo));
    }, [login, firstName, lastName, email, username, street, city, state, postcode, country, professions, router, redirectTo]);

    const toggleProfession = (p: string) => {
        setProfessions((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    const progress = ((step - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className={styles.card}>
            {/* Progress bar */}
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            {/* Step indicators */}
            <div className={styles.steps}>
                {STEPS.map((s) => {
                    const Icon = s.icon;
                    const done = step > s.id;
                    const active = step === s.id;
                    return (
                        <div key={s.id} className={`${styles.stepItem} ${active ? styles.stepActive : done ? styles.stepDone : styles.stepFuture}`}>
                            <div className={styles.stepCircle}>
                                {done ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                            </div>
                            <span className={styles.stepLabel}>{s.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* ── Step 1: Account ── */}
            {step === 1 && (
                <div className={styles.stepBody}>
                    <div className={styles.heading}>
                        <h1>Create your account</h1>
                        <p>Join thousands of professionals advancing their knowledge.</p>
                    </div>

                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label>First Name</label>
                            <input className={styles.input} type="text" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
                        </div>
                        <div className={styles.field}>
                            <label>Last Name</label>
                            <input className={styles.input} type="text" placeholder="Smith" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Email</label>
                        <input className={styles.input} type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>Username</label>
                        <div className={styles.prefixInput}>
                            <span className={styles.prefix}>@</span>
                            <input className={`${styles.input} ${styles.inputWithPrefix}`} type="text" placeholder="janesmith" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Password</label>
                        <div className={styles.passwordWrap}>
                            <input className={styles.input} type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Confirm Password</label>
                        <div className={styles.passwordWrap}>
                            <input className={styles.input} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {step1Error && <p className={styles.error}>{step1Error}</p>}

                    <button className={styles.btnPrimary} onClick={handleStep1Next}>
                        Continue <ChevronRight size={16} />
                    </button>

                    <p className={styles.switchAuth}>
                        Already have an account? <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`}>Log in</Link>
                    </p>
                </div>
            )}

            {/* ── Step 2: Address ── */}
            {step === 2 && (
                <div className={styles.stepBody}>
                    <div className={styles.heading}>
                        <h1>Your address</h1>
                        <p>Used for billing and certification purposes. You can skip this for now.</p>
                    </div>

                    <div className={styles.field}>
                        <label>Street Address</label>
                        <input className={styles.input} type="text" placeholder="123 Main Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>

                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label>City</label>
                            <input className={styles.input} type="text" placeholder="Toronto" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label>State / Province</label>
                            <input className={styles.input} type="text" placeholder="ON" value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label>Postcode / ZIP</label>
                            <input className={styles.input} type="text" placeholder="M5V 2H1" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label>Country</label>
                            <input className={styles.input} type="text" placeholder="Canada" value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.navRow}>
                        <button className={styles.btnGhost} onClick={() => setStep(1)}>
                            <ChevronLeft size={16} /> Back
                        </button>
                        <div className={styles.rowBtns}>
                            <button className={styles.btnSecondary} onClick={() => setStep(3)}>Skip</button>
                            <button className={styles.btnPrimary} onClick={() => setStep(3)}>
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Step 3: Profession ── */}
            {step === 3 && (
                <div className={styles.stepBody}>
                    <div className={styles.heading}>
                        <h1>What&apos;s your profession?</h1>
                        <p>Select all that apply — helps us personalise your experience.</p>
                    </div>

                    <div className={styles.pillGrid}>
                        {PROFESSIONS.map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={`${styles.pill} ${professions.includes(p) ? styles.pillActive : ''}`}
                                onClick={() => toggleProfession(p)}
                            >
                                {professions.includes(p) && <CheckCircle2 size={13} />}
                                {p}
                            </button>
                        ))}
                    </div>

                    <div className={styles.navRow}>
                        <button className={styles.btnGhost} onClick={() => setStep(2)}>
                            <ChevronLeft size={16} /> Back
                        </button>
                        <div className={styles.rowBtns}>
                            <button className={styles.btnSecondary} onClick={finish}>Skip</button>
                            <button className={styles.btnPrimary} onClick={finish}>
                                Get Started <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <SignupInner />
        </Suspense>
    );
}
