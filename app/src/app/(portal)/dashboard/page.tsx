'use client';

import styles from './page.module.css';
import { BookOpen, Clock, Award, TrendingUp, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const enrolledCourses = [
    {
        id: '1',
        title: 'PED Safety & Harm Reduction Fundamentals',
        progress: 68,
        totalLessons: 24,
        completedLessons: 16,
        lastAccessed: '2 hours ago',
        coverColor: 'linear-gradient(135deg, #00d4aa, #00a88a)',
        coverImage: '/thumbnails/runner.png',
    },
    {
        id: '2',
        title: 'Longevity Protocols: Biomarker Management',
        progress: 35,
        totalLessons: 18,
        completedLessons: 6,
        lastAccessed: '1 day ago',
        coverColor: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        coverImage: '/thumbnails/light-trails.png',
    },
    {
        id: '3',
        title: 'Performance Science: Evidence-Based Approach',
        progress: 12,
        totalLessons: 32,
        completedLessons: 4,
        lastAccessed: '3 days ago',
        coverColor: 'linear-gradient(135deg, #f59e0b, #d97706)',
        coverImage: '/thumbnails/abstract-lens.png',
    },
];

const recommendedCourses = [
    {
        id: '4',
        title: 'Neurochemistry & Mood Management During Cycles',
        level: 'Intermediate',
        lessons: 14,
        duration: '8 hours',
        price: 79.99,
        coverColor: 'linear-gradient(135deg, #ec4899, #be185d)',
        coverImage: '/thumbnails/spotlight.png',
    },
    {
        id: '5',
        title: 'Post-Cycle Recovery: Complete Guide',
        level: 'Beginner',
        lessons: 20,
        duration: '12 hours',
        price: 59.99,
        coverColor: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        coverImage: '/thumbnails/runner.png',
    },
    {
        id: '6',
        title: 'Advanced Dosing Logic & Interaction Mapping',
        level: 'Advanced',
        lessons: 28,
        duration: '16 hours',
        price: 129.99,
        coverColor: 'linear-gradient(135deg, #14b8a6, #0d9488)',
        coverImage: '/thumbnails/light-trails.png',
    },
    {
        id: '7',
        title: 'Blood Work Interpretation for Athletes',
        level: 'Beginner',
        lessons: 10,
        duration: '5 hours',
        price: 39.99,
        coverColor: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        coverImage: '/thumbnails/abstract-lens.png',
    },
];

const stats = [
    { label: 'Enrolled Courses', value: '3', icon: BookOpen, change: '+1 this month', positive: true },
    { label: 'Hours Studied', value: '34', icon: Clock, change: '+12% vs last month', positive: true },
    { label: 'Completed', value: '1', icon: Award, change: 'Certificate earned', positive: true },
    { label: 'Quiz Score', value: '87%', icon: TrendingUp, change: '+5% improving', positive: true },
];

export default function DashboardPage() {
    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <div>
                    <h1>Welcome back</h1>
                    <p className="text-secondary">Continue your learning journey with SafePulse.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-4 ${styles.statsGrid}`}>
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`card ${styles.statCard}`}>
                            <div className={styles.statHeader}>
                                <div className={styles.statIconBox}>
                                    <Icon size={20} />
                                </div>
                                <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className={styles.statBody}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Continue Learning */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Continue Learning</h2>
                    <Link href="/my-courses" className={styles.viewAll}>
                        View All <ChevronRight size={16} />
                    </Link>
                </div>
                <div className={styles.coursesList}>
                    {enrolledCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}/learn`}
                            className={`card card-hover card-interactive ${styles.enrolledCard}`}
                        >
                            <div className={styles.enrolledCover} style={course.coverImage
                                ? { backgroundImage: `url(${course.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                : { background: course.coverColor }
                            }>
                                <div className={styles.playButton}>
                                    <Play size={20} fill="white" />
                                </div>
                            </div>
                            <div className={styles.enrolledInfo}>
                                <h4>{course.title}</h4>
                                <div className={styles.enrolledMeta}>
                                    <span className="text-xs text-tertiary">
                                        {course.completedLessons}/{course.totalLessons} lessons
                                    </span>
                                    <span className="text-xs text-tertiary">Last: {course.lastAccessed}</span>
                                </div>
                                <div className={styles.progressRow}>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                    <span className={styles.progressText}>{course.progress}%</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recommended Courses */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Recommended For You</h2>
                    <Link href="/courses" className={styles.viewAll}>
                        Browse All <ChevronRight size={16} />
                    </Link>
                </div>
                <div className={`grid grid-4 ${styles.recommendedGrid}`}>
                    {recommendedCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className={`card card-hover card-interactive ${styles.recommendedCard}`}
                        >
                            <div className={styles.recommendedCover} style={course.coverImage
                                ? { backgroundImage: `url(${course.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                : { background: course.coverColor }
                            }>
                                <span className={`badge badge-accent ${styles.levelBadge}`}>{course.level}</span>
                            </div>
                            <div className={styles.recommendedInfo}>
                                <h5>{course.title}</h5>
                                <div className={styles.courseMeta}>
                                    <span className="text-xs text-tertiary">{course.lessons} lessons</span>
                                    <span className="text-xs text-tertiary">{course.duration}</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <span className={styles.price}>${course.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
