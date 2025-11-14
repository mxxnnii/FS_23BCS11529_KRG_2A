package habitforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitStatsResponse {
    private Long habitId;
    private String habitName;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalCompletions;
    private Double completionRate;
    private Integer totalDays;
}
