'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { BookOpen, Clock, CheckCircle, Play, MoreHorizontal } from 'lucide-react';

const enrolledCourses = [
    {
        id: '1',
        title: 'PED Safety & Harm Reduction Fundamentals',
        progress: 65,
        completedLessons: 16,
        totalLessons: 24,
        lastAccessed: '2 hours ago',
        coverColor: 'linear-gradient(135deg, #00d4aa, #00a88a)',
        currentLesson: 'Module 3: Blood Work Monitoring',
        status: 'in-progress' as const,
    },
    {
        id: '5',
        title: 'Post-Cycle Recovery: Complete Guide',
        progress: 30,
        completedLessons: 6,
        totalLessons: 20,
        lastAccessed: '1 day ago',
        coverColor: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        currentLesson: 'Module 2: Hormonal Restoration',
        status: 'in-progress' as const,
    },
    {
        id: '7',
        title: 'Blood Work Interpretation for Athletes',
        progress: 100,
        completedLessons: 10,
        totalLessons: 10,
        lastAccessed: '3 days ago',
        coverColor: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        currentLesson: 'Completed',
        status: 'completed' as const,
    },
];

type FilterStatus = 'all' | 'in-progress' | 'completed';

export default function MyCoursesPage() {
    const [filter, setFilter] = useState<FilterStatus>('all');

    const filtered = enrolledCourses.filter((course) => {
        if (filter === 'all') return true;
        return course.status === filter;
    });

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1>My Courses</h1>
                    <p className="text-secondary">Track your learning progress and continue where you left off.</p>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({enrolledCourses.length})
                </button>
                <button
                    className={`${styles.tab} ${filter === 'in-progress' ? styles.tabActive : ''}`}
                    onClick={() => setFilter('in-progress')}
                >
                    In Progress ({enrolledCourses.filter(c => c.status === 'in-progress').length})
                </button>
                <button
                    className={`${styles.tab} ${filter === 'completed' ? styles.tabActive : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({enrolledCourses.filter(c => c.status === 'completed').length})
                </button>
            </div>

            <div className={styles.courseList}>
                {filtered.map((course) => (
                    <div key={course.id} className={styles.courseRow}>
                        <div className={styles.courseCover} style={{ background: course.coverColor }}>
                            {course.status === 'completed' ? (
                                <CheckCircle size={20} />
                            ) : (
                                <Play size={20} />
                            )}
                        </div>
                        <div className={styles.courseInfo}>
                            <Link href={`/courses/${course.id}/learn`} className={styles.courseTitle}>
                                {course.title}
                            </Link>
                            <div className={styles.courseMeta}>
                                <span className="text-xs text-tertiary">
                                    <BookOpen size={12} /> {course.completedLessons}/{course.totalLessons} lessons
                                </span>
                                <span className="text-xs text-tertiary">
                                    <Clock size={12} /> {course.lastAccessed}
                                </span>
                            </div>
                            {course.status !== 'completed' && (
                                <p className="text-sm text-secondary">{course.currentLesson}</p>
                            )}
                        </div>
                        <div className={styles.courseProgress}>
                            <div className={styles.progressBarWrap}>
                                <div
                                    className={`${styles.progressBar} ${course.status === 'completed' ? styles.progressComplete : ''}`}
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                            <span className={`text-sm ${course.status === 'completed' ? styles.completeText : ''}`}>
                                {course.progress}%
                            </span>
                        </div>
                        <div className={styles.courseActions}>
                            <Link
                                href={`/courses/${course.id}/learn`}
                                className="btn btn-sm btn-primary"
                            >
                                {course.status === 'completed' ? 'Review' : 'Continue'}
                            </Link>
                            <button className={styles.moreBtn}>
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
