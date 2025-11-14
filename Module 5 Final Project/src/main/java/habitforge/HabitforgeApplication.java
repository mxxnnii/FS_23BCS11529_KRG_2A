package habitforge;

import habitforge.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@RequiredArgsConstructor
public class HabitforgeApplication {

    private final MilestoneService milestoneService;

    public static void main(String[] args) {
        SpringApplication.run(HabitforgeApplication.class, args);
    }

    @Bean
    public CommandLineRunner init() {
        return args -> {
            milestoneService.initializeMilestones();
        };
    }
}