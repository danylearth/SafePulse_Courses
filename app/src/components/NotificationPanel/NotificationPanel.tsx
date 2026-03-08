'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './NotificationPanel.module.css';
import {
    X,
    Bell,
    BellOff,
    BookOpen,
    HelpCircle,
    Trophy,
    Settings,
    CheckCheck,
} from 'lucide-react';

// --- Types ---
type NotifCategory = 'course' | 'quiz' | 'achievement' | 'system';
type FilterTab = 'all' | 'unread' | 'courses' | 'system';

interface Notification {
    id: string;
    category: NotifCategory;
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
}

// --- Mock Data ---
const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        category: 'course',
        title: 'New lesson available',
        description: 'Module 4 of "Workplace Safety Essentials" is now unlocked. Dive in!',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
        read: false,
    },
    {
        id: '2',
        category: 'quiz',
        title: 'Quiz reminder',
        description: 'You have an incomplete quiz in "Fire Safety Fundamentals". Pick up where you left off.',
        timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 min ago
        read: false,
    },
    {
        id: '3',
        category: 'achievement',
        title: 'Achievement unlocked! 🎉',
        description: 'You completed your first course. Great start on your safety journey!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
    },
    {
        id: '4',
        category: 'system',
        title: 'Platform update',
        description: 'We have added dark mode and improved course navigation. Check it out!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false,
    },
    {
        id: '5',
        category: 'course',
        title: 'Course content updated',
        description: '"Risk Assessment Masterclass" has been updated with 3 new lessons.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
    },
    {
        id: '6',
        category: 'quiz',
        title: 'Quiz results ready',
        description: 'Your "Electrical Safety" quiz has been graded. You scored 92%!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
    },
    {
        id: '7',
        category: 'achievement',
        title: '3-day streak! 🔥',
        description: 'You have been learning for 3 days in a row. Keep the momentum going!',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
    },
    {
        id: '8',
        category: 'system',
        title: 'Welcome to SafePulse Academy',
        description: 'Thanks for signing up! Start with our recommended course to get going.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        read: true,
    },
];

// --- Helpers ---
function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week ago';
    return `${weeks} weeks ago`;
}

function getCategoryIcon(category: NotifCategory) {
    switch (category) {
        case 'course': return BookOpen;
        case 'quiz': return HelpCircle;
        case 'achievement': return Trophy;
        case 'system': return Settings;
    }
}

// --- Filter Definitions ---
const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'courses', label: 'Courses' },
    { id: 'system', label: 'System' },
];

// --- Component ---
interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    // Derived data
    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = notifications.filter((n) => {
        switch (activeFilter) {
            case 'unread': return !n.read;
            case 'courses': return n.category === 'course' || n.category === 'quiz';
            case 'system': return n.category === 'system';
            default: return true;
        }
    });

    // Actions
    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <>
            {/* Backdrop */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Panel */}
            <div className={styles.panel} ref={panelRef}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.title}>Notifications</h2>
                        {unreadCount > 0 && (
                            <span className={styles.unreadBadge}>{unreadCount}</span>
                        )}
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.markAllBtn}
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            title="Mark all as read"
                        >
                            <CheckCheck size={14} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                            Mark all read
                        </button>
                        <button className={styles.closeBtn} onClick={onClose} title="Close">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className={styles.tabs}>
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeFilter === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveFilter(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                {filteredNotifications.length > 0 ? (
                    <div className={styles.list}>
                        {filteredNotifications.map((notif) => {
                            const Icon = getCategoryIcon(notif.category);
                            return (
                                <button
                                    key={notif.id}
                                    className={`${styles.notificationItem} ${!notif.read ? styles.unread : ''}`}
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    {!notif.read && <span className={styles.unreadDot} />}
                                    <div className={`${styles.iconWrapper} ${styles[notif.category]}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className={styles.notifContent}>
                                        <span className={styles.notifTitle}>{notif.title}</span>
                                        <span className={styles.notifDesc}>{notif.description}</span>
                                        <span className={styles.notifTime}>{timeAgo(notif.timestamp)}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <BellOff size={24} />
                        </div>
                        <p className={styles.emptyTitle}>
                            {activeFilter === 'unread' ? 'All caught up!' : 'No notifications'}
                        </p>
                        <p className={styles.emptyDesc}>
                            {activeFilter === 'unread'
                                ? "You've read all your notifications."
                                : 'Nothing here yet. Check back later!'}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.viewAllBtn}>View all notifications</button>
                </div>
            </div>
        </>
    );
}
