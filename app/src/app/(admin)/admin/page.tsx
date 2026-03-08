'use client';

import styles from './page.module.css';
import { DollarSign, Users, BookOpen, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
    { label: 'Total Revenue', value: '£12,459', icon: DollarSign, change: '+23%', positive: true, period: 'vs last month' },
    { label: 'Active Students', value: '1,247', icon: Users, change: '+18%', positive: true, period: 'vs last month' },
    { label: 'Courses Sold', value: '342', icon: BookOpen, change: '+31%', positive: true, period: 'vs last month' },
    { label: 'Conversion Rate', value: '4.2%', icon: TrendingUp, change: '-0.3%', positive: false, period: 'vs last month' },
];

const recentSales = [
    { id: '#3066', course: 'PED Safety Fundamentals', student: 'James T.', date: 'Mar 8, 2026', amount: '£89.99', status: 'Paid' },
    { id: '#3065', course: 'Longevity Protocols', student: 'Sarah M.', date: 'Mar 8, 2026', amount: '£79.99', status: 'Paid' },
    { id: '#3064', course: 'Blood Work Interpretation', student: 'David K.', date: 'Mar 7, 2026', amount: '£39.99', status: 'Paid' },
    { id: '#3063', course: 'Performance Science', student: 'Rachel P.', date: 'Mar 7, 2026', amount: '£149.99', status: 'Paid' },
    { id: '#3062', course: 'PED Safety Fundamentals', student: 'Tom W.', date: 'Mar 6, 2026', amount: '£89.99', status: 'Refunded' },
    { id: '#3061', course: 'Post-Cycle Recovery', student: 'Lisa N.', date: 'Mar 6, 2026', amount: '£59.99', status: 'Paid' },
];

const topCourses = [
    { title: 'PED Safety Fundamentals', sales: 156, revenue: '£14,039', growth: '+24%' },
    { title: 'Blood Work Interpretation', sales: 134, revenue: '£5,355', growth: '+42%' },
    { title: 'Post-Cycle Recovery', sales: 98, revenue: '£5,879', growth: '+15%' },
    { title: 'Longevity Protocols', sales: 87, revenue: '£6,959', growth: '+31%' },
    { title: 'Performance Science', sales: 64, revenue: '£9,599', growth: '+8%' },
];

const revenueData = [
    { month: 'Oct', value: 4200 },
    { month: 'Nov', value: 5800 },
    { month: 'Dec', value: 7100 },
    { month: 'Jan', value: 8900 },
    { month: 'Feb', value: 10200 },
    { month: 'Mar', value: 12459 },
];

export default function AdminDashboardPage() {
    const maxRevenue = Math.max(...revenueData.map((d) => d.value));

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1>Admin Dashboard</h1>
                <p className="text-secondary">Overview of your course platform performance.</p>
            </div>

            {/* Stats */}
            <div className={`grid grid-4 ${styles.statsGrid}`}>
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`card ${styles.statCard}`}>
                            <div className={styles.statTop}>
                                <div className={styles.statIcon}>
                                    <Icon size={20} />
                                </div>
                                <span className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
                                    {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </span>
                            </div>
                            <div className={styles.statBottom}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.columns}>
                {/* Revenue Chart */}
                <div className={`card ${styles.chartCard}`}>
                    <div className={styles.chartHeader}>
                        <h3>Revenue</h3>
                        <span className="text-sm text-secondary">Last 6 months</span>
                    </div>
                    <div className={styles.chart}>
                        {revenueData.map((d) => (
                            <div key={d.month} className={styles.chartCol}>
                                <div
                                    className={styles.chartBar}
                                    style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                                >
                                    <span className={styles.chartTooltip}>£{d.value.toLocaleString()}</span>
                                </div>
                                <span className={styles.chartLabel}>{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Courses */}
                <div className={`card ${styles.topCoursesCard}`}>
                    <h3>Top Courses</h3>
                    <div className={styles.topCoursesList}>
                        {topCourses.map((course, i) => (
                            <div key={i} className={styles.topCourseItem}>
                                <div className={styles.topCourseRank}>{i + 1}</div>
                                <div className={styles.topCourseInfo}>
                                    <span className={styles.topCourseTitle}>{course.title}</span>
                                    <span className="text-xs text-tertiary">{course.sales} sales</span>
                                </div>
                                <div className={styles.topCourseRight}>
                                    <span className={styles.topCourseRevenue}>{course.revenue}</span>
                                    <span className="text-xs positive">{course.growth}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Sales */}
            <div className={`card ${styles.salesCard}`}>
                <div className={styles.salesHeader}>
                    <h3>Recent Sales</h3>
                    <button className="btn btn-ghost btn-sm">View All</button>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Course</th>
                                <th>Student</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentSales.map((sale) => (
                                <tr key={sale.id}>
                                    <td className="text-accent">{sale.id}</td>
                                    <td>{sale.course}</td>
                                    <td>{sale.student}</td>
                                    <td className="text-secondary">{sale.date}</td>
                                    <td className="text-primary" style={{ fontWeight: 600 }}>{sale.amount}</td>
                                    <td>
                                        <span className={`badge ${sale.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
