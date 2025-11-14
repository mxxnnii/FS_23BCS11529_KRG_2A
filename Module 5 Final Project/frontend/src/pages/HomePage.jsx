import { Link } from 'react-router-dom';
import { Target, TrendingUp, Trophy, Zap } from 'lucide-react';

const HomePage = () => {
    const features = [
        {
            icon: Target,
            title: 'Track Your Habits',
            description: 'Create and manage daily, weekly, or monthly habits with ease',
        },
        {
            icon: TrendingUp,
            title: 'Build Streaks',
            description: 'Maintain consistency and watch your streaks grow',
        },
        {
            icon: Trophy,
            title: 'Earn Achievements',
            description: 'Unlock milestones and earn points for your dedication',
        },
        {
            icon: Zap,
            title: 'Stay Motivated',
            description: 'Gamified experience keeps you engaged and motivated',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl">⚡</div>
                            <span className="text-xl font-bold text-gray-900">Habit Forge</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="btn-primary"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Forge Your Best <span className="text-primary-600">Habits</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Transform your life one habit at a time with our gamified habit tracking platform.
                        Build streaks, earn rewards, and become the best version of yourself.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                        >
                            Start Your Journey
                        </Link>
                        <Link
                            to="/login"
                            className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg border-2 border-gray-300 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Why Choose Habit Forge?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <Icon className="text-primary-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-primary-600 rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Build Better Habits?
                    </h2>
                    <p className="text-primary-100 text-lg mb-8">
                        Join thousands of users who are transforming their lives with Habit Forge
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block bg-white hover:bg-gray-100 text-primary-600 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2024 Habit Forge. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;