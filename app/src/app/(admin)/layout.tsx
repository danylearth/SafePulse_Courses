'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { useAuth } from '@/lib/authContext';
import styles from './layout.module.css';
import { Search, Bell } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'A';

    return (
        <div className={styles.layout}>
            <Sidebar isAdmin />
            <div className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.headerActions}>
                        <ThemeToggle />
                        <button className={styles.notifButton}>
                            <Bell size={20} />
                        </button>
                        <div className="avatar">{initials}</div>
                    </div>
                </header>
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}

