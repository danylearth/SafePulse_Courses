'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { Star, Users, BookOpen, Clock, Play, ChevronDown, ChevronUp, Award, FileText, Video, Download, Shield, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CourseData {
    id: string;
    title: string;
    description: string;
    level: string;
    rating: number;
    reviewCount: number;
    students: number;
    price: number;
    salePrice: number | null;
    coverColor: string;
    totalSections: number;
    totalLessons: number;
    totalDuration: string;
    includes: { icon: React.ComponentType<{ size: number }>; text: string }[];
    sections: { title: string; lessons: { title: string; type: string; duration: string }[] }[];
}

const demoCourse: CourseData = {
    id: '1',
    title: 'PED Safety & Harm Reduction Fundamentals',
    description: 'This comprehensive course provides a solid foundation in understanding the risks, safe practices, and monitoring protocols essential for anyone involved in performance-enhancing drug use. Built from SafePulse\'s evidence-based research, this course covers everything from basic pharmacology to advanced risk assessment frameworks.\n\nWhether you\'re a healthcare professional, coach, or individual looking to make more informed decisions, this course will equip you with the knowledge to reduce harm and prioritise long-term health.',
    level: 'Beginner',
    rating: 4.9,
    reviewCount: 236,
    students: 1240,
    price: 89.99,
    salePrice: null,
    coverColor: 'linear-gradient(135deg, #00d4aa, #00a88a)',
    totalSections: 8,
    totalLessons: 24,
    totalDuration: '14 hours',
    includes: [
        { icon: Video, text: '14 hours on-demand video' },
        { icon: Download, text: '12 downloadable resources' },
        { icon: FileText, text: '24 articles & reading materials' },
        { icon: Award, text: 'Certificate of completion' },
        { icon: Shield, text: 'Lifetime access' },
    ],
    sections: [
        {
            title: 'Week 1 - Introduction to PED Safety',
            lessons: [
                { title: 'Welcome & Course Overview', type: 'video', duration: '12min' },
                { title: 'Understanding the PED Landscape', type: 'article', duration: '25min' },
                { title: 'Risk vs. Reward: A Framework', type: 'video', duration: '45min' },
                { title: 'Module 1 Quiz', type: 'quiz', duration: '10min' },
            ],
        },
        {
            title: 'Week 2 - Pharmacology Basics',
            lessons: [
                { title: 'How Compounds Work in the Body', type: 'video', duration: '1h 10min' },
                { title: 'Anabolic vs. Androgenic Effects', type: 'article', duration: '30min' },
                { title: 'Half-Lives and Dosing Windows', type: 'video', duration: '38min' },
            ],
        },
        {
            title: 'Week 3 - Monitoring & Blood Work',
            lessons: [
                { title: 'Essential Blood Markers to Track', type: 'video', duration: '55min' },
                { title: 'Reading Your Results', type: 'article', duration: '20min' },
                { title: 'When to Seek Medical Attention', type: 'video', duration: '32min' },
                { title: 'Case Study: Real-World Examples', type: 'article', duration: '40min' },
            ],
        },
        {
            title: 'Week 4 - Organ Protection Protocols',
            lessons: [
                { title: 'Liver Protection Strategies', type: 'video', duration: '48min' },
                { title: 'Cardiovascular Risk Management', type: 'video', duration: '52min' },
                { title: 'Kidney Health Maintenance', type: 'article', duration: '25min' },
            ],
        },
        {
            title: 'Week 5 - Post-Cycle Therapy',
            lessons: [
                { title: 'PCT Fundamentals', type: 'video', duration: '1h 5min' },
                { title: 'Hormonal Recovery Timeline', type: 'article', duration: '30min' },
                { title: 'Common PCT Mistakes', type: 'video', duration: '35min' },
            ],
        },
    ],
};

function getAthleteCodeCourseData(): CourseData | null {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { athleteCodeCourse } = require('@/data/courses/athlete-code');
        return {
            id: 'athlete-code',
            title: athleteCodeCourse.title,
            description: athleteCodeCourse.longDescription || athleteCodeCourse.description,
            level: athleteCodeCourse.level,
            rating: 0,
            reviewCount: 0,
            students: 0,
            price: 0,
            salePrice: null,
            coverColor: athleteCodeCourse.coverColor,
            totalSections: 1,
            totalLessons: athleteCodeCourse.totalLessons,
            totalDuration: athleteCodeCourse.duration,
            includes: [
                { icon: FileText, text: '50 articles & reading materials' },
                { icon: Award, text: 'Certificate of completion' },
                { icon: Shield, text: 'Lifetime access' },
            ],
            sections: [{
                title: 'Enhanced Games Athlete Code',
                lessons: athleteCodeCourse.lessons.map((l: { title: string; type: string; duration: string }) => ({
                    title: l.title,
                    type: l.type,
                    duration: l.duration,
                })),
            }],
        };
    } catch {
        return null;
    }
}

function getCourseById(id: string): CourseData {
    if (id === 'athlete-code') {
        return getAthleteCodeCourseData() || demoCourse;
    }
    return demoCourse;
}

// Mock progress data (will come from Supabase later)
// NOTE: set enrolled: true to preview the enrolled state
const enrolledProgress = {
    enrolled: false,
    progress: 45,
    completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5'],
    currentLessonId: 'l6',
    currentLesson: 'Anabolic vs. Androgenic Effects',
    currentSection: 'Week 2 - Pharmacology Basics',
};

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = (params?.id as string) || '1';
    const course = getCourseById(courseId);
    const isAthleteCode = courseId === 'athlete-code';
    const [expandedSections, setExpandedSections] = useState<number[]>([0]);

    const toggleSection = (index: number) => {
        setExpandedSections((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const expandAll = () => {
        setExpandedSections(course.sections.map((_, i) => i));
    };

    return (
        <div className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link href="/courses">Courses</Link>
                <span>/</span>
                <span>{course.title}</span>
            </div>

            <div className={styles.layout}>
                {/* Main Content */}
                <div className={styles.mainContent}>
                    {/* Hero */}
                    <div className={styles.hero}>
                        <div className={styles.ratingRow}>
                            <Star size={16} fill="var(--warning)" color="var(--warning)" />
                            <span className={styles.rating}>{course.rating}</span>
                            <span className="text-sm text-secondary">based on {course.reviewCount} reviews</span>
                        </div>
                        <h1>{course.title}</h1>
                        <p className="text-secondary">{course.description}</p>
                        <div className={styles.metaRow}>
                            <div className={styles.authorBadge}>
                                <div className="avatar avatar-sm">
                                    <Shield size={16} />
                                </div>
                                <span className="text-accent">SafePulse</span>
                            </div>
                            <span className="text-sm text-tertiary">
                                <Users size={14} /> {course.students}+ students enrolled
                            </span>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className={styles.contentSection}>
                        <div className={styles.contentHeader}>
                            <h2>Course Content</h2>
                            <div className={styles.contentStats}>
                                <span className="text-sm text-secondary">
                                    <BookOpen size={14} /> {course.totalSections} sections
                                </span>
                                <span className="text-sm text-secondary">
                                    <FileText size={14} /> {course.totalLessons} lessons
                                </span>
                                <span className="text-sm text-secondary">
                                    <Clock size={14} /> {course.totalDuration}
                                </span>
                                <button className={styles.expandBtn} onClick={expandAll}>
                                    Expand all sections
                                </button>
                            </div>
                        </div>

                        <div className={styles.sectionsList}>
                            {course.sections.map((section, index) => (
                                <div key={index} className={styles.sectionItem}>
                                    <button
                                        className={styles.sectionToggle}
                                        onClick={() => toggleSection(index)}
                                    >
                                        <div className={styles.sectionLeft}>
                                            {expandedSections.includes(index) ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                            <span>{section.title}</span>
                                        </div>
                                        <span className="text-xs text-tertiary">
                                            {section.lessons.length} lessons
                                        </span>
                                    </button>
                                    {expandedSections.includes(index) && (
                                        <div className={styles.lessonsList}>
                                            {section.lessons.map((lesson, li) => (
                                                <div key={li} className={styles.lessonItem}>
                                                    <div className={styles.lessonLeft}>
                                                        {lesson.type === 'video' ? (
                                                            <Play size={14} />
                                                        ) : lesson.type === 'quiz' ? (
                                                            <Award size={14} />
                                                        ) : (
                                                            <FileText size={14} />
                                                        )}
                                                        <span>{lesson.title}</span>
                                                    </div>
                                                    <span className="text-xs text-tertiary">{lesson.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {(enrolledProgress.enrolled || isAthleteCode) ? (
                        /* Enrolled: show progress card */
                        <div className={`card ${styles.buyCard}`}>
                            <div className={styles.buyCover} style={{ background: course.coverColor }}>
                                <div className={styles.playOverlay}>
                                    <Play size={32} fill="white" />
                                </div>
                            </div>
                            <div className={styles.buyBody}>
                                {/* Overall progress */}
                                <div className={styles.progressSection}>
                                    <div className={styles.progressHeader}>
                                        <span className="text-sm" style={{ fontWeight: 600 }}>Your Progress</span>
                                        <span className="text-sm text-accent" style={{ fontWeight: 700 }}>{enrolledProgress.progress}%</span>
                                    </div>
                                    <div className="progress-bar" style={{ height: '8px' }}>
                                        <div className="progress-bar-fill" style={{ width: `${enrolledProgress.progress}%` }}></div>
                                    </div>
                                    <span className="text-xs text-secondary">
                                        {enrolledProgress.completedLessons.length} of {course.sections.reduce((t, s) => t + s.lessons.length, 0)} lessons completed
                                    </span>
                                </div>

                                {/* Current lesson */}
                                <div className={styles.currentLesson}>
                                    <span className="text-xs text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Currently On</span>
                                    <div className={styles.currentLessonInfo}>
                                        <div className={styles.currentLessonDot}></div>
                                        <div>
                                            <p className="text-sm" style={{ fontWeight: 500 }}>{enrolledProgress.currentLesson}</p>
                                            <p className="text-xs text-tertiary">{enrolledProgress.currentSection}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/courses/${params?.id || course.id}/learn`}
                                    className="btn btn-primary btn-lg w-full"
                                >
                                    <Play size={18} /> Continue Learning
                                </Link>
                                <button className="btn btn-ghost btn-sm w-full" style={{ color: 'var(--text-tertiary)' }}>
                                    <RotateCcw size={14} /> Restart Course
                                </button>

                                <div className={styles.includesList}>
                                    <h5>This course includes</h5>
                                    {course.includes.map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} className={styles.includeItem}>
                                                <Icon size={16} />
                                                <span className="text-sm">{item.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Not enrolled: show buy card */
                        <div className={`card ${styles.buyCard}`}>
                            <div className={styles.buyCover} style={{ background: course.coverColor }}>
                                <div className={styles.playOverlay}>
                                    <Play size={32} fill="white" />
                                </div>
                            </div>
                            <div className={styles.buyBody}>
                                <div className={styles.priceRow}>
                                    {course.salePrice ? (
                                        <>
                                            <span className={styles.salePrice}>${course.salePrice}</span>
                                            <span className={styles.originalPrice}>${course.price}</span>
                                        </>
                                    ) : (
                                        <span className={styles.price}>${course.price.toFixed(2)}</span>
                                    )}
                                </div>
                                <button className="btn btn-primary btn-lg w-full">
                                    <Play size={18} /> Buy Course Now
                                </button>
                                <button className="btn btn-secondary btn-lg w-full">
                                    Preview Course
                                </button>

                                <div className={styles.includesList}>
                                    <h5>This course includes</h5>
                                    {course.includes.map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} className={styles.includeItem}>
                                                <Icon size={16} />
                                                <span className="text-sm">{item.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
