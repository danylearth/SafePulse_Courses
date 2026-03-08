'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import {
    LayoutDashboard,
    BookOpen,
    Search,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    LogOut,
    BarChart3,
} from 'lucide-react';

const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Courses', icon: Search },
    { href: '/my-courses', label: 'My Courses', icon: BookOpen },
];

const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/affiliates', label: 'Affiliates', icon: HelpCircle },
    { href: '/admin/payments', label: 'Payments', icon: Settings },
];

interface SidebarProps {
    isAdmin?: boolean;
    onOpenSettings?: () => void;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

export default function Sidebar({ isAdmin = false, onOpenSettings, collapsed = false, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const { theme } = useTheme();
    const links = isAdmin ? adminLinks : studentLinks;

    // Check both the React theme state AND the actual DOM attribute
    // to avoid the flash issue where theme starts as 'light' before localStorage loads
    const [isDark, setIsDark] = useState(true); // default dark to match the app's primary theme

    useEffect(() => {
        const attr = document.documentElement.getAttribute('data-theme');
        setIsDark(attr === 'dark');
    }, [theme]);

    const fullLogo = isDark ? '/logo-full.png' : '/logo-full-dark.png';
    const iconLogo = isDark ? '/logo-icon.png' : '/logo-icon-dark.png';

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <Link href={isAdmin ? '/admin' : '/dashboard'} className={styles.logo}>
                    {collapsed ? (
                        <Image src={iconLogo} alt="SafePulse" width={32} height={32} className={styles.logoImg} />
                    ) : (
                        <Image src={fullLogo} alt="SafePulse Academy" width={140} height={32} className={styles.logoImg} />
                    )}
                </Link>
                <button
                    className={styles.toggle}
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className={styles.nav}>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href ||
                        (link.href !== '/dashboard' && link.href !== '/admin' && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            title={collapsed ? link.label : undefined}
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{link.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button
                    className={styles.navItem}
                    title={collapsed ? 'Settings' : undefined}
                    onClick={onOpenSettings}
                >
                    <Settings size={20} />
                    {!collapsed && <span>Settings</span>}
                </button>
                {!collapsed && (
                    <div className={styles.userInfo}>
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>Dan Sherwood</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
