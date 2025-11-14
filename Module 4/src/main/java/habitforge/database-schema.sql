-- Create database
CREATE DATABASE IF NOT EXISTS habit_forge;
USE habit_forge;

-- Users table
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    total_points INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
    );

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
                                          user_id BIGINT NOT NULL,
                                          role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      user_id BIGINT NOT NULL,
                                      name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    frequency VARCHAR(20) NOT NULL,
    target_count INT DEFAULT 1 NOT NULL,
    current_streak INT DEFAULT 0 NOT NULL,
    longest_streak INT DEFAULT 0 NOT NULL,
    total_completions INT DEFAULT 0 NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6' NOT NULL,
    icon VARCHAR(10) DEFAULT '⭐' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
    );

-- Habit logs table
CREATE TABLE IF NOT EXISTS habit_logs (
                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                          habit_id BIGINT NOT NULL,
                                          completion_date DATE NOT NULL,
                                          completed BOOLEAN DEFAULT FALSE NOT NULL,
                                          notes VARCHAR(500),
    points_earned INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_date (habit_id, completion_date),
    INDEX idx_habit_id (habit_id),
    INDEX idx_completion_date (completion_date)
    );

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                          name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    required_streak INT NOT NULL,
    points_reward INT NOT NULL,
    badge VARCHAR(10) DEFAULT '🏆' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_required_streak (required_streak)
    );

-- User milestones (achievements) table
CREATE TABLE IF NOT EXISTS user_milestones (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               user_id BIGINT NOT NULL,
                                               milestone_id BIGINT NOT NULL,
                                               achieved_at TIMESTAMP NOT NULL,
                                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_milestone (user_id, milestone_id),
    INDEX idx_user_id (user_id),
    INDEX idx_milestone_id (milestone_id)
    );

-- Insert default milestones
INSERT INTO milestones (name, description, required_streak, points_reward, badge) VALUES
                                                                                      ('First Steps', 'Complete your first day', 1, 10, '🌱'),
                                                                                      ('Getting Started', 'Maintain a 3-day streak', 3, 25, '🔥'),
                                                                                      ('Week Warrior', 'Maintain a 7-day streak', 7, 50, '⚡'),
                                                                                      ('Two Weeks Strong', 'Maintain a 14-day streak', 14, 100, '💪'),
                                                                                      ('Three Weeks Champion', 'Maintain a 21-day streak', 21, 200, '🏆'),
                                                                                      ('Month Master', 'Maintain a 30-day streak', 30, 300, '👑'),
                                                                                      ('Unstoppable', 'Maintain a 60-day streak', 60, 600, '🌟'),
                                                                                      ('Legend', 'Maintain a 100-day streak', 100, 1000, '🎖️')
    ON DUPLICATE KEY UPDATE name=name;

-- Create a sample admin user (password: admin123)
-- Note: This should be changed in production
INSERT INTO users (username, email, password, full_name, total_points, is_active) VALUES
    ('admin', 'admin@habitforge.com', '$2a$10$XQs8F9XRjZ8bX9xYxYxYxeP8kkF8jKjKjKjKjKjKjKjKjKjKjKjKj', 'Administrator', 0, TRUE)
    ON DUPLICATE KEY UPDATE username=username;

-- Assign admin role
INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_ADMIN' FROM users WHERE username = 'admin'
    ON DUPLICATE KEY UPDATE role=role;

INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_USER' FROM users WHERE username = 'admin'
    ON DUPLICATE KEY UPDATE role=role;