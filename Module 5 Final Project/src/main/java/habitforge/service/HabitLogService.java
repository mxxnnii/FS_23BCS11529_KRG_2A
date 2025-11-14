package habitforge.service;

import habitforge.dto.HabitLogRequest;
import habitforge.dto.HabitLogResponse;
import habitforge.model.Habit;
import habitforge.model.HabitLog;
import habitforge.model.User;
import habitforge.repository.HabitLogRepository;
import habitforge.repository.HabitRepository;
import habitforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitLogService {

    private final HabitLogRepository habitLogRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final MilestoneService milestoneService;

    @Transactional
    public HabitLogResponse logHabit(Long userId, HabitLogRequest request) {
        Habit habit = habitRepository.findById(request.getHabitId())
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        Optional<HabitLog> existingLog = habitLogRepository
                .findByHabitIdAndDate(request.getHabitId(), request.getCompletionDate());

        HabitLog log;
        if (existingLog.isPresent()) {
            log = existingLog.get();
            log.setCompleted(request.getCompleted());
            log.setNotes(request.getNotes());
        } else {
            log = new HabitLog();
            log.setHabit(habit);
            log.setCompletionDate(request.getCompletionDate());
            log.setCompleted(request.getCompleted());
            log.setNotes(request.getNotes());
        }

        if (request.getCompleted()) {
            updateStreakAndPoints(habit, request.getCompletionDate(), log);
        } else {
            if (isStreakBroken(habit, request.getCompletionDate())) {
                habit.resetStreak();
            }
            log.setPointsEarned(0);
        }

        habitRepository.save(habit);
        HabitLog savedLog = habitLogRepository.save(log);

        // Check for milestone achievements
        milestoneService.checkAndAwardMilestones(userId, habit.getCurrentStreak());

        return mapToResponse(savedLog);
    }

    @Transactional(readOnly = true)
    public List<HabitLogResponse> getHabitLogs(Long habitId, Long userId,
                                               LocalDate startDate, LocalDate endDate) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return habitLogRepository.findHabitLogsInDateRange(habitId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HabitLogResponse> getUserRecentLogs(Long userId, int limit) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);

        return habitLogRepository.findUserLogsInDateRange(userId, startDate, endDate)
                .stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void updateStreakAndPoints(Habit habit, LocalDate completionDate, HabitLog log) {
        LocalDate yesterday = completionDate.minusDays(1);
        Optional<HabitLog> yesterdayLog = habitLogRepository
                .findByHabitIdAndDate(habit.getId(), yesterday);

        if (yesterdayLog.isPresent() && yesterdayLog.get().getCompleted()) {
            habit.incrementStreak();
        } else if (habit.getCurrentStreak() == 0) {
            habit.incrementStreak();
        } else if (!completionDate.equals(LocalDate.now())) {
            habit.resetStreak();
            habit.incrementStreak();
        }

        habit.incrementCompletions();

        int points = calculatePoints(habit.getCurrentStreak());
        log.setPointsEarned(points);

        User user = habit.getUser();
        user.addPoints(points);
        userRepository.save(user);
    }

    private boolean isStreakBroken(Habit habit, LocalDate completionDate) {
        if (completionDate.equals(LocalDate.now())) {
            return false;
        }

        LocalDate yesterday = completionDate.minusDays(1);
        Optional<HabitLog> yesterdayLog = habitLogRepository
                .findByHabitIdAndDate(habit.getId(), yesterday);

        return yesterdayLog.isEmpty() || !yesterdayLog.get().getCompleted();
    }

    private int calculatePoints(int streak) {
        if (streak >= 30) return 50;
        if (streak >= 21) return 30;
        if (streak >= 14) return 20;
        if (streak >= 7) return 15;
        if (streak >= 3) return 10;
        return 5;
    }

    private HabitLogResponse mapToResponse(HabitLog log) {
        HabitLogResponse response = new HabitLogResponse();
        response.setId(log.getId());
        response.setHabitId(log.getHabit().getId());
        response.setHabitName(log.getHabit().getName());
        response.setCompletionDate(log.getCompletionDate());
        response.setCompleted(log.getCompleted());
        response.setNotes(log.getNotes());
        response.setPointsEarned(log.getPointsEarned());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }
}