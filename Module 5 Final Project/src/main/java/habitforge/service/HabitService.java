package habitforge.service;

import habitforge.dto.HabitRequest;
import habitforge.dto.HabitResponse;
import habitforge.dto.HabitStatsResponse;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final HabitLogRepository habitLogRepository;

    @Transactional
    public HabitResponse createHabit(Long userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Habit habit = new Habit();
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setFrequency(request.getFrequency());
        habit.setTargetCount(request.getTargetCount());
        habit.setColor(request.getColor());
        habit.setIcon(request.getIcon());
        habit.setUser(user);

        Habit savedHabit = habitRepository.save(habit);
        return mapToResponse(savedHabit);
    }

    @Transactional(readOnly = true)
    public List<HabitResponse> getUserHabits(Long userId) {
        return habitRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HabitResponse> getActiveUserHabits(Long userId) {
        return habitRepository.findActiveHabitsByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HabitResponse getHabit(Long habitId, Long userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToResponse(habit);
    }

    @Transactional
    public HabitResponse updateHabit(Long habitId, Long userId, HabitRequest request) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setFrequency(request.getFrequency());
        habit.setTargetCount(request.getTargetCount());
        habit.setColor(request.getColor());
        habit.setIcon(request.getIcon());

        Habit updatedHabit = habitRepository.save(habit);
        return mapToResponse(updatedHabit);
    }

    @Transactional
    public void deleteHabit(Long habitId, Long userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        habitRepository.delete(habit);
    }

    @Transactional(readOnly = true)
    public HabitStatsResponse getHabitStats(Long habitId, Long userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        LocalDate startDate = habit.getCreatedAt().toLocalDate();
        LocalDate endDate = LocalDate.now();
        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;

        Long completedCount = habitLogRepository.countCompletedByHabitId(habitId);
        double completionRate = totalDays > 0 ? (completedCount * 100.0) / totalDays : 0.0;

        HabitStatsResponse stats = new HabitStatsResponse();
        stats.setHabitId(habit.getId());
        stats.setHabitName(habit.getName());
        stats.setCurrentStreak(habit.getCurrentStreak());
        stats.setLongestStreak(habit.getLongestStreak());
        stats.setTotalCompletions(habit.getTotalCompletions());
        stats.setCompletionRate(Math.round(completionRate * 100.0) / 100.0);
        stats.setTotalDays((int) totalDays);

        return stats;
    }

    private HabitResponse mapToResponse(Habit habit) {
        HabitResponse response = new HabitResponse();
        response.setId(habit.getId());
        response.setName(habit.getName());
        response.setDescription(habit.getDescription());
        response.setFrequency(habit.getFrequency());
        response.setTargetCount(habit.getTargetCount());
        response.setCurrentStreak(habit.getCurrentStreak());
        response.setLongestStreak(habit.getLongestStreak());
        response.setTotalCompletions(habit.getTotalCompletions());
        response.setColor(habit.getColor());
        response.setIcon(habit.getIcon());
        response.setIsActive(habit.getIsActive());
        response.setCreatedAt(habit.getCreatedAt());
        response.setUpdatedAt(habit.getUpdatedAt());
        return response;
    }
}