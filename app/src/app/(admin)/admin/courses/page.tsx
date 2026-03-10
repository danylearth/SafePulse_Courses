'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Plus, Search, Edit3, Copy, Archive, ArchiveRestore, BookOpen, Users, Clock } from 'lucide-react';
import { getCourses, saveCourse, ensureDefaults, type CourseRecord } from '@/lib/courseStore';

type CourseStatus = 'All' | 'Published' | 'Draft' | 'Archived';

const statusFilters: CourseStatus[] = ['All', 'Published', 'Draft', 'Archived'];

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<CourseRecord[]>([]);
    const [statusFilter, setStatusFilter] = useState<CourseStatus>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        ensureDefaults();
        setCourses(getCourses());
    }, []);

    const toggleArchive = useCallback((courseId: string) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) return;
        const updated: CourseRecord = {
            ...course,
            status: course.status === 'Archived' ? 'Published' : 'Archived',
        };
        saveCourse(updated);
        setCourses(getCourses());
    }, [courses]);

    const filtered = courses.filter((c) => {
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const statusBadgeClass = (status: string) => {
        switch (status) {
            case 'Published':
                return 'badge-success';
            case 'Draft':
                return 'badge-warning';
            case 'Archived':
                return 'badge-secondary';
            default:
                return '';
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderLeft}>
                    <h1>Course Management</h1>
                    <p className="text-secondary">Create, edit, and manage your courses.</p>
                </div>
                <Link href="/admin/courses/new" className={styles.createBtn}>
                    <Plus size={18} />
                    Create Course
                </Link>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <div className={styles.statusFilter}>
                        {statusFilters.map((s) => (
                            <button
                                key={s}
                                className={`${styles.statusBtn} ${statusFilter === s ? styles.statusBtnActive : ''}`}
                                onClick={() => setStatusFilter(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.searchWrap}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Course Table */}
            {filtered.length > 0 ? (
                <div className={styles.courseTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Level</th>
                                <th>Students</th>
                                <th>Lessons</th>
                                <th>Revenue</th>
                                <th>Tags</th>
                                <th>Updated</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <div className={styles.courseInfo}>
                                            <div
                                                className={styles.courseThumb}
                                                style={{ background: course.coverColor }}
                                            />
                                            <div className={styles.courseMeta}>
                                                <span className={styles.courseTitle}>{course.title}</span>
                                                <span className={styles.courseCategory}>{course.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${statusBadgeClass(course.status)}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-accent">{course.level}</span>
                                    </td>
                                    <td>
                                        <span className="text-sm">
                                            <Users size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                            {course.students.toLocaleString()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-sm">
                                            <BookOpen size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                            {course.lessons}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-sm" style={{ fontWeight: 600 }}>
                                            {course.revenue}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.tagList}>
                                            {course.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                            {course.tags.length > 2 && (
                                                <span className="tag">+{course.tags.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-sm text-tertiary">
                                            <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                            {course.lastUpdated}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link
                                                href={`/admin/courses/new?edit=${course.id}`}
                                                className={styles.actionBtn}
                                                title="Edit"
                                            >
                                                <Edit3 size={14} />
                                            </Link>
                                            <button className={styles.actionBtn} title="Duplicate">
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                title={course.status === 'Archived' ? 'Unarchive' : 'Archive'}
                                                onClick={() => toggleArchive(course.id)}
                                            >
                                                {course.status === 'Archived' ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <BookOpen size={28} />
                    </div>
                    <h3>No courses found</h3>
                    <p className="text-secondary text-sm">
                        {searchQuery || statusFilter !== 'All'
                            ? 'Try adjusting your filters or search query.'
                            : 'Get started by creating your first course.'}
                    </p>
                    {!searchQuery && statusFilter === 'All' && (
                        <Link href="/admin/courses/new" className={styles.createBtn}>
                            <Plus size={18} />
                            Create Course
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
