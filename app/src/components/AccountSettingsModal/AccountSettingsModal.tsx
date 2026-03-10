'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import styles from './AccountSettingsModal.module.css';
import {
    X,
    User,
    Shield,
    Bell,
    Palette,
    CreditCard,
    Link2,
    Camera,
    Check,
    Monitor,
    Smartphone,
    Download,
    Sun,
    Moon,
    MonitorSmartphone,
    Save,
    LogOut,
    CheckCircle2,
} from 'lucide-react';

// --- Types ---
type TabId = 'profile' | 'security' | 'notifications' | 'appearance' | 'billing' | 'connected';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
}

const tabs: Tab[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'connected', label: 'Connected', icon: Link2 },
];

// --- Mock data ---
const mockSessions = [
    { id: '1', device: 'MacBook Pro', browser: 'Chrome 123', location: 'Toronto, ON', lastActive: 'Now', current: true },
    { id: '2', device: 'iPhone 15 Pro', browser: 'Safari', location: 'Toronto, ON', lastActive: '2 hours ago', current: false },
];

const mockPurchases = [
    { id: '1', course: 'PED Safety & Harm Reduction Fundamentals', date: 'Feb 28, 2026', amount: '$79.99', status: 'Completed' },
    { id: '2', course: 'Longevity Protocols: Biomarker Management', date: 'Jan 15, 2026', amount: '$59.99', status: 'Completed' },
    { id: '3', course: 'Performance Science: Evidence-Based Approach', date: 'Dec 3, 2025', amount: '$129.99', status: 'Completed' },
];

// --- Component ---
interface AccountSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
    const { logout, user, updateUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    // Profile state for saving
    const [profileData, setProfileData] = useState<any>(null);

    const handleSaveChanges = () => {
        if (profileData) {
            updateUser(profileData);
        }
        onClose();
    };

    // Notification toggles
    const [notifCourseUpdates, setNotifCourseUpdates] = useState(true);
    const [notifQuizReminders, setNotifQuizReminders] = useState(true);
    const [notifMarketing, setNotifMarketing] = useState(false);
    const [notifRecommendations, setNotifRecommendations] = useState(true);

    // Security toggles
    const [twoFactor, setTwoFactor] = useState(false);

    // Appearance
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

    // Close on ESC
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    // Sync theme with dom
    useEffect(() => {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Sidebar Tabs */}
                <div className={styles.sidebar}>
                    <span className={styles.sidebarTitle}>Settings</span>
                    <div className={styles.tabList}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.sidebarFooter}>
                        <button className={styles.logoutBtn} onClick={() => { logout(); router.push('/login'); }}>
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    <div className={styles.header}>
                        <h3 className={styles.headerTitle}>
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h3>
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Close settings">
                            <X size={18} />
                        </button>
                    </div>

                    <div className={styles.content}>
                        {activeTab === 'profile' && <ProfileSection user={user} onDataChange={setProfileData} />}
                        {activeTab === 'security' && (
                            <SecuritySection twoFactor={twoFactor} setTwoFactor={setTwoFactor} />
                        )}
                        {activeTab === 'notifications' && (
                            <NotificationsSection
                                courseUpdates={notifCourseUpdates}
                                setCourseUpdates={setNotifCourseUpdates}
                                quizReminders={notifQuizReminders}
                                setQuizReminders={setNotifQuizReminders}
                                marketing={notifMarketing}
                                setMarketing={setNotifMarketing}
                                recommendations={notifRecommendations}
                                setRecommendations={setNotifRecommendations}
                            />
                        )}
                        {activeTab === 'appearance' && (
                            <AppearanceSection theme={theme} setTheme={setTheme} />
                        )}
                        {activeTab === 'billing' && <BillingSection />}
                        {activeTab === 'connected' && <ConnectedSection />}
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button className={styles.saveBtn} onClick={handleSaveChanges}>
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Sub-sections ===== */

function ProfileSection({ user, onDataChange }: { user: any; onDataChange: (data: any) => void }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    // Address fields
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postcode, setPostcode] = useState('');
    const [country, setCountry] = useState('');

    // Professions
    const [professions, setProfessions] = useState<string[]>([]);

    // Initialize from user on mount
    useEffect(() => {
        if (user) {
            const nameParts = user.name?.split(' ') || [];
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setUsername(user.username || '');
            setStreet(user.address?.street || '');
            setCity(user.address?.city || '');
            setState(user.address?.state || '');
            setPostcode(user.address?.postcode || '');
            setCountry(user.address?.country || '');
            setProfessions(user.professions || []);
        }
    }, [user]);

    // Update parent whenever any field changes
    useEffect(() => {
        onDataChange({
            name: `${firstName} ${lastName}`.trim(),
            username,
            address: {
                street,
                city,
                state,
                postcode,
                country,
            },
            professions,
        });
    }, [firstName, lastName, username, street, city, state, postcode, country, professions, onDataChange]);

    const getInitials = () => {
        if (!user) return '??';
        const nameParts = user.name?.split(' ') || [];
        return nameParts.map(p => p[0]).join('').toUpperCase().slice(0, 2) || '??';
    };

    const PROFESSIONS = [
        'Physician', 'Nurse', 'Paramedic', 'Pharmacist',
        'Personal Trainer', 'Strength Coach', 'Athlete',
        'Researcher', 'Student', 'Other',
    ];

    const toggleProfession = (p: string) => {
        setProfessions((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    return (
        <>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Profile Photo</span>
                <div className={styles.sectionCard}>
                    <div className={styles.avatarRow}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatarLarge}>{getInitials()}</div>
                            <button className={styles.avatarOverlay} aria-label="Change avatar">
                                <Camera size={20} />
                            </button>
                        </div>
                        <div className={styles.avatarInfo}>
                            <h4>Upload a new photo</h4>
                            <p>Recommended: 256×256px, PNG or JPG</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Personal Information</span>
                <div className={styles.sectionCard}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>First Name</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First name"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last name"
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Email</label>
                            <div className={styles.emailRow}>
                                <input type="email" className={styles.formInput} value={user?.email || ''} readOnly />
                                <span className={styles.verifiedBadge}>
                                    <Check size={12} /> Verified
                                </span>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Username</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                                placeholder="username"
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Bio</label>
                            <textarea
                                className={styles.formInput}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Address</span>
                <div className={styles.sectionCard}>
                    <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Street Address</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="123 Main Street"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>City</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>State / Province</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Postcode / ZIP</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                placeholder="Postcode"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Country</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Profession</span>
                <div className={styles.sectionCard}>
                    <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-md)' }}>
                        Select all that apply — helps us personalise your experience
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                        {PROFESSIONS.map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={`btn btn-sm ${professions.includes(p) ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => toggleProfession(p)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                {professions.includes(p) && <CheckCircle2 size={13} />}
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            className={`${styles.toggle} ${on ? styles.on : ''}`}
            onClick={() => onChange(!on)}
            role="switch"
            aria-checked={on}
        >
            <span className={styles.toggleKnob} />
        </button>
    );
}

function SecuritySection({ twoFactor, setTwoFactor }: { twoFactor: boolean; setTwoFactor: (v: boolean) => void }) {
    return (
        <>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Change Password</span>
                <div className={styles.sectionCard}>
                    <div className={styles.passwordGrid}>
                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input type="password" className={styles.formInput} placeholder="••••••••" />
                        </div>
                        <div style={{ display: 'contents' }} />
                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input type="password" className={styles.formInput} placeholder="••••••••" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input type="password" className={styles.formInput} placeholder="••••••••" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Two-Factor Authentication</span>
                <div className={styles.sectionCard}>
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleInfo}>
                            <h5>Enable 2FA</h5>
                            <p>Add an extra layer of security to your account with an authenticator app</p>
                        </div>
                        <Toggle on={twoFactor} onChange={setTwoFactor} />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Active Sessions</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {mockSessions.map((session) => (
                        <div key={session.id} className={styles.sessionItem}>
                            <div className={styles.sessionInfo}>
                                <div className={styles.sessionIcon}>
                                    {session.device.includes('Mac') ? <Monitor size={18} /> : <Smartphone size={18} />}
                                </div>
                                <div className={styles.sessionMeta}>
                                    <strong>{session.device} · {session.browser}</strong>
                                    <span>{session.location} · {session.lastActive}</span>
                                </div>
                            </div>
                            {session.current ? (
                                <span className={styles.currentBadge}>Current</span>
                            ) : (
                                <button className={styles.revokeBtn}>Revoke</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Danger Zone</span>
                <div className={styles.dangerZone}>
                    <div className={styles.dangerInfo}>
                        <h5>Delete Account</h5>
                        <p>Permanently remove your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button className={styles.dangerBtn}>Delete Account</button>
                </div>
            </div>
        </>
    );
}

function NotificationsSection({
    courseUpdates, setCourseUpdates,
    quizReminders, setQuizReminders,
    marketing, setMarketing,
    recommendations, setRecommendations,
}: {
    courseUpdates: boolean; setCourseUpdates: (v: boolean) => void;
    quizReminders: boolean; setQuizReminders: (v: boolean) => void;
    marketing: boolean; setMarketing: (v: boolean) => void;
    recommendations: boolean; setRecommendations: (v: boolean) => void;
}) {
    return (
        <>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Email Notifications</span>
                <div className={styles.sectionCard}>
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleInfo}>
                            <h5>Course Updates</h5>
                            <p>Get notified when a course you&apos;re enrolled in adds new content</p>
                        </div>
                        <Toggle on={courseUpdates} onChange={setCourseUpdates} />
                    </div>
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleInfo}>
                            <h5>Quiz Reminders</h5>
                            <p>Receive reminders to complete pending quizzes and assessments</p>
                        </div>
                        <Toggle on={quizReminders} onChange={setQuizReminders} />
                    </div>
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleInfo}>
                            <h5>New Course Recommendations</h5>
                            <p>Personalized course suggestions based on your interests</p>
                        </div>
                        <Toggle on={recommendations} onChange={setRecommendations} />
                    </div>
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleInfo}>
                            <h5>Marketing Emails</h5>
                            <p>Promotions, discounts, and SafePulse news</p>
                        </div>
                        <Toggle on={marketing} onChange={setMarketing} />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Digest Frequency</span>
                <div className={styles.sectionCard}>
                    <div className={styles.formGroup}>
                        <label>Email digest</label>
                        <select className={styles.formInput} defaultValue="daily">
                            <option value="instant">Instant — send immediately</option>
                            <option value="daily">Daily — one email per day</option>
                            <option value="weekly">Weekly — one email per week</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}

function AppearanceSection({ theme, setTheme }: { theme: string; setTheme: (v: 'light' | 'dark' | 'system') => void }) {
    return (
        <>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Theme</span>
                <div className={styles.sectionCard}>
                    <div className={styles.themeGrid}>
                        <button
                            className={`${styles.themeOption} ${theme === 'light' ? styles.activeTheme : ''}`}
                            onClick={() => setTheme('light')}
                        >
                            <div className={styles.themePreview}>
                                <Sun size={28} />
                            </div>
                            <span>Light</span>
                        </button>
                        <button
                            className={`${styles.themeOption} ${theme === 'dark' ? styles.activeTheme : ''}`}
                            onClick={() => setTheme('dark')}
                        >
                            <div className={styles.themePreview}>
                                <Moon size={28} />
                            </div>
                            <span>Dark</span>
                        </button>
                        <button
                            className={`${styles.themeOption} ${theme === 'system' ? styles.activeTheme : ''}`}
                            onClick={() => setTheme('system')}
                        >
                            <div className={styles.themePreview}>
                                <MonitorSmartphone size={28} />
                            </div>
                            <span>System</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Layout</span>
                <div className={styles.sectionCard}>
                    <div className={styles.toggleRow}>
                        <div className={styles.toggleInfo}>
                            <h5>Compact Sidebar</h5>
                            <p>Start with the sidebar collapsed by default</p>
                        </div>
                        <Toggle on={false} onChange={() => { }} />
                    </div>
                </div>
            </div>
        </>
    );
}

function BillingSection() {
    return (
        <>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Payment Method</span>
                <div className={styles.sectionCard}>
                    <div className={styles.paymentCard}>
                        <div className={styles.paymentInfo}>
                            <div className={styles.paymentIcon}>VISA</div>
                            <div className={styles.paymentMeta}>
                                <strong>•••• •••• •••• 4242</strong>
                                <span>Expires 09/2027</span>
                            </div>
                        </div>
                        <button className={styles.updateBtn}>Update</button>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.sectionLabel}>Purchase History</span>
                <div className={styles.sectionCard} style={{ padding: 0, overflow: 'hidden' }}>
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPurchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td>{purchase.course}</td>
                                    <td>{purchase.date}</td>
                                    <td>{purchase.amount}</td>
                                    <td>
                                        <button className={styles.downloadLink}>
                                            <Download size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function ConnectedSection() {
    return (
        <div className={styles.section}>
            <span className={styles.sectionLabel}>Sign-in Providers</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div className={styles.connectedAccount}>
                    <div className={styles.connectedInfo}>
                        <div className={`${styles.connectedIcon} ${styles.google}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <div className={styles.connectedMeta}>
                            <strong>Google</strong>
                            <span>student@safepulse.com</span>
                        </div>
                    </div>
                    <span className={`${styles.connectedStatus} ${styles.linked}`}>
                        <Check size={12} /> Connected
                    </span>
                </div>

                <div className={styles.connectedAccount}>
                    <div className={styles.connectedInfo}>
                        <div className={`${styles.connectedIcon} ${styles.apple}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.72 4.33-3.74 4.25z" />
                            </svg>
                        </div>
                        <div className={styles.connectedMeta}>
                            <strong>Apple</strong>
                            <span>Not connected</span>
                        </div>
                    </div>
                    <button className={styles.linkBtn}>Connect</button>
                </div>
            </div>
        </div>
    );
}
