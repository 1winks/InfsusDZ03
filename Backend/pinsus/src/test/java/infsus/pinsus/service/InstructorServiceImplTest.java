package infsus.pinsus.service;

import infsus.pinsus.auth.models.User;
import infsus.pinsus.domain.Instructor;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.service.impl.InstructorServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InstructorServiceImplTest {

    @Mock
    private InstructorRepository instructorRepository;

    @InjectMocks
    private InstructorServiceImpl instructorService;

    @Test
    void listAllActive_returnsOnlyActiveInstructors() {
        User user = new User();
        user.setUsername("admin");
        user.setEmail("lolololoo");
        user.setPassword("nekipassword");

        Instructor instructor = new Instructor();
        instructor.setUser(user);
        instructor.setActive(true);

        when(instructorRepository.findAllByActiveTrue())
                .thenReturn(List.of(instructor));

        var result = instructorService.listAllActive();

        assertEquals(1, result.size());
    }
}