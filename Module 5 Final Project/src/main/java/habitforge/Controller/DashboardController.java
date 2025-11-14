package habitforge.controller;

import habitforge.dto.DashboardResponse;
import habitforge.dto.MilestoneResponse;
import habitforge.service.DashboardService;
import habitforge.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardController {

    private final DashboardService dashboardService;
    private final MilestoneService milestoneService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        DashboardResponse dashboard = dashboardService.getDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/milestones")
    public ResponseEntity<List<MilestoneResponse>> getAllMilestones(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<MilestoneResponse> milestones = milestoneService.getAllMilestones(userId);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<MilestoneResponse>> getAchievements(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<MilestoneResponse> achievements = milestoneService.getUserAchievements(userId);
        return ResponseEntity.ok(achievements);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return 1L; // Replace with actual user ID extraction from JWT
    }
}