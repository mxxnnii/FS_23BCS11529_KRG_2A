package habitforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneResponse {
    private Long id;
    private String name;
    private String description;
    private Integer requiredStreak;
    private Integer pointsReward;
    private String badge;
    private Boolean achieved;
    private LocalDateTime achievedAt;
}