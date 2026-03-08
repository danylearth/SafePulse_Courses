'use client';

import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className={styles.iconWrapper}>
                <Sun size={18} className={`${styles.icon} ${theme === 'light' ? styles.active : styles.hidden}`} />
                <Moon size={18} className={`${styles.icon} ${theme === 'dark' ? styles.active : styles.hidden}`} />
            </div>
        </button>
    );
}
