'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Play, FileText, Award, Menu, BookOpen, Trophy, Loader2 } from 'lucide-react';
import QuizQuestion from '@/components/QuizQuestion/QuizQuestion';
import type { QuizQuestionData } from '@/components/QuizQuestion/QuizQuestion';
import CourseCertificate from '@/components/CourseCertificate/CourseCertificate';
import ArticleRenderer from '@/components/ArticleRenderer/ArticleRenderer';
import { getCourseProgress, markLessonComplete as persistLessonComplete, isLessonComplete } from '@/lib/progressStore';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    duration: string;
    completed: boolean;
}

interface Section {
    title: string;
    lessons: Lesson[];
}

// ── Demo course (ID "1") — kept exactly as before ──────────────────────
const demoCourseData = {
    title: 'PED Safety & Harm Reduction Fundamentals',
    sections: [
        {
            title: 'Week 1 - Introduction to PED Safety',
            lessons: [
                { id: 'l1', title: 'Welcome & Course Overview', type: 'video' as const, duration: '12min', completed: true },
                { id: 'l2', title: 'Understanding the PED Landscape', type: 'article' as const, duration: '25min', completed: true },
                { id: 'l3', title: 'Risk vs. Reward: A Framework', type: 'video' as const, duration: '45min', completed: true },
                { id: 'l4', title: 'Module 1 Quiz', type: 'quiz' as const, duration: '10min', completed: true },
            ],
        },
        {
            title: 'Week 2 - Pharmacology Basics',
            lessons: [
                { id: 'l5', title: 'How Compounds Work in the Body', type: 'video' as const, duration: '1h 10min', completed: true },
                { id: 'l6', title: 'Anabolic vs. Androgenic Effects', type: 'article' as const, duration: '30min', completed: false },
                { id: 'l7', title: 'Half-Lives and Dosing Windows', type: 'video' as const, duration: '38min', completed: false },
            ],
        },
        {
            title: 'Week 3 - Monitoring & Blood Work',
            lessons: [
                { id: 'l8', title: 'Essential Blood Markers to Track', type: 'video' as const, duration: '55min', completed: false },
                { id: 'l9', title: 'Reading Your Results', type: 'article' as const, duration: '20min', completed: false },
                { id: 'l10', title: 'When to Seek Medical Attention', type: 'video' as const, duration: '32min', completed: false },
                { id: 'l11', title: 'Case Study: Real-World Examples', type: 'article' as const, duration: '40min', completed: false },
            ],
        },
    ],
};

const demoQuizQuestions: QuizQuestionData[] = [
    {
        id: 'q1',
        question: 'Which blood marker is most critical to monitor during an anabolic cycle?',
        options: ['Vitamin D levels', 'Liver enzymes (ALT/AST)', 'Blood glucose', 'Calcium levels'],
        correctIndex: 1,
    },
    {
        id: 'q2',
        question: 'What is the primary purpose of Post-Cycle Therapy (PCT)?',
        options: [
            'To build more muscle',
            'To restore natural hormone production',
            'To increase workout intensity',
            'To reduce water retention',
        ],
        correctIndex: 1,
    },
];

// ── Dynamic course loader ──────────────────────────────────────────────
interface DynamicCourseManifest {
    title: string;
    lessons: {
        id: string;
        title: string;
        type: 'article' | 'quiz';
        duration: string;
        contentImport?: () => Promise<{ content: string }>;
        quizImport?: () => Promise<{ quizData: QuizQuestionData[] }>;
    }[];
}

async function loadDynamicCourse(courseId: string): Promise<DynamicCourseManifest | null> {
    if (courseId === 'athlete-code') {
        const { athleteCodeCourse } = await import('@/data/courses/athlete-code');

        // LESSONS learn page: All 50 article lessons (NO quizzes)
        return {
            title: athleteCodeCourse.title,
            lessons: athleteCodeCourse.lessons,
        };
    }
    return null;
}

export default function LearnPage() {
    const params = useParams();
    const courseId = (params?.id as string) || '1';
    const isDemoCourse = courseId === '1';

    // ── State ──────────────────────────────────────────────────────────
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizCorrectCount, setQuizCorrectCount] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [courseComplete, setCourseComplete] = useState(false);

    // Demo course state
    const [sections, setSections] = useState<Section[]>(demoCourseData.sections);
    const [activeLessonId, setActiveLessonId] = useState(isDemoCourse ? 'l6' : '');

    // Dynamic course state
    const [dynamicCourse, setDynamicCourse] = useState<DynamicCourseManifest | null>(null);
    const [dynamicLessons, setDynamicLessons] = useState<Lesson[]>([]);
    const [loadedContent, setLoadedContent] = useState<Record<string, string>>({});
    const [loadedQuizData, setLoadedQuizData] = useState<Record<string, QuizQuestionData[]>>({});
    const [isLoading, setIsLoading] = useState(!isDemoCourse);
    const [isContentLoading, setIsContentLoading] = useState(false);

    const courseTitle = isDemoCourse ? demoCourseData.title : (dynamicCourse?.title || '');

    // ── Load dynamic course on mount ───────────────────────────────────
    useEffect(() => {
        if (isDemoCourse) return;

        loadDynamicCourse(courseId).then((manifest) => {
            if (manifest) {
                setDynamicCourse(manifest);
                // Load progress from localStorage (use "lessons-" prefix to separate from courses)
                const progressKey = `lessons-${courseId}`;
                const progress = getCourseProgress(progressKey);
                setDynamicLessons(
                    manifest.lessons.map((l) => ({
                        id: l.id,
                        title: l.title,
                        type: l.type,
                        duration: l.duration,
                        completed: isLessonComplete(progressKey, l.id),
                    }))
                );
                // Set active lesson to last accessed or first lesson
                setActiveLessonId(progress.lastAccessedLessonId || manifest.lessons[0].id);
            }
            setIsLoading(false);
        });
    }, [courseId, isDemoCourse]);

    // ── Load lesson content on navigation (dynamic courses) ────────────
    useEffect(() => {
        if (isDemoCourse || !dynamicCourse || !activeLessonId) return;

        const lesson = dynamicCourse.lessons.find((l) => l.id === activeLessonId);
        if (!lesson) return;

        // Load article content
        if (lesson.type === 'article' && lesson.contentImport && !loadedContent[activeLessonId]) {
            setIsContentLoading(true);
            lesson.contentImport().then((mod) => {
                setLoadedContent((prev) => ({ ...prev, [activeLessonId]: mod.content }));
                setIsContentLoading(false);
            });
        }

        // Load quiz data
        if (lesson.type === 'quiz' && lesson.quizImport && !loadedQuizData[activeLessonId]) {
            setIsContentLoading(true);
            lesson.quizImport().then((mod) => {
                setLoadedQuizData((prev) => ({ ...prev, [activeLessonId]: mod.quizData }));
                setIsContentLoading(false);
            });
        }
    }, [activeLessonId, dynamicCourse, isDemoCourse, loadedContent, loadedQuizData]);

    // ── Derived values ─────────────────────────────────────────────────
    const allLessons: Lesson[] = isDemoCourse
        ? sections.flatMap((s) => s.lessons)
        : dynamicLessons;

    const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
    const currentLesson = allLessons[currentIndex];
    const totalCompleted = allLessons.filter((l) => l.completed).length;
    const progress = allLessons.length > 0 ? Math.round((totalCompleted / allLessons.length) * 100) : 0;

    // For demo course: section-level info
    const currentSection = isDemoCourse
        ? sections.find((s) => s.lessons.some((l) => l.id === activeLessonId))
        : null;
    const lessonIndexInSection = currentSection?.lessons.findIndex((l) => l.id === activeLessonId) ?? 0;

    // ── Handlers ───────────────────────────────────────────────────────
    const markLessonComplete = useCallback((lessonId: string) => {
        if (isDemoCourse) {
            setSections((prev) =>
                prev.map((section) => ({
                    ...section,
                    lessons: section.lessons.map((lesson) =>
                        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
                    ),
                }))
            );
        } else {
            // Persist to localStorage with "lessons-" prefix
            const progressKey = `lessons-${courseId}`;
            persistLessonComplete(progressKey, lessonId);
            // Update local state
            setDynamicLessons((prev) =>
                prev.map((lesson) =>
                    lesson.id === lessonId ? { ...lesson, completed: true } : lesson
                )
            );
        }
    }, [isDemoCourse, courseId]);

    const goToLesson = (id: string) => {
        setActiveLessonId(id);
        setQuizStarted(false);
        setCurrentQuizIndex(0);
        setQuizFinished(false);
        setQuizCorrectCount(0);
    };

    const handleMarkComplete = () => {
        markLessonComplete(activeLessonId);
        setTimeout(() => {
            const updatedLessons = isDemoCourse
                ? sections.flatMap((s) => s.lessons)
                : dynamicLessons;
            const allDone = updatedLessons.every((l) => l.completed || l.id === activeLessonId);
            if (allDone) {
                setCourseComplete(true);
            } else if (currentIndex < allLessons.length - 1) {
                goToLesson(allLessons[currentIndex + 1].id);
            }
        }, 500);
    };

    const handleQuizComplete = (correct: boolean) => {
        if (correct) setQuizCorrectCount((c) => c + 1);

        // Get the total number of questions for this quiz
        const totalQuestions = isDemoCourse
            ? demoQuizQuestions.length
            : (loadedQuizData[activeLessonId]?.length || 0);

        if (currentQuizIndex < totalQuestions - 1) {
            setTimeout(() => setCurrentQuizIndex(currentQuizIndex + 1), 1500);
        } else {
            setTimeout(() => setQuizFinished(true), 1500);
        }
    };

    const handleQuizFinish = () => {
        markLessonComplete(activeLessonId);
        const allDone = allLessons.every((l) => l.completed || l.id === activeLessonId);
        if (allDone) {
            setCourseComplete(true);
        } else if (currentIndex < allLessons.length - 1) {
            goToLesson(allLessons[currentIndex + 1].id);
        }
    };

    // ── Loading state ──────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className={styles.player}>
                <div className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <Loader2 size={32} className="spin" style={{ color: 'var(--accent)' }} />
                        <span className="text-secondary">Loading course...</span>
                    </div>
                </div>
            </div>
        );
    }

    // ── Course completion screen ───────────────────────────────────────
    if (courseComplete) {
        return (
            <div className={styles.player}>
                <div className={styles.main} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={styles.completionScreen}>
                        <div className={styles.completionHeader}>
                            <Trophy size={48} className={styles.trophyIcon} />
                            <h1>Congratulations!</h1>
                            <p className="text-secondary">
                                You have completed <strong>{courseTitle}</strong>
                            </p>
                        </div>
                        <CourseCertificate
                            courseName={courseTitle}
                            studentName="Dan Sherwood"
                            completionDate={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            lessonsCompleted={allLessons.length}
                            quizScore={isDemoCourse ? Math.round((quizCorrectCount / demoQuizQuestions.length) * 100) : 100}
                        />
                        <div className={styles.completionActions}>
                            <Link href="/my-courses" className="btn btn-secondary">
                                <BookOpen size={16} /> Back to My Courses
                            </Link>
                            <Link href="/courses" className="btn btn-ghost">
                                Browse More Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Sidebar rendering ──────────────────────────────────────────────
    const renderSidebar = () => {
        if (isDemoCourse) {
            return sections.map((section, si) => (
                <div key={si} className={styles.navSection}>
                    <div className={styles.navSectionHeader}>
                        <span>{section.title}</span>
                        <CheckCircle2
                            size={16}
                            className={
                                section.lessons.every((l) => l.completed)
                                    ? styles.completedIcon
                                    : styles.incompleteIcon
                            }
                        />
                    </div>
                    <div className={styles.navLessons}>
                        {section.lessons.map((lesson) => (
                            <button
                                key={lesson.id}
                                className={`${styles.navLesson} ${activeLessonId === lesson.id ? styles.navLessonActive : ''}`}
                                onClick={() => goToLesson(lesson.id)}
                            >
                                <div className={styles.navLessonLeft}>
                                    {lesson.type === 'quiz' ? (
                                        <Award size={14} />
                                    ) : lesson.type === 'video' ? (
                                        <Play size={14} />
                                    ) : (
                                        <FileText size={14} />
                                    )}
                                    <span>{lesson.title}</span>
                                </div>
                                {lesson.completed ? (
                                    <CheckCircle2 size={16} className={styles.completedIcon} />
                                ) : (
                                    <Circle size={16} className={styles.incompleteIcon} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ));
        }

        // Dynamic course: flat lesson list (no completion circles)
        return (
            <div className={styles.navSection}>
                <div className={styles.navLessons}>
                    {dynamicLessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            className={`${styles.navLesson} ${activeLessonId === lesson.id ? styles.navLessonActive : ''}`}
                            onClick={() => goToLesson(lesson.id)}
                        >
                            <div className={styles.navLessonLeft}>
                                <FileText size={14} />
                                <span>{lesson.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // ── Content area rendering ─────────────────────────────────────────
    const renderContent = () => {
        if (!currentLesson) return null;

        // Demo course: quiz
        if (isDemoCourse && currentLesson.type === 'quiz' && !quizStarted) {
            return (
                <div className={styles.quizIntro}>
                    <div className={styles.quizIcon}><Award size={48} /></div>
                    <h2>Module Quiz</h2>
                    <p className="text-secondary">
                        Test your understanding of the material covered in this section.
                        You can retake the quiz as many times as you need.
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={() => setQuizStarted(true)}>
                        Start Quiz
                    </button>
                </div>
            );
        }

        if (isDemoCourse && currentLesson.type === 'quiz' && quizStarted && quizFinished) {
            return (
                <div className={styles.quizSummary}>
                    <Trophy size={48} className={styles.trophyIcon} />
                    <h2>Quiz Complete!</h2>
                    <p className="text-secondary">
                        You scored {quizCorrectCount} out of {demoQuizQuestions.length} ({Math.round((quizCorrectCount / demoQuizQuestions.length) * 100)}%)
                    </p>
                    <div className={styles.quizSummaryActions}>
                        <button className="btn btn-primary" onClick={handleQuizFinish}>
                            Continue to Next Lesson <ChevronRight size={14} />
                        </button>
                        <button className="btn btn-ghost" onClick={() => {
                            setQuizStarted(false);
                            setCurrentQuizIndex(0);
                            setQuizFinished(false);
                            setQuizCorrectCount(0);
                        }}>
                            Retake Quiz
                        </button>
                    </div>
                </div>
            );
        }

        if (isDemoCourse && currentLesson.type === 'quiz' && quizStarted) {
            return (
                <div className={styles.quizContent}>
                    <div className={styles.quizProgress}>
                        <span className="text-sm text-secondary">
                            Question {currentQuizIndex + 1} of {demoQuizQuestions.length}
                        </span>
                    </div>
                    <QuizQuestion
                        key={demoQuizQuestions[currentQuizIndex].id}
                        data={demoQuizQuestions[currentQuizIndex]}
                        onComplete={handleQuizComplete}
                    />
                    {currentQuizIndex > 0 && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setCurrentQuizIndex(currentQuizIndex - 1)}>
                            <ChevronLeft size={14} /> Previous Question
                        </button>
                    )}
                </div>
            );
        }

        // Demo course: video
        if (isDemoCourse && currentLesson.type === 'video') {
            return (
                <div className={styles.videoContent}>
                    <div className={styles.videoPlaceholder}>
                        <Play size={64} />
                        <p>Video Player</p>
                        <span className="text-sm text-tertiary">{currentLesson.title}</span>
                    </div>
                    <div className={styles.lessonText}>
                        <h2>{currentLesson.title}</h2>
                        <p className="text-secondary">
                            This lesson covers the core concepts and practical applications.
                            Watch the full video and take notes as needed. You can pause, rewind,
                            and rewatch at any time.
                        </p>
                    </div>
                </div>
            );
        }

        // Demo course: hardcoded article
        if (isDemoCourse && currentLesson.type === 'article') {
            return (
                <div className={styles.articleContent}>
                    <h2>{currentLesson.title}</h2>
                    <div className={styles.articleBody}>
                        <p>
                            Understanding the distinction between anabolic and androgenic effects is
                            foundational to making informed decisions about performance-enhancing
                            compounds. This article breaks down the key differences and their
                            implications for your health.
                        </p>
                        <h3>Anabolic Effects</h3>
                        <p>
                            Anabolic effects refer to tissue-building processes, primarily the
                            synthesis of proteins and the growth of muscle tissue. These are the
                            effects most sought after by athletes and bodybuilders. Key anabolic
                            indicators include increased nitrogen retention, enhanced protein
                            synthesis, and improved recovery times.
                        </p>
                        <h3>Androgenic Effects</h3>
                        <p>
                            Androgenic effects relate to the development of male characteristics,
                            including voice deepening, body hair growth, and changes to the skin.
                            While often considered side effects, understanding the androgenic
                            profile of a compound is essential for risk management.
                        </p>
                        <blockquote>
                            The ratio of anabolic to androgenic activity varies significantly
                            between compounds and is a critical factor in compound selection.
                        </blockquote>
                        <h3>Key Takeaways</h3>
                        <ul>
                            <li>All anabolic steroids have both anabolic and androgenic properties</li>
                            <li>The anabolic:androgenic ratio helps predict the effect profile</li>
                            <li>Higher androgenic activity correlates with increased side effect risk</li>
                            <li>Individual genetic factors affect how you respond to each compound</li>
                        </ul>
                    </div>
                </div>
            );
        }

        // Dynamic course: lazy-loaded article content
        if (!isDemoCourse && currentLesson.type === 'article') {
            if (isContentLoading || !loadedContent[activeLessonId]) {
                return (
                    <div className={styles.articleContent}>
                        <h2>{currentLesson.title}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-muted)', padding: 'var(--space-xl) 0' }}>
                            <Loader2 size={20} className="spin" />
                            <span>Loading content...</span>
                        </div>
                    </div>
                );
            }

            return (
                <ArticleRenderer
                    content={loadedContent[activeLessonId]}
                    title={currentLesson.title}
                />
            );
        }

        // Dynamic course: quiz
        if (!isDemoCourse && currentLesson.type === 'quiz') {
            const quizQuestions = loadedQuizData[activeLessonId];

            if (isContentLoading || !quizQuestions) {
                return (
                    <div className={styles.quizContent}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-muted)', padding: 'var(--space-xl) 0' }}>
                            <Loader2 size={20} className="spin" />
                            <span>Loading quiz...</span>
                        </div>
                    </div>
                );
            }

            // Quiz start screen
            if (!quizStarted) {
                return (
                    <div className={styles.quizStart}>
                        <div className={styles.quizIcon}><Award size={48} /></div>
                        <h2>{currentLesson.title}</h2>
                        <p className="text-secondary">
                            Test your understanding of the material covered. You can retake the quiz as many times as you need.
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => setQuizStarted(true)}>
                            Start Quiz
                        </button>
                    </div>
                );
            }

            // Quiz complete screen
            if (quizFinished) {
                return (
                    <div className={styles.quizSummary}>
                        <Trophy size={48} className={styles.trophyIcon} />
                        <h2>Quiz Complete!</h2>
                        <p className="text-secondary">
                            You scored {quizCorrectCount} out of {quizQuestions.length} ({Math.round((quizCorrectCount / quizQuestions.length) * 100)}%)
                        </p>
                        <div className={styles.quizSummaryActions}>
                            <button className="btn btn-primary" onClick={handleQuizFinish}>
                                Continue to Next Lesson <ChevronRight size={14} />
                            </button>
                            <button className="btn btn-ghost" onClick={() => {
                                setQuizStarted(false);
                                setCurrentQuizIndex(0);
                                setQuizFinished(false);
                                setQuizCorrectCount(0);
                            }}>
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                );
            }

            // Quiz in progress
            return (
                <div className={styles.quizContent}>
                    <div className={styles.quizProgress}>
                        <span className="text-sm text-secondary">
                            Question {currentQuizIndex + 1} of {quizQuestions.length}
                        </span>
                    </div>
                    <QuizQuestion
                        key={quizQuestions[currentQuizIndex].id}
                        data={quizQuestions[currentQuizIndex]}
                        onComplete={handleQuizComplete}
                    />
                    {currentQuizIndex > 0 && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setCurrentQuizIndex(currentQuizIndex - 1)}>
                            <ChevronLeft size={14} /> Previous Question
                        </button>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div className={styles.player}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.sidebarHidden}`}>
                <div className={styles.sidebarHeader}>
                    <button className={styles.toggleBtn} onClick={() => setSidebarOpen(false)}>
                        <Menu size={18} />
                        <span>Hide</span>
                    </button>
                    <h3 className={styles.courseTitle}>{courseTitle}</h3>
                </div>

                <nav className={styles.sidebarNav}>
                    {renderSidebar()}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Content Area */}
                <div className={styles.contentArea}>
                    {renderContent()}
                </div>

                {/* Bottom Nav */}
                <div className={styles.bottomNav}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            if (currentIndex > 0) goToLesson(allLessons[currentIndex - 1].id);
                        }}
                        disabled={currentIndex <= 0}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            // Mark current lesson complete, then navigate to next
                            if (!isDemoCourse && !currentLesson?.completed) {
                                markLessonComplete(activeLessonId);
                            }
                            if (currentIndex < allLessons.length - 1) {
                                goToLesson(allLessons[currentIndex + 1].id);
                            }
                        }}
                        disabled={currentIndex >= allLessons.length - 1}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
