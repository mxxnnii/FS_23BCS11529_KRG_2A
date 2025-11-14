package habitforge.repository;

import habitforge.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserId(Long userId);
    List<Habit> findByUserIdAndIsActive(Long userId, Boolean isActive);

    @Query("SELECT h FROM Habit h WHERE h.user.id = :userId AND h.isActive = true ORDER BY h.createdAt DESC")
    List<Habit> findActiveHabitsByUserId(@Param("userId") Long userId);
}
