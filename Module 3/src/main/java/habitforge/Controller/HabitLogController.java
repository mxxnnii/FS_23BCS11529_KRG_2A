package habitforge.controller;

import habitforge.dto.HabitLogRequest;
import habitforge.dto.HabitLogResponse;
import habitforge.service.HabitLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HabitLogController {

    private final HabitLogService habitLogService;

    @PostMapping
    public ResponseEntity<HabitLogResponse> logHabit(
            @Valid @RequestBody HabitLogRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        HabitLogResponse response = habitLogService.logHabit(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/habit/{habitId}")
    public ResponseEntity<List<HabitLogResponse>> getHabitLogs(
            @PathVariable Long habitId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<HabitLogResponse> logs = habitLogService.getHabitLogs(habitId, userId, startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<HabitLogResponse>> getRecentLogs(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<HabitLogResponse> logs = habitLogService.getUserRecentLogs(userId, limit);
        return ResponseEntity.ok(logs);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return 1L; // Replace with actual user ID extraction from JWT
    }
}