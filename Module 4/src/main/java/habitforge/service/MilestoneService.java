package habitforge.service;

import habitforge.dto.MilestoneResponse;
import habitforge.model.Milestone;
import habitforge.model.User;
import habitforge.model.UserMilestone;
import habitforge.repository.MilestoneRepository;
import habitforge.repository.UserMilestoneRepository;
import habitforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final UserMilestoneRepository userMilestoneRepository;
    private final UserRepository userRepository;

    @Transactional
    public void initializeMilestones() {
        if (milestoneRepository.count() == 0) {
            createDefaultMilestones();
        }
    }

    private void createDefaultMilestones() {
        List<Milestone> milestones = List.of(
                createMilestone("First Steps", "Complete your first day", 1, 10, "🌱"),
                createMilestone("Getting Started", "Maintain a 3-day streak", 3, 25, "🔥"),
                createMilestone("Week Warrior", "Maintain a 7-day streak", 7, 50, "⚡"),
                createMilestone("Two Weeks Strong", "Maintain a 14-day streak", 14, 100, "💪"),
                createMilestone("Three Weeks Champion", "Maintain a 21-day streak", 21, 200, "🏆"),
                createMilestone("Month Master", "Maintain a 30-day streak", 30, 300, "👑"),
                createMilestone("Unstoppable", "Maintain a 60-day streak", 60, 600, "🌟"),
                createMilestone("Legend", "Maintain a 100-day streak", 100, 1000, "🎖️")
        );

        milestoneRepository.saveAll(milestones);
    }

    private Milestone createMilestone(String name, String description,
                                      int requiredStreak, int pointsReward, String badge) {
        Milestone milestone = new Milestone();
        milestone.setName(name);
        milestone.setDescription(description);
        milestone.setRequiredStreak(requiredStreak);
        milestone.setPointsReward(pointsReward);
        milestone.setBadge(badge);
        return milestone;
    }

    @Transactional
    public void checkAndAwardMilestones(Long userId, int currentStreak) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Milestone> eligibleMilestones = milestoneRepository.findAll().stream()
                .filter(m -> m.getRequiredStreak() <= currentStreak)
                .filter(m -> !userMilestoneRepository.existsByUserIdAndMilestoneId(userId, m.getId()))
                .collect(Collectors.toList());

        for (Milestone milestone : eligibleMilestones) {
            UserMilestone userMilestone = new UserMilestone();
            userMilestone.setUser(user);
            userMilestone.setMilestone(milestone);
            userMilestone.setAchievedAt(LocalDateTime.now());

            userMilestoneRepository.save(userMilestone);

            user.addPoints(milestone.getPointsReward());
        }

        if (!eligibleMilestones.isEmpty()) {
            userRepository.save(user);
        }
    }

    @Transactional(readOnly = true)
    public List<MilestoneResponse> getAllMilestones(Long userId) {
        List<Milestone> allMilestones = milestoneRepository.findAllByOrderByRequiredStreakAsc();
        List<UserMilestone> userAchievements = userMilestoneRepository.findByUserId(userId);

        return allMilestones.stream()
                .map(milestone -> {
                    UserMilestone achievement = userAchievements.stream()
                            .filter(um -> um.getMilestone().getId().equals(milestone.getId()))
                            .findFirst()
                            .orElse(null);

                    return mapToResponse(milestone, achievement);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MilestoneResponse> getUserAchievements(Long userId) {
        return userMilestoneRepository.findUserAchievements(userId).stream()
                .map(um -> mapToResponse(um.getMilestone(), um))
                .collect(Collectors.toList());
    }

    private MilestoneResponse mapToResponse(Milestone milestone, UserMilestone achievement) {
        MilestoneResponse response = new MilestoneResponse();
        response.setId(milestone.getId());
        response.setName(milestone.getName());
        response.setDescription(milestone.getDescription());
        response.setRequiredStreak(milestone.getRequiredStreak());
        response.setPointsReward(milestone.getPointsReward());
        response.setBadge(milestone.getBadge());
        response.setAchieved(achievement != null);
        response.setAchievedAt(achievement != null ? achievement.getAchievedAt() : null);
        return response;
    }
}