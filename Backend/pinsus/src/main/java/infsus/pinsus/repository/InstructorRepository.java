package infsus.pinsus.repository;

import infsus.pinsus.domain.Instructor;
import infsus.pinsus.dto.InstructorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    List<Instructor> findAllByActiveTrue();
}
