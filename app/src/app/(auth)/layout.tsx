import Image from 'next/image';
import styles from './layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.root}>
            <div className={styles.brand}>
                <div className={styles.logo}>
                    <Image src="/logo-full-dark.png" alt="SafePulse Academy" width={160} height={36} priority />
                </div>
            </div>
            <div className={styles.panel}>
                {children}
            </div>
        </div>
    );
}

