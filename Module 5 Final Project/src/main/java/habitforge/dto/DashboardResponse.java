package habitforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private UserStatsResponse userStats;
    private java.util.List<HabitResponse> activeHabits;
    private java.util.List<HabitLogResponse> recentLogs;
    private java.util.List<MilestoneResponse> achievements;
}
