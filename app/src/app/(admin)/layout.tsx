'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import styles from './layout.module.css';
import { Search, Bell } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                        <div className="avatar">A</div>
                    </div>
                </header>
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}

