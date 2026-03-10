'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import AccountSettingsModal from '@/components/AccountSettingsModal/AccountSettingsModal';
import NotificationPanel from '@/components/NotificationPanel/NotificationPanel';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { useAuth } from '@/lib/authContext';
import styles from './layout.module.css';
import { Search, Bell, BookOpen } from 'lucide-react';

// All courses available for search (enrolled + catalogue)
const ALL_COURSES = [
    { id: '1', title: 'PED Safety & Harm Reduction Fundamentals', enrolled: true },
    { id: '2', title: 'Longevity Protocols: Biomarker Management', enrolled: true },
    { id: '3', title: 'Performance Science: Evidence-Based Approach', enrolled: true },
    { id: '4', title: 'Neurochemistry & Mood Management During Cycles', enrolled: false },
    { id: '5', title: 'Post-Cycle Recovery: Complete Guide', enrolled: false },
    { id: '6', title: 'Advanced Dosing Logic & Interaction Mapping', enrolled: false },
    { id: '7', title: 'Blood Work Interpretation for Athletes', enrolled: false },
    { id: 'athlete-code', title: 'Enhanced Games Athlete Code', enrolled: true },
];

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user } = useAuth();
    const isLearnPage = pathname?.includes('/learn');

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Auto-collapse main sidebar on learn pages so the lesson sidebar has room
    const effectiveSidebarCollapsed = isLearnPage || sidebarCollapsed;

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const searchResults = searchQuery.trim().length > 0
        ? ALL_COURSES.filter((c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const showDropdown = isSearchFocused && searchQuery.trim().length > 0;

    // Close search dropdown on click outside
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
            setIsSearchFocused(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (
        <AuthGuard>
            <div className={styles.layout}>
                <Sidebar
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    collapsed={effectiveSidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <div className={`${styles.main} ${effectiveSidebarCollapsed ? styles.mainCollapsed : ''}`}>
                    <header className={styles.header}>
                        <div className={styles.searchWrapper} ref={searchRef}>
                            <div className={styles.searchBar}>
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search courses, lessons..."
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setIsSearchFocused(false);
                                            (e.target as HTMLInputElement).blur();
                                        }
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        className={styles.clearBtn}
                                        onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }}
                                        title="Clear search"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {showDropdown && (
                                <div className={styles.searchDropdown}>
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className={styles.searchDropdownLabel}>
                                                {searchResults.length} course{searchResults.length !== 1 ? 's' : ''} found
                                            </div>
                                            {searchResults.map((course) => (
                                                <Link
                                                    key={course.id}
                                                    href={course.enrolled ? `/courses/${course.id}/learn` : `/courses/${course.id}`}
                                                    className={styles.searchResultItem}
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setIsSearchFocused(false);
                                                    }}
                                                >
                                                    <div className={styles.searchResultIcon}>
                                                        <BookOpen size={16} />
                                                    </div>
                                                    <div className={styles.searchResultInfo}>
                                                        <span className={styles.searchResultTitle}>{course.title}</span>
                                                        <span className={styles.searchResultMeta}>
                                                            {course.enrolled ? 'Enrolled' : 'Browse'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </>
                                    ) : (
                                        <div className={styles.searchEmpty}>
                                            No courses matching &ldquo;{searchQuery}&rdquo;
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.headerActions}>
                            <ThemeToggle />
                            <button
                                className={styles.notifButton}
                                onClick={() => setIsNotificationsOpen(true)}
                                title="Notifications"
                            >
                                <Bell size={20} />
                                <span className={styles.notifDot}></span>
                            </button>
                            <div
                                className="avatar"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsSettingsOpen(true)}
                                title="Account settings"
                            >{initials}</div>
                        </div>
                    </header>
                    <main className={styles.content}>
                        {children}
                    </main>
                </div>

                <NotificationPanel
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                />

                <AccountSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
            </div>
        </AuthGuard>
    );
}
