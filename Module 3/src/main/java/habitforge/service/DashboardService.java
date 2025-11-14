package habitforge.service;

import habitforge.dto.*;
import habitforge.model.Habit;
import habitforge.model.User;
import habitforge.repository.HabitRepository;
import habitforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final HabitRepository habitRepository;
    private final HabitService habitService;
    private final HabitLogService habitLogService;
    private final MilestoneService milestoneService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        UserStatsResponse userStats = getUserStats(userId);
        List<HabitResponse> activeHabits = habitService.getActiveUserHabits(userId);
        List<HabitLogResponse> recentLogs = habitLogService.getUserRecentLogs(userId, 10);
        List<MilestoneResponse> achievements = milestoneService.getUserAchievements(userId);

        DashboardResponse dashboard = new DashboardResponse();
        dashboard.setUserStats(userStats);
        dashboard.setActiveHabits(activeHabits);
        dashboard.setRecentLogs(recentLogs);
        dashboard.setAchievements(achievements);

        return dashboard;
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Habit> allHabits = habitRepository.findByUserId(userId);
        List<Habit> activeHabits = habitRepository.findByUserIdAndIsActive(userId, true);

        int totalCompletions = allHabits.stream()
                .mapToInt(Habit::getTotalCompletions)
                .sum();

        int longestStreak = allHabits.stream()
                .mapToInt(Habit::getLongestStreak)
                .max()
                .orElse(0);

        double totalDays = allHabits.stream()
                .mapToDouble(habit -> {
                    long days = java.time.temporal.ChronoUnit.DAYS.between(
                            habit.getCreatedAt().toLocalDate(),
                            java.time.LocalDate.now()
                    ) + 1;
                    return days;
                })
                .sum();

        double completionRate = totalDays > 0 ? (totalCompletions * 100.0) / totalDays : 0.0;

        UserStatsResponse stats = new UserStatsResponse();
        stats.setUserId(user.getId());
        stats.setUsername(user.getUsername());
        stats.setTotalPoints(user.getTotalPoints());
        stats.setTotalHabits(allHabits.size());
        stats.setActiveHabits(activeHabits.size());
        stats.setTotalCompletions(totalCompletions);
        stats.setLongestStreak(longestStreak);
        stats.setOverallCompletionRate(Math.round(completionRate * 100.0) / 100.0);

        return stats;
    }
}