// Shared course store — persisted to localStorage so admin changes appear on the public page.

export interface CourseRecord {
    id: string;
    title: string;
    description: string; // shortDescription
    longDescription?: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    lessons: number;
    duration: string;
    students: number;
    rating: number;
    price: number;
    salePrice: number | null;
    coverColor: string;
    thumbnailUrl?: string | null;
    tags: string[];
    includes?: string[];
    status: 'Published' | 'Draft' | 'Archived';
    sections?: {
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
            type: 'video' | 'article' | 'quiz';
            duration: string;
            content?: string;
            videoUrl?: string;
        }[];
    }[];
    lastUpdated: string;
    revenue?: string;
}

const STORAGE_KEY = 'safepulse_courses';
const VERSION_KEY = 'safepulse_courses_version';
const CURRENT_VERSION = 2;

const defaultCourses: CourseRecord[] = [
    {
        id: '1',
        title: 'PED Safety & Harm Reduction Fundamentals',
        description: 'Comprehensive guide to understanding risks, safe practices, and monitoring protocols.',
        level: 'Beginner',
        category: 'Safety',
        lessons: 24,
        duration: '14 hours',
        students: 1240,
        rating: 4.9,
        price: 89.99,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #00d4aa, #00a88a)',
        thumbnailUrl: '/thumbnails/Section - Platform Header.png',
        tags: ['Safety', 'Fundamentals', 'Harm Reduction'],
        status: 'Published',
        lastUpdated: 'Mar 5, 2026',
        revenue: '£14,039',
    },
    {
        id: '2',
        title: 'Longevity Protocols: Biomarker Management',
        description: 'Learn to monitor and protect key biomarkers across cycles for long-term health.',
        level: 'Intermediate',
        category: 'Longevity',
        lessons: 18,
        duration: '10 hours',
        students: 856,
        rating: 4.8,
        price: 119.99,
        salePrice: 79.99,
        coverColor: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        thumbnailUrl: '/thumbnails/Section - Section Hero.png',
        tags: ['Longevity', 'Biomarkers'],
        status: 'Published',
        lastUpdated: 'Mar 3, 2026',
        revenue: '£6,959',
    },
    {
        id: '3',
        title: 'Performance Science: Evidence-Based Approach',
        description: 'Maximise results while minimising physiological stress through evidence-driven methods.',
        level: 'Advanced',
        category: 'Performance',
        lessons: 32,
        duration: '18 hours',
        students: 643,
        rating: 4.9,
        price: 149.99,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #f59e0b, #d97706)',
        thumbnailUrl: '/thumbnails/Section - Testimonials.png',
        tags: ['Performance', 'Evidence-Based'],
        status: 'Published',
        lastUpdated: 'Feb 28, 2026',
        revenue: '£9,599',
    },
    {
        id: '4',
        title: 'Neurochemistry & Mood Management',
        description: 'Managing mood, motivation, and neurochemistry during and after PED use.',
        level: 'Intermediate',
        category: 'Uplift',
        lessons: 14,
        duration: '8 hours',
        students: 421,
        rating: 4.7,
        price: 79.99,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #ec4899, #be185d)',
        thumbnailUrl: '/thumbnails/image 59.png',
        tags: ['Neurochemistry', 'Mood'],
        status: 'Published',
        lastUpdated: 'Mar 7, 2026',
        revenue: '£0',
    },
    {
        id: '5',
        title: 'Post-Cycle Recovery: Complete Guide',
        description: 'Structured recovery frameworks covering PCT, hormonal restoration, and health monitoring.',
        level: 'Beginner',
        category: 'Safety',
        lessons: 20,
        duration: '12 hours',
        students: 1890,
        rating: 4.9,
        price: 59.99,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        thumbnailUrl: '/thumbnails/stockSection - Platform Header.png',
        tags: ['PCT', 'Recovery'],
        status: 'Published',
        lastUpdated: 'Feb 20, 2026',
        revenue: '£5,355',
    },
    {
        id: '6',
        title: 'Advanced Dosing Logic & Interactions',
        description: 'Deep dive into dosing frameworks, compound interactions, and risk stratification.',
        level: 'Advanced',
        category: 'Education',
        lessons: 28,
        duration: '16 hours',
        students: 312,
        rating: 4.8,
        price: 129.99,
        salePrice: 99.99,
        coverColor: 'linear-gradient(135deg, #14b8a6, #0d9488)',
        thumbnailUrl: '/thumbnails/Section - Platform Header.png',
        tags: ['Dosing', 'Education'],
        status: 'Published',
        lastUpdated: 'Jan 15, 2026',
        revenue: '£2,720',
    },
    {
        id: '7',
        title: 'Blood Work Interpretation for Athletes',
        description: 'How to read, understand, and act on your blood work results for optimal health.',
        level: 'Beginner',
        category: 'Education',
        lessons: 10,
        duration: '5 hours',
        students: 2150,
        rating: 5.0,
        price: 39.99,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        thumbnailUrl: '/thumbnails/Section - Section Hero.png',
        tags: ['Blood Work', 'Education'],
        status: 'Published',
        lastUpdated: 'Feb 20, 2026',
        revenue: '£5,355',
    },
    {
        id: '8',
        title: 'Organ Protection During PED Use',
        description: 'Evidence-based protocols for liver, kidney, and cardiovascular protection.',
        level: 'Intermediate',
        category: 'Harm Reduction',
        lessons: 16,
        duration: '9 hours',
        students: 765,
        rating: 4.9,
        price: 99.99,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #f97316, #ea580c)',
        thumbnailUrl: '/thumbnails/Section - Testimonials.png',
        tags: ['Organ Protection', 'Harm Reduction'],
        status: 'Published',
        lastUpdated: 'Feb 28, 2026',
        revenue: '£9,599',
    },
    {
        id: 'athlete-code',
        title: 'Enhanced Games Athlete Code',
        description: 'The complete guide to performance protection, enhancing drug guidelines, and harm reduction for Enhanced Games athletes.',
        level: 'Intermediate',
        category: 'Education',
        lessons: 50,
        duration: '~25 hours',
        students: 0,
        rating: 0,
        price: 0,
        salePrice: null,
        coverColor: 'linear-gradient(135deg, #f59e0b, #d97706)',
        tags: ['Athlete Code', 'Enhanced Games', 'PES', 'Harm Reduction'],
        status: 'Published',
        lastUpdated: 'Mar 2026',
    },
];

function loadFromStorage(): CourseRecord[] {
    if (typeof window === 'undefined') return defaultCourses;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultCourses;
        const parsed = JSON.parse(raw) as CourseRecord[];
        if (!Array.isArray(parsed) || parsed.length === 0) return defaultCourses;
        return parsed;
    } catch {
        return defaultCourses;
    }
}

function saveToStorage(courses: CourseRecord[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
        // storage full or unavailable
    }
}

export function getCourses(): CourseRecord[] {
    return loadFromStorage();
}

export function getCourseById(id: string): CourseRecord | undefined {
    return loadFromStorage().find((c) => c.id === id);
}

export function saveCourse(course: CourseRecord): void {
    const courses = loadFromStorage();
    const idx = courses.findIndex((c) => c.id === course.id);
    if (idx >= 0) {
        courses[idx] = course;
    } else {
        courses.push(course);
    }
    saveToStorage(courses);
}

export function deleteCourse(id: string): void {
    const courses = loadFromStorage().filter((c) => c.id !== id);
    saveToStorage(courses);
}

export function generateId(): string {
    return `course_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Seed localStorage with defaults if empty, and merge new courses on version bump */
export function ensureDefaults(): void {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        saveToStorage(defaultCourses);
        localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
        return;
    }
    // Version migration: merge new default courses that don't exist yet
    const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '1', 10);
    if (storedVersion < CURRENT_VERSION) {
        const existing = loadFromStorage();
        for (const dc of defaultCourses) {
            if (!existing.find((c) => c.id === dc.id)) {
                existing.push(dc);
            }
        }
        saveToStorage(existing);
        localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
    }
}
