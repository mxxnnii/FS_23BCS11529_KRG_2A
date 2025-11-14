import { useState, useEffect } from 'react';
import { habitLogAPI } from '../services/api';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const HabitCalendar = ({ habit, onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [currentDate]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            const response = await habitLogAPI.getByHabit(
                habit.id,
                format(start, 'yyyy-MM-dd'),
                format(end, 'yyyy-MM-dd')
            );
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getDaysInMonth = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    };

    const getLogForDate = (date) => {
        return logs.find(log => isSameDay(new Date(log.completionDate), date));
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = getDaysInMonth();
    const firstDayOfMonth = days[0].getDay();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl">{habit.icon}</span>
                        <h2 className="text-2xl font-bold text-gray-900">{habit.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={previousMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900">
                            {format(currentDate, 'MMMM yyyy')}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-600">Loading calendar...</div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                                    <div key={`empty-${index}`} />
                                ))}

                                {days.map(day => {
                                    const log = getLogForDate(day);
                                    const isToday = isSameDay(day, new Date());
                                    const isCompleted = log && log.completed;

                                    return (
                                        <div
                                            key={day.toString()}
                                            className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                                isCompleted
                                                    ? 'bg-green-500 text-white'
                                                    : log && !log.completed
                                                        ? 'bg-gray-200 text-gray-500'
                                                        : isToday
                                                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {format(day, 'd')}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-gray-600">Completed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    <span className="text-gray-600">Skipped</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-primary-100 border-2 border-primary-500 rounded"></div>
                                    <span className="text-gray-600">Today</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HabitCalendar;