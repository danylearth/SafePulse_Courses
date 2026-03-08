'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Play, FileText, Award, Menu, BookOpen, Trophy } from 'lucide-react';
import QuizQuestion from '@/components/QuizQuestion/QuizQuestion';
import type { QuizQuestionData } from '@/components/QuizQuestion/QuizQuestion';
import CourseCertificate from '@/components/CourseCertificate/CourseCertificate';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    duration: string;
    completed: boolean;
}

const initialCourseData = {
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

const quizQuestions: QuizQuestionData[] = [
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

export default function LearnPage() {
    const params = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeLessonId, setActiveLessonId] = useState('l6');
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizCorrectCount, setQuizCorrectCount] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [courseComplete, setCourseComplete] = useState(false);
    const [sections, setSections] = useState(initialCourseData.sections);

    const allLessons = sections.flatMap((s) => s.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
    const currentLesson = allLessons[currentIndex];
    const totalCompleted = allLessons.filter((l) => l.completed).length;
    const progress = Math.round((totalCompleted / allLessons.length) * 100);
    const currentSection = sections.find((s) =>
        s.lessons.some((l) => l.id === activeLessonId)
    );
    const lessonIndexInSection = currentSection?.lessons.findIndex((l) => l.id === activeLessonId) ?? 0;

    const markLessonComplete = useCallback((lessonId: string) => {
        setSections((prev) =>
            prev.map((section) => ({
                ...section,
                lessons: section.lessons.map((lesson) =>
                    lesson.id === lessonId ? { ...lesson, completed: true } : lesson
                ),
            }))
        );
    }, []);

    const checkCourseComplete = useCallback(() => {
        const all = sections.flatMap((s) => s.lessons);
        const allDone = all.every((l) => l.completed);
        if (allDone) {
            setCourseComplete(true);
        }
    }, [sections]);

    const handleMarkComplete = () => {
        markLessonComplete(activeLessonId);
        // Auto-advance to next lesson after short delay
        setTimeout(() => {
            const updatedLessons = sections.flatMap((s) => s.lessons);
            const allDone = updatedLessons.every((l) => l.completed || l.id === activeLessonId);
            if (allDone) {
                setCourseComplete(true);
            } else if (currentIndex < allLessons.length - 1) {
                goToLesson(allLessons[currentIndex + 1].id);
            }
        }, 500);
    };

    const goToLesson = (id: string) => {
        setActiveLessonId(id);
        setQuizStarted(false);
        setCurrentQuizIndex(0);
        setQuizFinished(false);
        setQuizCorrectCount(0);
    };

    const handleQuizComplete = (correct: boolean) => {
        if (correct) setQuizCorrectCount((c) => c + 1);
        if (currentQuizIndex < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuizIndex(currentQuizIndex + 1), 1500);
        } else {
            // Last question — show quiz summary
            setTimeout(() => setQuizFinished(true), 1500);
        }
    };

    const handleQuizFinish = () => {
        markLessonComplete(activeLessonId);
        // Check if course is now complete
        const allDone = allLessons.every((l) => l.completed || l.id === activeLessonId);
        if (allDone) {
            setCourseComplete(true);
        } else if (currentIndex < allLessons.length - 1) {
            goToLesson(allLessons[currentIndex + 1].id);
        }
    };

    // Course completion screen
    if (courseComplete) {
        return (
            <div className={styles.player}>
                <div className={styles.main} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={styles.completionScreen}>
                        <div className={styles.completionHeader}>
                            <Trophy size={48} className={styles.trophyIcon} />
                            <h1>Congratulations! 🎉</h1>
                            <p className="text-secondary">
                                You have completed <strong>{initialCourseData.title}</strong>
                            </p>
                        </div>
                        <CourseCertificate
                            courseName={initialCourseData.title}
                            studentName="Dan Sherwood"
                            completionDate="8 Mar 2026"
                            lessonsCompleted={allLessons.length}
                            quizScore={Math.round((quizCorrectCount / quizQuestions.length) * 100)}
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

    return (
        <div className={styles.player}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.sidebarHidden}`}>
                <div className={styles.sidebarHeader}>
                    <button className={styles.toggleBtn} onClick={() => setSidebarOpen(false)}>
                        <Menu size={18} />
                        <span>Hide</span>
                    </button>
                    <h3 className={styles.courseTitle}>{initialCourseData.title}</h3>
                    <Link href={`/courses/${params?.id || '1'}`} className={styles.progressInfo} title="Back to course overview">
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs text-accent">{progress}%</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    {sections.map((section, si) => (
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
                                        className={`${styles.navLesson} ${activeLessonId === lesson.id ? styles.navLessonActive : ''
                                            }`}
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
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <div className={styles.topLeft}>
                        {!sidebarOpen && (
                            <button className={styles.toggleBtn} onClick={() => setSidebarOpen(true)}>
                                <Menu size={18} />
                            </button>
                        )}
                        <div className={styles.topMeta}>
                            <span className="text-xs text-accent">
                                Lesson {lessonIndexInSection + 1} of {currentSection?.lessons.length}
                            </span>
                            <span className="text-sm">{currentSection?.title}</span>
                        </div>
                    </div>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                            if (currentIndex < allLessons.length - 1) {
                                goToLesson(allLessons[currentIndex + 1].id);
                            }
                        }}
                        disabled={currentIndex >= allLessons.length - 1}
                    >
                        Next Lesson <ChevronRight size={14} />
                    </button>
                </div>

                {/* Content Area */}
                <div className={styles.contentArea}>
                    {currentLesson?.type === 'quiz' && !quizStarted ? (
                        <div className={styles.quizIntro}>
                            <div className={styles.quizIcon}>
                                <Award size={48} />
                            </div>
                            <h2>Module Quiz</h2>
                            <p className="text-secondary">
                                Test your understanding of the material covered in this section.
                                You can retake the quiz as many times as you need.
                            </p>
                            <button className="btn btn-primary btn-lg" onClick={() => setQuizStarted(true)}>
                                Start Quiz
                            </button>
                        </div>
                    ) : currentLesson?.type === 'quiz' && quizStarted && quizFinished ? (
                        /* Quiz Summary */
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
                    ) : currentLesson?.type === 'quiz' && quizStarted ? (
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
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setCurrentQuizIndex(currentQuizIndex - 1)}
                                >
                                    <ChevronLeft size={14} /> Previous Question
                                </button>
                            )}
                        </div>
                    ) : currentLesson?.type === 'video' ? (
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
                    ) : (
                        <div className={styles.articleContent}>
                            <h2>{currentLesson?.title}</h2>
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
                    )}
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
                    {!currentLesson?.completed && currentLesson?.type !== 'quiz' && (
                        <button className="btn btn-primary" onClick={handleMarkComplete}>
                            <CheckCircle2 size={16} /> Mark Complete
                        </button>
                    )}
                    {currentLesson?.completed && (
                        <span className={styles.completedBadge}>
                            <CheckCircle2 size={16} /> Completed
                        </span>
                    )}
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            if (currentIndex < allLessons.length - 1) goToLesson(allLessons[currentIndex + 1].id);
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
