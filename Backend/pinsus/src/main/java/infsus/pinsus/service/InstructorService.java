package infsus.pinsus.service;

import infsus.pinsus.domain.Instructor;
import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.dto.InstructorDTO2;

import java.util.List;

public interface InstructorService {
    List<InstructorDTO> listAllActive();

    Instructor updateInstructor(InstructorDTO2 instructorDTO);
}
