import { useState, useEffect } from 'react';
import { habitAPI } from '../services/api';
import { X } from 'lucide-react';

const HabitModal = ({ habit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        frequency: 'DAILY',
        targetCount: 1,
        color: '#3B82F6',
        icon: '⭐',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
    ];

    const icons = [
        '⭐', '🎯', '💪', '📚', '🏃', '🧘', '💧', '🥗',
        '😴', '🎨', '✍️', '🎵', '🌱', '🔥', '⚡', '🌟'
    ];

    useEffect(() => {
        if (habit) {
            setFormData({
                name: habit.name,
                description: habit.description || '',
                frequency: habit.frequency,
                targetCount: habit.targetCount,
                color: habit.color,
                icon: habit.icon,
            });
        }
    }, [habit]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (habit) {
                await habitAPI.update(habit.id, formData);
            } else {
                await habitAPI.create(formData);
            }
            onClose(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save habit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {habit ? 'Edit Habit' : 'Create New Habit'}
                    </h2>
                    <button
                        onClick={() => onClose(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Habit Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Morning Exercise"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            rows="3"
                            placeholder="Optional: Add a description for this habit"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequency *
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Count *
                            </label>
                            <input
                                type="number"
                                name="targetCount"
                                min="1"
                                value={formData.targetCount}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose Icon
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {icons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`text-2xl p-3 rounded-lg border-2 transition-colors ${
                                        formData.icon === icon
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose Color
                        </label>
                        <div className="grid grid-cols-10 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110 ${
                                        formData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : habit ? 'Update Habit' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitModal;