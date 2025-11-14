package habitforge.dto;

import habitforge.model.Habit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitRequest {

    @NotBlank(message = "Habit name is required")
    private String name;

    private String description;

    @NotNull(message = "Frequency is required")
    private Habit.Frequency frequency;

    @Positive(message = "Target count must be positive")
    private Integer targetCount = 1;

    private String color = "#3B82F6";

    private String icon = "⭐";
}

