import { useState, useEffect } from 'react';
import { habitAPI, habitLogAPI } from '../services/api';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import HabitModal from '../components/HabitModal';
import HabitCalendar from '../components/HabitCalendar';

const HabitTrackerPage = () => {
    const [habits, setHabits] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await habitAPI.getActive();
            setHabits(response.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHabit = () => {
        setSelectedHabit(null);
        setShowModal(true);
    };

    const handleEditHabit = (habit) => {
        setSelectedHabit(habit);
        setShowModal(true);
    };

    const handleDeleteHabit = async (habitId) => {
        if (!window.confirm('Are you sure you want to delete this habit?')) return;

        try {
            await habitAPI.delete(habitId);
            fetchHabits();
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const handleLogHabit = async (habitId, completed) => {
        try {
            await habitLogAPI.log({
                habitId,
                completionDate: new Date().toISOString().split('T')[0],
                completed,
                notes: '',
            });
            fetchHabits();
        } catch (error) {
            console.error('Error logging habit:', error);
        }
    };

    const handleModalClose = (refresh) => {
        setShowModal(false);
        setSelectedHabit(null);
        if (refresh) {
            fetchHabits();
        }
    };

    const handleCalendarOpen = (habit) => {
        setSelectedHabit(habit);
        setShowCalendar(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600">Loading habits...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
                    <p className="text-gray-600 mt-1">Manage and track your daily habits</p>
                </div>
                <button
                    onClick={handleCreateHabit}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>New Habit</span>
                </button>
            </div>

            {habits.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
                    <p className="text-gray-600 mb-4">
                        Start building better habits by creating your first one!
                    </p>
                    <button onClick={handleCreateHabit} className="btn-primary">
                        Create Your First Habit
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="card hover:shadow-lg transition-shadow"
                            style={{ borderLeft: `4px solid ${habit.color}` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{habit.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{habit.name}</h3>
                                        {habit.description && (
                                            <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCalendarOpen(habit)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="View Calendar"
                                    >
                                        <Calendar size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleEditHabit(habit)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteHabit(habit.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Current Streak</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {habit.currentStreak} 🔥
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Longest Streak</p>
                                    <p className="text-2xl font-bold text-purple-600">{habit.longestStreak}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Completions</p>
                                    <p className="text-2xl font-bold text-blue-600">{habit.totalCompletions}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Frequency</p>
                                    <p className="text-lg font-bold text-green-600">{habit.frequency}</p>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleLogHabit(habit.id, true)}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
                                >
                                    <CheckCircle size={20} />
                                    <span>Complete Today</span>
                                </button>
                                <button
                                    onClick={() => handleLogHabit(habit.id, false)}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition-colors"
                                >
                                    <XCircle size={20} />
                                    <span>Skip Today</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <HabitModal
                    habit={selectedHabit}
                    onClose={handleModalClose}
                />
            )}

            {showCalendar && selectedHabit && (
                <HabitCalendar
                    habit={selectedHabit}
                    onClose={() => {
                        setShowCalendar(false);
                        setSelectedHabit(null);
                    }}
                />
            )}
        </div>
    );
};

export default HabitTrackerPage;