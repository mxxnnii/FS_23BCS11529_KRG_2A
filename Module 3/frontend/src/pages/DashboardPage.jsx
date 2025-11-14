import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { TrendingUp, Target, Award, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await dashboardAPI.get();
            setDashboard(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="text-center text-gray-600">
                Failed to load dashboard. Please try again.
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Points',
            value: dashboard.userStats.totalPoints,
            icon: Award,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            label: 'Active Habits',
            value: dashboard.userStats.activeHabits,
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Longest Streak',
            value: `${dashboard.userStats.longestStreak} days`,
            icon: Flame,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            label: 'Completion Rate',
            value: `${dashboard.userStats.overallCompletionRate}%`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {dashboard.userStats.username}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Habits */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Habits</h2>
                {dashboard.activeHabits.length === 0 ? (
                    <p className="text-gray-600">No active habits. Start by creating one!</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dashboard.activeHabits.map((habit) => (
                            <div
                                key={habit.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                style={{ borderLeft: `4px solid ${habit.color}` }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{habit.icon}</span>
                                        <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>Streak: {habit.currentStreak} days 🔥</p>
                                    <p>Completions: {habit.totalCompletions}</p>
                                    <p>Frequency: {habit.frequency}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                {dashboard.recentLogs.length === 0 ? (
                    <p className="text-gray-600">No recent activity.</p>
                ) : (
                    <div className="space-y-3">
                        {dashboard.recentLogs.slice(0, 5).map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{log.habitName}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(log.completionDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {log.completed && (
                                        <>
                                            <span className="text-green-600 font-medium">+{log.pointsEarned} pts</span>
                                            <span className="text-2xl">✓</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Achievements */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
                {dashboard.achievements.length === 0 ? (
                    <p className="text-gray-600">Complete habits to unlock achievements!</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dashboard.achievements.slice(0, 6).map((achievement) => (
                            <div
                                key={achievement.id}
                                className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
                            >
                                <div className="text-3xl mb-2">{achievement.badge}</div>
                                <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(achievement.achievedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;