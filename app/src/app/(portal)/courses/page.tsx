'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Search, Star, Users, Clock, BookOpen } from 'lucide-react';
import { getCourses, ensureDefaults, type CourseRecord } from '@/lib/courseStore';

const categories = [
    'All Courses',
    'Performance',
    'Longevity',
    'Safety',
    'Uplift',
    'Education',
    'Harm Reduction',
];

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

export default function CoursesPage() {
    const [allCourses, setAllCourses] = useState<CourseRecord[]>([]);
    const [activeCategory, setActiveCategory] = useState('All Courses');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced']);

    useEffect(() => {
        ensureDefaults();
        // Only show published courses on the public site
        setAllCourses(getCourses().filter((c) => c.status === 'Published'));
    }, []);

    const toggleLevel = (level: string) => {
        setSelectedLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
        );
    };

    const filtered = allCourses
        .filter((course) => {
            const matchesCategory = activeCategory === 'All Courses' || course.category === activeCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = selectedLevels.includes(course.level);
            return matchesCategory && matchesSearch && matchesLevel;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'popular': return b.students - a.students;
                case 'newest': return parseInt(b.id) - parseInt(a.id);
                case 'price-low': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
                case 'price-high': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
                case 'rating': return b.rating - a.rating;
                default: return 0;
            }
        });

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1>Explore Courses</h1>
                    <p className="text-secondary">Evidence-based education for performance, safety, and longevity.</p>
                </div>
            </div>

            <div className={styles.layout}>
                {/* Sidebar Filters */}
                <aside className={styles.filters}>
                    <div className={styles.filterSearch}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.filterInput}
                        />
                    </div>

                    <div className={styles.categories}>
                        <h6>Categories</h6>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryActive : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className={styles.filterSection}>
                        <h6>Level</h6>
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                            <label key={level} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={selectedLevels.includes(level)}
                                    onChange={() => toggleLevel(level)}
                                />
                                {level}
                            </label>
                        ))}
                    </div>
                </aside>

                {/* Course Grid */}
                <div className={styles.courseGrid}>
                    <div className={styles.gridHeader}>
                        <span className="text-sm text-secondary">
                            Showing {filtered.length} of {allCourses.length} courses
                        </span>
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest</option>
                            <option value="rating">Highest Rated</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    <div className={`grid grid-3 ${styles.grid}`}>
                        {filtered.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                className={`card card-hover card-interactive ${styles.courseCard}`}
                            >
                                <div
                                    className={`${styles.cardCover} ${course.thumbnailUrl ? styles.cardCoverImage : ''}`}
                                    style={course.thumbnailUrl
                                        ? { backgroundImage: `url(${course.thumbnailUrl})` }
                                        : { background: course.coverColor }
                                    }
                                >
                                    <span className={`badge badge-accent`}>{course.level}</span>
                                    <div className={styles.cardStats}>
                                        <span><Users size={12} /> {course.students}</span>
                                        <span><Star size={12} fill="currentColor" /> {course.rating}</span>
                                    </div>
                                </div>
                                <div className={styles.cardBody}>
                                    <h4>{course.title}</h4>
                                    <p className="text-sm text-secondary">{course.description}</p>
                                    <div className={styles.cardMeta}>
                                        <span className="text-xs text-tertiary">
                                            <BookOpen size={12} /> {course.lessons} lessons
                                        </span>
                                        <span className="text-xs text-tertiary">
                                            <Clock size={12} /> {course.duration}
                                        </span>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        {course.salePrice ? (
                                            <>
                                                <span className={styles.salePrice}>${course.salePrice}</span>
                                                <span className={styles.originalPrice}>${course.price}</span>
                                                <span className="badge badge-success">
                                                    {Math.round((1 - course.salePrice / course.price) * 100)}% off
                                                </span>
                                            </>
                                        ) : (
                                            <span className={styles.price}>${course.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
