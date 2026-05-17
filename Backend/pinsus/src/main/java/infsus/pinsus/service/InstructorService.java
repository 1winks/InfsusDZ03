package infsus.pinsus.service;

import infsus.pinsus.dto.InstructorDTO;

import java.util.List;

public interface InstructorService {
    List<InstructorDTO> listAllActive();
}
