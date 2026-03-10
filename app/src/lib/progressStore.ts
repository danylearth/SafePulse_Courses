// Progress tracking store for courses
// Tracks which lessons have been completed per course per user

interface CourseProgress {
    courseId: string;
    completedLessonIds: string[];
    lastAccessedLessonId?: string;
    lastUpdated: string;
}

const STORAGE_KEY = 'safepulse_course_progress';

function loadProgressFromStorage(): CourseProgress[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CourseProgress[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveProgressToStorage(progress: CourseProgress[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
        // storage full or unavailable
    }
}

export function getCourseProgress(courseId: string): CourseProgress {
    const allProgress = loadProgressFromStorage();
    const found = allProgress.find((p) => p.courseId === courseId);
    if (found) return found;

    // Return empty progress if not found
    return {
        courseId,
        completedLessonIds: [],
        lastUpdated: new Date().toISOString(),
    };
}

export function markLessonComplete(courseId: string, lessonId: string): void {
    const allProgress = loadProgressFromStorage();
    const idx = allProgress.findIndex((p) => p.courseId === courseId);

    if (idx >= 0) {
        // Update existing progress
        if (!allProgress[idx].completedLessonIds.includes(lessonId)) {
            allProgress[idx].completedLessonIds.push(lessonId);
        }
        allProgress[idx].lastAccessedLessonId = lessonId;
        allProgress[idx].lastUpdated = new Date().toISOString();
    } else {
        // Create new progress entry
        allProgress.push({
            courseId,
            completedLessonIds: [lessonId],
            lastAccessedLessonId: lessonId,
            lastUpdated: new Date().toISOString(),
        });
    }

    saveProgressToStorage(allProgress);
}

export function setLastAccessedLesson(courseId: string, lessonId: string): void {
    const allProgress = loadProgressFromStorage();
    const idx = allProgress.findIndex((p) => p.courseId === courseId);

    if (idx >= 0) {
        allProgress[idx].lastAccessedLessonId = lessonId;
        allProgress[idx].lastUpdated = new Date().toISOString();
    } else {
        allProgress.push({
            courseId,
            completedLessonIds: [],
            lastAccessedLessonId: lessonId,
            lastUpdated: new Date().toISOString(),
        });
    }

    saveProgressToStorage(allProgress);
}

export function calculateProgress(courseId: string, totalLessons: number): number {
    const progress = getCourseProgress(courseId);
    if (totalLessons === 0) return 0;
    return Math.round((progress.completedLessonIds.length / totalLessons) * 100);
}

export function isLessonComplete(courseId: string, lessonId: string): boolean {
    const progress = getCourseProgress(courseId);
    return progress.completedLessonIds.includes(lessonId);
}

export function resetCourseProgress(courseId: string): void {
    const allProgress = loadProgressFromStorage();
    const filtered = allProgress.filter((p) => p.courseId !== courseId);
    saveProgressToStorage(filtered);
}
