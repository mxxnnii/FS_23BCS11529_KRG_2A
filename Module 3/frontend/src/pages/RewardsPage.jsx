import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { Award, Lock, CheckCircle, Clock } from 'lucide-react';

const RewardsPage = () => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        try {
            const response = await dashboardAPI.getMilestones();
            setMilestones(response.data);
        } catch (error) {
            console.error('Error fetching milestones:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600">Loading rewards...</div>
            </div>
        );
    }

    const achieved = milestones.filter(m => m.achieved);
    const upcoming = milestones.filter(m => !m.achieved);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards & Achievements</h1>
                <p className="text-gray-600">Track your milestones and unlock achievements</p>
            </div>

            {/* Coming Soon Banner */}
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-4 rounded-full">
                        <Award size={32} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Rewards Store Coming Soon!</h2>
                        <p className="text-gray-700">
                            Soon you'll be able to redeem your points for exciting rewards. Keep building those streaks!
                        </p>
                    </div>
                    <Clock size={48} className="text-purple-300" />
                </div>
            </div>

            {/* Achievements Earned */}
            {achieved.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <CheckCircle className="text-green-600" size={28} />
                        <span>Achievements Earned ({achieved.length})</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achieved.map((milestone) => (
                            <div
                                key={milestone.id}
                                className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="text-5xl">{milestone.badge}</div>
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.name}</h3>
                                <p className="text-gray-700 mb-3">{milestone.description}</p>
                                <div className="flex items-center justify-between text-sm">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                    +{milestone.pointsReward} points
                  </span>
                                    <span className="text-gray-600">
                    {new Date(milestone.achievedAt).toLocaleDateString()}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Milestones */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Lock className="text-gray-400" size={28} />
                    <span>Upcoming Milestones ({upcoming.length})</span>
                </h2>
                {upcoming.length === 0 ? (
                    <div className="card text-center py-8">
                        <p className="text-gray-600">
                            🎉 Congratulations! You've unlocked all available milestones!
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcoming.map((milestone) => (
                            <div
                                key={milestone.id}
                                className="card bg-gray-50 border-2 border-gray-200 opacity-75 hover:opacity-100 transition-opacity"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="text-5xl grayscale">{milestone.badge}</div>
                                    <Lock className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.name}</h3>
                                <p className="text-gray-600 mb-3">{milestone.description}</p>
                                <div className="flex items-center justify-between">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium text-sm">
                    {milestone.requiredStreak} day streak
                  </span>
                                    <span className="text-primary-600 font-medium text-sm">
                    +{milestone.pointsReward} pts
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Progress Summary */}
            <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Total Achievements</p>
                        <p className="text-3xl font-bold text-blue-600">{achieved.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Remaining</p>
                        <p className="text-3xl font-bold text-gray-600">{upcoming.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Completion</p>
                        <p className="text-3xl font-bold text-green-600">
                            {Math.round((achieved.length / milestones.length) * 100)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsPage;