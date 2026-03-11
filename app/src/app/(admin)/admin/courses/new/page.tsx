'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { getCourseById, saveCourse, generateId, type CourseRecord } from '@/lib/courseStore';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    GripVertical,
    Upload,
    FileText,
    Play,
    Award,
    Image as ImageIcon,
    X,
    CheckCircle2,
    AlertTriangle,
    BookOpen,
    Sparkles,
    Send,
    MessageSquare,
    Minimize2,
    Bot,
} from 'lucide-react';

/* ───────────── Types ───────────── */
interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    duration: string;
    content?: string;
    videoUrl?: string;
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface QuizQuestion {
    id: string;
    lessonId: string;
    question: string;
    options: string[];
    correctIndex: number;
}

interface CourseData {
    title: string;
    shortDescription: string;
    longDescription: string;
    category: string;
    level: string;
    price: string;
    salePrice: string;
    coverColor: string;
    thumbnailUrl: string | null;
    tags: string[];
    includes: string[];
    status: 'Draft' | 'Published' | 'Archived';
    sections: Section[];
    quizQuestions: QuizQuestion[];
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ExtractedSection {
    title: string;
    lessons: { title: string; type: 'video' | 'article' | 'quiz'; content?: string }[];
}

/* ───────────── Helpers ───────────── */
let _id = 0;
const uid = () => `uid_${++_id}_${Date.now()}`;

const defaultCourse: CourseData = {
    title: '',
    shortDescription: '',
    longDescription: '',
    category: 'Safety',
    level: 'Beginner',
    price: '',
    salePrice: '',
    coverColor: 'linear-gradient(135deg, #00d4aa, #00a88a)',
    thumbnailUrl: null,
    tags: [],
    includes: ['On-demand video', 'Downloadable resources', 'Certificate of completion', 'Lifetime access'],
    status: 'Draft',
    sections: [
        {
            id: uid(),
            title: 'Section 1 — Introduction',
            lessons: [
                { id: uid(), title: 'Welcome & Course Overview', type: 'video', duration: '10min' },
                { id: uid(), title: 'Module 1 Quiz', type: 'quiz', duration: '5min' },
            ],
        },
    ],
    quizQuestions: [],
};

const gradients = [
    'linear-gradient(135deg, #00d4aa, #00a88a)',
    'linear-gradient(135deg, #6366f1, #4f46e5)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #be185d)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #14b8a6, #0d9488)',
    'linear-gradient(135deg, #f97316, #ea580c)',
];

const categories = ['Safety', 'Performance', 'Longevity', 'Uplift', 'Education', 'Harm Reduction'];
const steps = ['Course Details', 'Curriculum', 'Quizzes', 'Review'];

/* ───────────── Component ───────────── */
function NewCoursePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams?.get('edit');
    const isEditing = Boolean(editId);

    const [currentStep, setCurrentStep] = useState(0);
    const [course, setCourse] = useState<CourseData>({ ...defaultCourse });
    const [courseId, setCourseId] = useState<string | null>(editId);
    const [tagInput, setTagInput] = useState('');

    // Load existing course if editing
    useEffect(() => {
        if (editId) {
            const existing = getCourseById(editId);
            if (existing) {
                setCourseId(editId);
                setCourse({
                    title: existing.title,
                    shortDescription: existing.description,
                    longDescription: existing.longDescription || '',
                    category: existing.category,
                    level: existing.level as 'Beginner' | 'Intermediate' | 'Advanced',
                    price: existing.price.toString(),
                    salePrice: existing.salePrice?.toString() || '',
                    coverColor: existing.coverColor,
                    thumbnailUrl: existing.thumbnailUrl || null,
                    tags: existing.tags,
                    includes: existing.includes || [],
                    status: existing.status,
                    sections: existing.sections || defaultCourse.sections,
                    quizQuestions: [],
                });
            }
        }
    }, [editId]);

    // AI Chat
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content:
                'Hey! 👋 I\'m your course creation assistant. I can help you with:\n\n• Structuring your course content\n• Writing descriptions and lesson titles\n• Suggesting quiz questions\n• Tips on pricing and categorisation\n\nJust ask me anything!',
        },
    ]);
    const [chatInput, setChatInput] = useState('');

    // Extraction Modal
    const [showExtraction, setShowExtraction] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [extractedSections, setExtractedSections] = useState<ExtractedSection[] | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);

    /* ───── Updaters ───── */
    const updateField = <K extends keyof CourseData>(key: K, value: CourseData[K]) => {
        setCourse((prev) => ({ ...prev, [key]: value }));
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !course.tags.includes(tag)) {
            updateField('tags', [...course.tags, tag]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        updateField(
            'tags',
            course.tags.filter((t) => t !== tag)
        );
    };

    const addInclude = () => {
        updateField('includes', [...course.includes, '']);
    };

    const updateInclude = (i: number, value: string) => {
        const next = [...course.includes];
        next[i] = value;
        updateField('includes', next);
    };

    const removeInclude = (i: number) => {
        updateField(
            'includes',
            course.includes.filter((_, idx) => idx !== i)
        );
    };

    /* ───── Thumbnail ───── */
    const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        updateField('thumbnailUrl', url);
    };

    /* ───── Section / Lesson CRUD ───── */
    const addSection = () => {
        const newSection: Section = {
            id: uid(),
            title: `Section ${course.sections.length + 1}`,
            lessons: [],
        };
        updateField('sections', [...course.sections, newSection]);
    };

    const removeSection = (sectionId: string) => {
        updateField(
            'sections',
            course.sections.filter((s) => s.id !== sectionId)
        );
    };

    const updateSectionTitle = (sectionId: string, title: string) => {
        updateField(
            'sections',
            course.sections.map((s) => (s.id === sectionId ? { ...s, title } : s))
        );
    };

    const addLesson = (sectionId: string) => {
        const section = course.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const newLesson: Lesson = {
            id: uid(),
            title: 'New Lesson',
            type: 'article',
            duration: '10min',
        };
        updateField(
            'sections',
            course.sections.map((s) => (s.id === sectionId ? { ...s, lessons: [...s.lessons, newLesson] } : s))
        );
    };

    const removeLesson = (sectionId: string, lessonId: string) => {
        updateField(
            'sections',
            course.sections.map((s) =>
                s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s
            )
        );
    };

    const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
        updateField(
            'sections',
            course.sections.map((s) =>
                s.id === sectionId
                    ? { ...s, lessons: s.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
                    : s
            )
        );
    };

    /* ───── Quiz CRUD ───── */
    const quizLessons = course.sections.flatMap((s) => s.lessons.filter((l) => l.type === 'quiz'));

    const addQuizQuestion = (lessonId: string) => {
        const q: QuizQuestion = {
            id: uid(),
            lessonId,
            question: '',
            options: ['', '', '', ''],
            correctIndex: 0,
        };
        updateField('quizQuestions', [...course.quizQuestions, q]);
    };

    const removeQuizQuestion = (qId: string) => {
        updateField(
            'quizQuestions',
            course.quizQuestions.filter((q) => q.id !== qId)
        );
    };

    const updateQuizQuestion = (qId: string, updates: Partial<QuizQuestion>) => {
        updateField(
            'quizQuestions',
            course.quizQuestions.map((q) => (q.id === qId ? { ...q, ...updates } : q))
        );
    };

    const updateQuizOption = (qId: string, optIndex: number, value: string) => {
        updateField(
            'quizQuestions',
            course.quizQuestions.map((q) => {
                if (q.id !== qId) return q;
                const opts = [...q.options];
                opts[optIndex] = value;
                return { ...q, options: opts };
            })
        );
    };

    /* ───── PDF/DOCX Extraction ───── */
    const handleFileUpload = useCallback(
        async (file: File) => {
            setExtracting(true);
            setExtractedSections(null);

            try {
                let rawText = '';

                if (file.name.endsWith('.pdf')) {
                    const pdfjsLib = await import('pdfjs-dist');
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    const pages: string[] = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const text = content.items.map((item: any) => item.str).join(' ');
                        pages.push(text);
                    }
                    rawText = pages.join('\n\n');
                } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                    const mammoth = await import('mammoth');
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    rawText = result.value.replace(/<[^>]+>/g, '\n');
                } else {
                    rawText = await file.text();
                }

                // Heuristic structuring — split on lines that look like headings
                const lines = rawText
                    .split('\n')
                    .map((l) => l.trim())
                    .filter(Boolean);
                const sections: ExtractedSection[] = [];
                let currentSec: ExtractedSection | null = null;
                let buffer: string[] = [];

                const flushBuffer = () => {
                    if (buffer.length > 0 && currentSec) {
                        const content = buffer.join('\n');
                        const title =
                            buffer[0].length < 80 ? buffer[0] : buffer[0].slice(0, 60) + '...';
                        currentSec.lessons.push({ title, type: 'article', content });
                        buffer = [];
                    }
                };

                for (const line of lines) {
                    // Detect headings: lines that are short, all caps, or start with a number
                    const isHeading =
                        (line.length < 60 && line === line.toUpperCase() && line.length > 3) ||
                        /^(chapter|section|module|week|part|unit)\s+\d/i.test(line) ||
                        /^\d+\.\s+[A-Z]/.test(line);

                    if (isHeading) {
                        flushBuffer();
                        currentSec = { title: line, lessons: [] };
                        sections.push(currentSec);
                    } else {
                        if (!currentSec) {
                            currentSec = { title: 'Introduction', lessons: [] };
                            sections.push(currentSec);
                        }
                        buffer.push(line);
                        // If buffer gets big, flush as a lesson
                        if (buffer.length >= 15) {
                            flushBuffer();
                        }
                    }
                }
                flushBuffer();

                // Ensure we have at least one section
                if (sections.length === 0) {
                    sections.push({
                        title: 'Extracted Content',
                        lessons: [{ title: 'Imported Content', type: 'article', content: rawText }],
                    });
                }

                setExtractedSections(sections);
            } catch (err) {
                console.error('Extraction error:', err);
                setExtractedSections([
                    {
                        title: 'Error extracting content',
                        lessons: [{ title: 'Could not parse the file. Please try a different format.', type: 'article' }],
                    },
                ]);
            } finally {
                setExtracting(false);
            }
        },
        []
    );

    const importExtracted = () => {
        if (!extractedSections) return;
        const newSections: Section[] = extractedSections.map((es) => ({
            id: uid(),
            title: es.title,
            lessons: es.lessons.map((el) => ({
                id: uid(),
                title: el.title,
                type: el.type,
                duration: '10min',
                content: el.content,
            })),
        }));
        updateField('sections', [...course.sections, ...newSections]);
        setShowExtraction(false);
        setExtractedSections(null);
    };

    /* ───── AI Chat (OpenRouter) ───── */
    const [chatLoading, setChatLoading] = useState(false);

    const sendChat = async () => {
        const text = chatInput.trim();
        if (!text || chatLoading) return;
        const userMsg: ChatMessage = { id: uid(), role: 'user', content: text };
        setChatMessages((prev) => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);

        try {
            const res = await fetch('/api/course-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...chatMessages, userMsg]
                        .filter((m) => m.id !== 'welcome')
                        .map((m) => ({ role: m.role, content: m.content })),
                    courseContext: {
                        title: course.title,
                        category: course.category,
                        level: course.level,
                        sections: course.sections.length,
                        tags: course.tags,
                    },
                }),
            });
            const data = await res.json();
            const aiMsg: ChatMessage = {
                id: uid(),
                role: 'assistant',
                content: data.content || data.error || 'Sorry, something went wrong.',
            };
            setChatMessages((prev) => [...prev, aiMsg]);
        } catch {
            setChatMessages((prev) => [
                ...prev,
                { id: uid(), role: 'assistant', content: 'Network error — please try again.' },
            ]);
        } finally {
            setChatLoading(false);
        }
    };


    /* ───── Validation ───── */
    const getWarnings = (): string[] => {
        const w: string[] = [];
        if (!course.title) w.push('Course title is required');
        if (!course.shortDescription) w.push('Short description is required');
        if (!course.price) w.push('Price is required');
        if (course.sections.length === 0) w.push('At least one section is required');
        course.sections.forEach((s) => {
            if (s.lessons.length === 0) w.push(`Section "${s.title}" has no lessons`);
        });
        const quizzes = quizLessons;
        quizzes.forEach((ql) => {
            const questions = course.quizQuestions.filter((q) => q.lessonId === ql.id);
            if (questions.length === 0) w.push(`Quiz "${ql.title}" has no questions`);
            questions.forEach((q) => {
                if (!q.question) w.push(`A quiz question is empty`);
                if (q.options.some((o) => !o)) w.push(`Quiz "${ql.title}" has blank answer options`);
            });
        });
        return w;
    };

    const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

    /* ───── Save / Publish ───── */
    const handleSave = useCallback((publish: boolean = false) => {
        const id = courseId || generateId();

        const courseRecord: CourseRecord = {
            id,
            title: course.title,
            description: course.shortDescription,
            longDescription: course.longDescription,
            level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
            category: course.category,
            lessons: totalLessons,
            duration: course.sections.reduce((total, s) => {
                const mins = s.lessons.reduce((sum, l) => {
                    const match = l.duration.match(/(\d+)/);
                    return sum + (match ? parseInt(match[1]) : 0);
                }, 0);
                return total + mins;
            }, 0) + ' min',
            students: 0,
            rating: 0,
            price: parseFloat(course.price) || 0,
            salePrice: course.salePrice ? parseFloat(course.salePrice) : null,
            coverColor: course.coverColor,
            thumbnailUrl: course.thumbnailUrl,
            tags: course.tags,
            includes: course.includes,
            status: publish ? 'Published' : course.status,
            sections: course.sections,
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            revenue: '£0',
        };

        saveCourse(courseRecord);

        if (!courseId) {
            setCourseId(id);
        }

        // Redirect back to courses list
        router.push('/admin/courses');
    }, [course, courseId, totalLessons, router]);

    /* ───── Render helpers ───── */
    const lessonIcon = (type: string) => {
        switch (type) {
            case 'video':
                return (
                    <span className={`${styles.lessonIcon} ${styles.lessonIconVideo}`}>
                        <Play size={14} />
                    </span>
                );
            case 'quiz':
                return (
                    <span className={`${styles.lessonIcon} ${styles.lessonIconQuiz}`}>
                        <Award size={14} />
                    </span>
                );
            default:
                return (
                    <span className={`${styles.lessonIcon} ${styles.lessonIconArticle}`}>
                        <FileText size={14} />
                    </span>
                );
        }
    };

    /* ═══════════════════════════════════════ RENDER ═══════════════════════════════════════ */
    return (
        <div className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link href="/admin/courses">Courses</Link>
                <span>/</span>
                <span>{isEditing ? 'Edit Course' : 'New Course'}</span>
            </div>

            {/* Step Tabs */}
            <div className={styles.steps}>
                {steps.map((label, i) => (
                    <button
                        key={label}
                        className={`${styles.step} ${i === currentStep ? styles.stepActive : ''} ${i < currentStep ? styles.stepCompleted : ''
                            }`}
                        onClick={() => setCurrentStep(i)}
                    >
                        <span className={styles.stepNumber}>
                            {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                        </span>
                        {label}
                    </button>
                ))}
            </div>

            {/* ══════════ STEP 1: Course Details ══════════ */}
            {currentStep === 0 && (
                <div className={styles.formSection}>
                    {/* Quick Import */}
                    <div className={styles.uploadBar}>
                        <div className={styles.uploadBarLeft}>
                            <Upload size={20} />
                            <div>
                                <strong>Quick Start — Import from PDF or DOCX</strong>
                                <br />
                                <span className="text-xs text-tertiary">
                                    Upload your course document and we&apos;ll extract titles, sections, and content for you to review
                                </span>
                            </div>
                        </div>
                        <button className={styles.uploadBtn} onClick={() => setShowExtraction(true)}>
                            <Upload size={14} /> Upload File
                        </button>
                    </div>

                    <div className={styles.formCard}>
                        <h3>Course Information</h3>
                        <div className={styles.formGroup}>
                            <label>Course Title *</label>
                            <input
                                type="text"
                                placeholder="e.g. PED Safety & Harm Reduction Fundamentals"
                                value={course.title}
                                onChange={(e) => updateField('title', e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Short Description *</label>
                            <input
                                type="text"
                                placeholder="One-liner shown on course cards"
                                value={course.shortDescription}
                                onChange={(e) => updateField('shortDescription', e.target.value)}
                            />
                            <span className={styles.formHint}>Keep it under 120 characters</span>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Full Description</label>
                            <textarea
                                placeholder="Detailed course description shown on the course detail page..."
                                value={course.longDescription}
                                onChange={(e) => updateField('longDescription', e.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3>Classification</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select
                                    value={course.category}
                                    onChange={(e) => updateField('category', e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Level</label>
                                <div className={styles.levelRadios}>
                                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            className={`${styles.levelRadio} ${course.level === level ? styles.levelRadioActive : ''
                                                }`}
                                            onClick={() => updateField('level', level)}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tags</label>
                            <div className={styles.tagInput}>
                                {course.tags.map((tag) => (
                                    <span key={tag} className={styles.tagItem}>
                                        {tag}
                                        <button
                                            className={styles.tagRemove}
                                            onClick={() => removeTag(tag)}
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                    className={styles.tagInputField}
                                    placeholder="Type a tag and press Enter..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                />
                            </div>
                            <span className={styles.formHint}>
                                Press Enter to add a tag. Use tags like &quot;PCT&quot;, &quot;Blood Work&quot;, &quot;Liver Protection&quot;
                            </span>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3>Pricing</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Price (£) *</label>
                                <input
                                    type="number"
                                    placeholder="89.99"
                                    value={course.price}
                                    onChange={(e) => updateField('price', e.target.value)}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Sale Price (£)</label>
                                <input
                                    type="number"
                                    placeholder="Leave blank for no sale"
                                    value={course.salePrice}
                                    onChange={(e) => updateField('salePrice', e.target.value)}
                                    step="0.01"
                                    min="0"
                                />
                                <span className={styles.formHint}>Optional — leave blank if no discount</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3>Appearance</h3>
                        <div className={styles.formGroup}>
                            <label>Cover Gradient</label>
                            <div className={styles.coverSwatches}>
                                {gradients.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        className={`${styles.swatch} ${course.coverColor === g ? styles.swatchActive : ''
                                            }`}
                                        style={{ background: g }}
                                        onClick={() => updateField('coverColor', g)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Course Thumbnail</label>
                            <div className={styles.imageUpload}>
                                {course.thumbnailUrl ? (
                                    <div className={styles.imagePreview}>
                                        <img src={course.thumbnailUrl} alt="Thumbnail" />
                                        <button
                                            className={styles.imageRemoveBtn}
                                            onClick={() => updateField('thumbnailUrl', null)}
                                            type="button"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={styles.imageDropzone}
                                        onClick={() => thumbInputRef.current?.click()}
                                    >
                                        <ImageIcon size={28} />
                                        <span className="text-sm">Click to upload thumbnail</span>
                                        <span className="text-xs text-tertiary">PNG, JPG up to 5MB</span>
                                    </div>
                                )}
                                <input
                                    ref={thumbInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleThumbnail}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3>Course Includes</h3>
                        <div className={styles.includesList}>
                            {course.includes.map((item, i) => (
                                <div key={i} className={styles.includeItem}>
                                    <input
                                        value={item}
                                        onChange={(e) => updateInclude(i, e.target.value)}
                                        placeholder="e.g. 14 hours on-demand video"
                                    />
                                    <button
                                        className={styles.removeInclude}
                                        onClick={() => removeInclude(i)}
                                        type="button"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className={styles.addBtn} onClick={addInclude} type="button">
                            <Plus size={14} /> Add Item
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════ STEP 2: Curriculum ══════════ */}
            {currentStep === 1 && (
                <div className={styles.curriculumSection}>
                    {/* Upload Bar */}
                    <div className={styles.uploadBar}>
                        <div className={styles.uploadBarLeft}>
                            <Upload size={20} />
                            <div>
                                <strong>Import from PDF or DOCX</strong>
                                <br />
                                <span className="text-xs text-tertiary">
                                    Upload a document and we&apos;ll extract the content structure for you to review
                                </span>
                            </div>
                        </div>
                        <button className={styles.uploadBtn} onClick={() => setShowExtraction(true)}>
                            <Upload size={14} /> Upload File
                        </button>
                    </div>

                    {/* Sections */}
                    {course.sections.map((section) => (
                        <div key={section.id} className={styles.sectionCard}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionHeaderLeft}>
                                    <GripVertical size={16} />
                                    <input
                                        value={section.title}
                                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                        placeholder="Section title..."
                                    />
                                </div>
                                <div className={styles.sectionActions}>
                                    <button
                                        className={`${styles.sectionActionBtn} ${styles.deleteBtn}`}
                                        onClick={() => removeSection(section.id)}
                                        title="Delete section"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.lessonList}>
                                {section.lessons.map((lesson) => (
                                    <div key={lesson.id} className={styles.lessonRow}>
                                        <GripVertical size={14} className={styles.lessonDrag} />
                                        {lessonIcon(lesson.type)}
                                        <div className={styles.lessonInputs}>
                                            <input
                                                className={styles.lessonTitleInput}
                                                value={lesson.title}
                                                onChange={(e) =>
                                                    updateLesson(section.id, lesson.id, { title: e.target.value })
                                                }
                                                placeholder="Lesson title..."
                                            />
                                            <select
                                                className={styles.lessonTypeSelect}
                                                value={lesson.type}
                                                onChange={(e) =>
                                                    updateLesson(section.id, lesson.id, {
                                                        type: e.target.value as Lesson['type'],
                                                    })
                                                }
                                            >
                                                <option value="video">Video</option>
                                                <option value="article">Article</option>
                                                <option value="quiz">Quiz</option>
                                            </select>
                                            <input
                                                className={styles.lessonDuration}
                                                value={lesson.duration}
                                                onChange={(e) =>
                                                    updateLesson(section.id, lesson.id, { duration: e.target.value })
                                                }
                                                placeholder="10min"
                                            />
                                        </div>
                                        <button
                                            className={styles.lessonRemoveBtn}
                                            onClick={() => removeLesson(section.id, lesson.id)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.addLessonRow}>
                                <button className={styles.addBtn} onClick={() => addLesson(section.id)} type="button">
                                    <Plus size={14} /> Add Lesson
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className={styles.addBtn} onClick={addSection} type="button">
                        <Plus size={14} /> Add Section
                    </button>
                </div>
            )}

            {/* ══════════ STEP 3: Quizzes ══════════ */}
            {currentStep === 2 && (
                <div className={styles.quizSection}>
                    {quizLessons.length === 0 ? (
                        <div className={styles.quizEmptyState}>
                            <Award size={36} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                            <h3>No Quiz Lessons</h3>
                            <p className="text-sm text-secondary">
                                Go back to the Curriculum step and set a lesson type to &quot;Quiz&quot; to start adding
                                questions.
                            </p>
                        </div>
                    ) : (
                        quizLessons.map((ql) => {
                            const questions = course.quizQuestions.filter((q) => q.lessonId === ql.id);
                            return (
                                <div key={ql.id} className={styles.quizLessonCard}>
                                    <div className={styles.quizLessonHeader}>
                                        <div className={styles.quizLessonHeaderLeft}>
                                            <Award size={18} />
                                            <strong>{ql.title}</strong>
                                        </div>
                                        <span className="text-sm text-secondary">
                                            {questions.length} question{questions.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className={styles.quizQuestions}>
                                        {questions.map((q, qi) => (
                                            <div key={q.id} className={styles.quizQuestionItem}>
                                                <div className={styles.quizQuestionHeader}>
                                                    <span className={styles.quizQuestionNumber}>
                                                        Question {qi + 1}
                                                    </span>
                                                    <button
                                                        className={styles.lessonRemoveBtn}
                                                        onClick={() => removeQuizQuestion(q.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <input
                                                    className={styles.quizQuestionInput}
                                                    value={q.question}
                                                    onChange={(e) =>
                                                        updateQuizQuestion(q.id, { question: e.target.value })
                                                    }
                                                    placeholder="Enter your question..."
                                                />
                                                <div className={styles.quizOptions}>
                                                    {q.options.map((opt, oi) => (
                                                        <div key={oi} className={styles.quizOptionRow}>
                                                            <button
                                                                type="button"
                                                                className={`${styles.correctToggle} ${q.correctIndex === oi
                                                                    ? styles.correctToggleActive
                                                                    : ''
                                                                    }`}
                                                                onClick={() =>
                                                                    updateQuizQuestion(q.id, { correctIndex: oi })
                                                                }
                                                                title={
                                                                    q.correctIndex === oi
                                                                        ? 'Correct answer'
                                                                        : 'Mark as correct'
                                                                }
                                                            >
                                                                <CheckCircle2 size={14} />
                                                            </button>
                                                            <input
                                                                className={styles.quizOptionInput}
                                                                value={opt}
                                                                onChange={(e) =>
                                                                    updateQuizOption(q.id, oi, e.target.value)
                                                                }
                                                                placeholder={`Option ${oi + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.addLessonRow}>
                                        <button
                                            className={styles.addBtn}
                                            onClick={() => addQuizQuestion(ql.id)}
                                            type="button"
                                        >
                                            <Plus size={14} /> Add Question
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* ══════════ STEP 4: Review ══════════ */}
            {currentStep === 3 && (
                <div className={styles.reviewSection}>
                    {/* Warnings */}
                    {getWarnings().length > 0 && (
                        <div className={styles.reviewCard}>
                            <h3>
                                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                                Validation Warnings
                            </h3>
                            <div className={styles.warningsList}>
                                {getWarnings().map((w, i) => (
                                    <div key={i} className={styles.warningItem}>
                                        <AlertTriangle size={14} />
                                        {w}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Course Info */}
                    <div className={styles.reviewCard}>
                        <h3>
                            <BookOpen size={18} style={{ color: 'var(--accent)' }} />
                            Course Details
                        </h3>
                        <div className={styles.reviewField}>
                            <span className={styles.reviewLabel}>Title</span>
                            <span className={styles.reviewValue}>{course.title || '—'}</span>
                        </div>
                        <div className={styles.reviewField}>
                            <span className={styles.reviewLabel}>Category</span>
                            <span className={styles.reviewValue}>{course.category}</span>
                        </div>
                        <div className={styles.reviewField}>
                            <span className={styles.reviewLabel}>Level</span>
                            <span className={styles.reviewValue}>
                                <span className="badge badge-accent">{course.level}</span>
                            </span>
                        </div>
                        <div className={styles.reviewField}>
                            <span className={styles.reviewLabel}>Price</span>
                            <span className={styles.reviewValue}>
                                {course.price ? `£${course.price}` : '—'}
                                {course.salePrice && (
                                    <span className="text-sm text-secondary" style={{ marginLeft: 8 }}>
                                        Sale: £{course.salePrice}
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className={styles.reviewField}>
                            <span className={styles.reviewLabel}>Tags</span>
                            <span className={styles.reviewValue}>
                                {course.tags.length > 0 ? (
                                    <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {course.tags.map((t) => (
                                            <span key={t} className="tag">{t}</span>
                                        ))}
                                    </span>
                                ) : (
                                    '—'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Curriculum Summary */}
                    <div className={styles.reviewCard}>
                        <h3>
                            <FileText size={18} style={{ color: 'var(--accent)' }} />
                            Curriculum — {course.sections.length} sections, {totalLessons} lessons
                        </h3>
                        {course.sections.map((section) => (
                            <div key={section.id} className={styles.reviewSectionItem}>
                                <div className={styles.reviewSectionTitle}>{section.title}</div>
                                <div className={styles.reviewLessons}>
                                    {section.lessons.map((lesson) => (
                                        <div key={lesson.id} className={styles.reviewLesson}>
                                            {lesson.type === 'video' ? (
                                                <Play size={12} />
                                            ) : lesson.type === 'quiz' ? (
                                                <Award size={12} />
                                            ) : (
                                                <FileText size={12} />
                                            )}
                                            {lesson.title}
                                            <span className="text-xs text-tertiary">{lesson.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer Navigation */}
            <div className={styles.footer}>
                <div className={styles.footerLeft}>
                    {currentStep > 0 && (
                        <button className="btn btn-ghost" onClick={() => setCurrentStep(currentStep - 1)}>
                            <ChevronLeft size={16} /> Previous
                        </button>
                    )}
                </div>
                <div className={styles.footerRight}>
                    <button className="btn btn-secondary" onClick={() => handleSave(false)}>
                        Save as Draft
                    </button>
                    {currentStep < steps.length - 1 ? (
                        <button className="btn btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
                            Continue <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => handleSave(true)}
                        >
                            {isEditing ? 'Update & Publish' : 'Publish Course'}
                        </button>
                    )}
                </div>
            </div>

            {/* ══════════ AI CHAT PANEL ══════════ */}
            {chatOpen ? (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 380,
                        height: 520,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 90,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s ease-out',
                    }}
                >
                    {/* Chat Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--border)',
                            background: 'var(--bg-tertiary)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--accent-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)',
                                }}
                            >
                                <Sparkles size={14} />
                            </div>
                            <strong style={{ fontSize: '0.9rem' }}>Course Assistant</strong>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-tertiary)',
                                cursor: 'pointer',
                                padding: 4,
                            }}
                        >
                            <Minimize2 size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        {chatMessages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '85%',
                                        padding: '10px 14px',
                                        borderRadius:
                                            msg.role === 'user'
                                                ? '14px 14px 4px 14px'
                                                : '14px 14px 14px 4px',
                                        background:
                                            msg.role === 'user' ? 'var(--accent)' : 'var(--bg-tertiary)',
                                        color:
                                            msg.role === 'user'
                                                ? 'var(--text-inverse)'
                                                : 'var(--text-primary)',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.5,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 12px',
                            borderTop: '1px solid var(--border)',
                        }}
                    >
                        <input
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-full)',
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem',
                                outline: 'none',
                                fontFamily: 'inherit',
                                opacity: chatLoading ? 0.6 : 1,
                            }}
                            placeholder={chatLoading ? 'Thinking...' : 'Ask about course creation...'}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            disabled={chatLoading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') sendChat();
                            }}
                        />
                        <button
                            onClick={sendChat}
                            disabled={chatLoading}
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 'var(--radius-full)',
                                background: chatLoading ? 'var(--bg-surface)' : 'var(--accent)',
                                border: 'none',
                                color: chatLoading ? 'var(--text-muted)' : 'var(--text-inverse)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: chatLoading ? 'not-allowed' : 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                            }}
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setChatOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 52,
                        height: 52,
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent)',
                        border: 'none',
                        color: 'var(--text-inverse)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 90,
                        transition: 'all var(--transition-fast)',
                    }}
                    title="AI Course Assistant"
                >
                    <Sparkles size={22} />
                </button>
            )}

            {/* ══════════ EXTRACTION MODAL ══════════ */}
            {showExtraction && (
                <div className={styles.extractionOverlay} onClick={() => !extracting && setShowExtraction(false)}>
                    <div className={styles.extractionModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.extractionHeader}>
                            <h2>
                                <Upload size={22} />
                                Import Content
                            </h2>
                            <button
                                onClick={() => setShowExtraction(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-tertiary)',
                                    cursor: 'pointer',
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {extracting ? (
                            <div className={styles.processingState}>
                                <div className={styles.spinner} />
                                <p>Extracting content from your document...</p>
                                <p className="text-xs text-tertiary">This may take a few seconds</p>
                            </div>
                        ) : extractedSections ? (
                            <>
                                <p className="text-sm text-secondary">
                                    Review the extracted content below. Sections and lessons will be added to your
                                    curriculum. You can edit everything after importing.
                                </p>
                                <div className={styles.extractionPreview}>
                                    {extractedSections.map((sec, si) => (
                                        <div key={si} className={styles.extractionPreviewSection}>
                                            <h4>{sec.title}</h4>
                                            {sec.lessons.map((lesson, li) => (
                                                <div key={li} className={styles.extractionPreviewLesson}>
                                                    <FileText size={14} />
                                                    {lesson.title}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.extractionActions}>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => {
                                            setExtractedSections(null);
                                        }}
                                    >
                                        Re-upload
                                    </button>
                                    <button className="btn btn-primary" onClick={importExtracted}>
                                        <CheckCircle2 size={16} />
                                        Import to Curriculum
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className={styles.extractionDropzone}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add(styles.extractionDropzoneActive);
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove(styles.extractionDropzoneActive);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove(styles.extractionDropzoneActive);
                                        const file = e.dataTransfer.files[0];
                                        if (file) handleFileUpload(file);
                                    }}
                                >
                                    <Upload size={36} />
                                    <p>
                                        <strong>Drop your file here</strong> or click to browse
                                    </p>
                                    <span className="text-xs text-tertiary">
                                        Supports PDF, DOCX, DOC, and TXT files
                                    </span>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file);
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function NewCoursePage() {
    return (
        <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
            <NewCoursePageContent />
        </Suspense>
    );
}
