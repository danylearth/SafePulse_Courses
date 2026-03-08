'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import AccountSettingsModal from '@/components/AccountSettingsModal/AccountSettingsModal';
import NotificationPanel from '@/components/NotificationPanel/NotificationPanel';
import styles from './layout.module.css';
import { Search, Bell } from 'lucide-react';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar
                onOpenSettings={() => setIsSettingsOpen(true)}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className={`${styles.main} ${sidebarCollapsed ? styles.mainCollapsed : ''}`}>
                <header className={styles.header}>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search courses, lessons..."
                            className={styles.searchInput}
                        />
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
                        >SP</div>
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
    );
}


