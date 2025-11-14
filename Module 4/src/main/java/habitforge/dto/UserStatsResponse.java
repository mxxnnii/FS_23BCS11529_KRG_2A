package habitforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Long userId;
    private String username;
    private Integer totalPoints;
    private Integer totalHabits;
    private Integer activeHabits;
    private Integer totalCompletions;
    private Integer longestStreak;
    private Double overallCompletionRate;
}
