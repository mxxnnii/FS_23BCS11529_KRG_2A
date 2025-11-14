package habitforge.repository;

import habitforge.model.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    List<HabitLog> findByHabitId(Long habitId);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.completionDate = :date")
    Optional<HabitLog> findByHabitIdAndDate(@Param("habitId") Long habitId,
                                            @Param("date") LocalDate date);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.user.id = :userId " +
            "AND hl.completionDate BETWEEN :startDate AND :endDate ORDER BY hl.completionDate DESC")
    List<HabitLog> findUserLogsInDateRange(@Param("userId") Long userId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.id = :habitId " +
            "AND hl.completionDate BETWEEN :startDate AND :endDate ORDER BY hl.completionDate ASC")
    List<HabitLog> findHabitLogsInDateRange(@Param("habitId") Long habitId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.id = :habitId AND hl.completed = true")
    Long countCompletedByHabitId(@Param("habitId") Long habitId);
}
