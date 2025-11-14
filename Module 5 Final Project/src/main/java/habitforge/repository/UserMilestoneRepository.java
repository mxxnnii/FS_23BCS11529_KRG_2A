package habitforge.repository;

import habitforge.model.UserMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMilestoneRepository extends JpaRepository<UserMilestone, Long> {
    List<UserMilestone> findByUserId(Long userId);

    @Query("SELECT um FROM UserMilestone um WHERE um.user.id = :userId ORDER BY um.achievedAt DESC")
    List<UserMilestone> findUserAchievements(@Param("userId") Long userId);

    Boolean existsByUserIdAndMilestoneId(Long userId, Long milestoneId);
}
