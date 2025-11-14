package habitforge.dto;

import habitforge.model.Habit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitResponse {
    private Long id;
    private String name;
    private String description;
    private Habit.Frequency frequency;
    private Integer targetCount;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalCompletions;
    private String color;
    private String icon;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
