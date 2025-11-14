package habitforge.controller;

import habitforge.dto.HabitRequest;
import habitforge.dto.HabitResponse;
import habitforge.dto.HabitStatsResponse;
import habitforge.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HabitController {

    private final HabitService habitService;

    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(
            @Valid @RequestBody HabitRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        HabitResponse response = habitService.createHabit(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getAllHabits(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<HabitResponse> habits = habitService.getUserHabits(userId);
        return ResponseEntity.ok(habits);
    }

    @GetMapping("/active")
    public ResponseEntity<List<HabitResponse>> getActiveHabits(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<HabitResponse> habits = habitService.getActiveUserHabits(userId);
        return ResponseEntity.ok(habits);
    }

    @GetMapping("/{habitId}")
    public ResponseEntity<HabitResponse> getHabit(
            @PathVariable Long habitId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        HabitResponse response = habitService.getHabit(habitId, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{habitId}")
    public ResponseEntity<HabitResponse> updateHabit(
            @PathVariable Long habitId,
            @Valid @RequestBody HabitRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        HabitResponse response = habitService.updateHabit(habitId, userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{habitId}")
    public ResponseEntity<Void> deleteHabit(
            @PathVariable Long habitId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        habitService.deleteHabit(habitId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{habitId}/stats")
    public ResponseEntity<HabitStatsResponse> getHabitStats(
            @PathVariable Long habitId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        HabitStatsResponse stats = habitService.getHabitStats(habitId, userId);
        return ResponseEntity.ok(stats);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        // In a real implementation, you would extract the user ID from JWT claims
        // For now, we'll use a simplified approach
        return 1L; // This should be replaced with actual user ID extraction
    }
}