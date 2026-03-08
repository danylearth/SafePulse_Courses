'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Search, Star, Users, Clock, BookOpen } from 'lucide-react';

const categories = [
    'All Courses',
    'Performance',
    'Longevity',
    'Safety',
    'Uplift',
    'Education',
    'Harm Reduction',
];

const allCourses = [
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
    },
];

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

export default function CoursesPage() {
    const [activeCategory, setActiveCategory] = useState('All Courses');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced']);

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
                                <div className={styles.cardCover} style={{ background: course.coverColor }}>
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
