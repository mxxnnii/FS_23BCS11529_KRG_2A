package habitforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitLogResponse {
    private Long id;
    private Long habitId;
    private String habitName;
    private LocalDate completionDate;
    private Boolean completed;
    private String notes;
    private Integer pointsEarned;
    private LocalDateTime createdAt;
}
