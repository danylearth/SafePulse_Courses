'use client';

import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import styles from './CourseCertificate.module.css';
import { Download, Share2 } from 'lucide-react';

interface CourseCertificateProps {
    courseName: string;
    studentName: string;
    completionDate: string;
    lessonsCompleted: number;
    quizScore?: number;
    certificateId?: string;
}

export default function CourseCertificate({
    courseName,
    studentName,
    completionDate,
    lessonsCompleted,
    quizScore,
    certificateId = 'SP-2026-001',
}: CourseCertificateProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={styles.wrapper}>
            <div className={styles.certificate}>
                {/* Decorative borders */}
                <div className={styles.borderOuter} />
                <div className={styles.borderInner} />

                {/* Content */}
                <div className={styles.content}>
                    {/* Logo */}
                    <div className={styles.logoArea}>
                        <Image
                            src={isDark ? '/logo-full.png' : '/logo-full-dark.png'}
                            alt="SafePulse"
                            width={180}
                            height={42}
                            className={styles.logo}
                        />
                        <span className={styles.academyBadge}>ACADEMY</span>
                    </div>

                    {/* Title */}
                    <div className={styles.titleArea}>
                        <h2 className={styles.certTitle}>Certificate of Completion</h2>
                        <div className={styles.divider} />
                    </div>

                    {/* Recipient */}
                    <div className={styles.recipientArea}>
                        <p className={styles.presentedTo}>This is to certify that</p>
                        <h1 className={styles.studentName}>{studentName}</h1>
                        <p className={styles.completionText}>
                            has successfully completed the course
                        </p>
                    </div>

                    {/* Course Name */}
                    <div className={styles.courseArea}>
                        <h3 className={styles.courseName}>{courseName}</h3>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{lessonsCompleted}</span>
                            <span className={styles.statLabel}>Lessons</span>
                        </div>
                        {quizScore !== undefined && (
                            <div className={styles.stat}>
                                <span className={styles.statValue}>{quizScore}%</span>
                                <span className={styles.statLabel}>Quiz Score</span>
                            </div>
                        )}
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{completionDate}</span>
                            <span className={styles.statLabel}>Date Completed</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.signatureBlock}>
                            <div className={styles.signatureLine} />
                            <span>SafePulse Academy</span>
                        </div>
                        <div className={styles.certId}>
                            <span>Certificate ID: {certificateId}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button className="btn btn-primary">
                    <Download size={16} /> Download Certificate
                </button>
                <button className="btn btn-secondary">
                    <Share2 size={16} /> Share
                </button>
            </div>
        </div>
    );
}
