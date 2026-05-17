package infsus.pinsus.repository;

import infsus.pinsus.domain.Instructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class InstructorRepositoryTest {

    @Autowired
    private InstructorRepository instructorRepository;

    @Test
    void findAllByActiveTrue_returnsOnlyActiveInstructors() {
        Instructor active = new Instructor();
        active.setActive(true);

        Instructor inactive = new Instructor();
        inactive.setActive(false);

        instructorRepository.save(active);
        instructorRepository.save(inactive);

        var result = instructorRepository.findAllByActiveTrue();

        assertEquals(1, result.size());
    }
}