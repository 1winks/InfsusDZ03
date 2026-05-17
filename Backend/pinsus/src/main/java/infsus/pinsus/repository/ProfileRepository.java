package infsus.pinsus.repository;

import infsus.pinsus.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findAllByInstructorId(Long instructorId);
}
