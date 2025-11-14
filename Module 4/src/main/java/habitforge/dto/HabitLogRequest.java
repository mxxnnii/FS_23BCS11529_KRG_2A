package habitforge.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitLogRequest {

    @NotNull(message = "Habit ID is required")
    private Long habitId;

    @NotNull(message = "Completion date is required")
    private LocalDate completionDate;

    @NotNull(message = "Completed status is required")
    private Boolean completed;

    private String notes;
}

