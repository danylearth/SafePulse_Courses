'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import styles from './Sidebar.module.css';
import {
    LayoutDashboard,
    BookOpen,
    Library,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    LogOut,
    BarChart3,
} from 'lucide-react';

const studentLinks = [
    { href: '/courses/athlete-code', label: 'Courses', icon: Library },
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
    const { user } = useAuth();
    const links = isAdmin ? adminLinks : studentLinks;

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <Link href={isAdmin ? '/admin' : '/courses/athlete-code'} className={styles.logo}>
                    {collapsed ? (
                        <>
                            <Image src="/logo-icon.png" alt="SafePulse" width={32} height={32} className={`${styles.logoImg} ${styles.logoDark}`} />
                            <Image src="/logo-icon-dark.png" alt="SafePulse" width={32} height={32} className={`${styles.logoImg} ${styles.logoLight}`} />
                        </>
                    ) : (
                        <>
                            <Image src="/logo-full.png" alt="SafePulse Academy" width={140} height={32} className={`${styles.logoImg} ${styles.logoDark}`} />
                            <Image src="/logo-full-dark.png" alt="SafePulse Academy" width={140} height={32} className={`${styles.logoImg} ${styles.logoLight}`} />
                        </>
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
                {!collapsed && user?.name && (
                    <div className={styles.userInfo}>
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>{user.name}</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
