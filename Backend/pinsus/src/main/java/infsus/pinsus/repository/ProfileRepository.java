package infsus.pinsus.repository;

import infsus.pinsus.domain.Profile;
import infsus.pinsus.domain.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findAllByInstructorId(Long instructorId);
    boolean existsByInstructorIdAndSubject(
            Long instructorId,
            Subject subject
    );

    Profile findByInstructorIdAndSubject(Long instructorId, Subject subject);
}
