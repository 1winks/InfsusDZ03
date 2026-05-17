package infsus.pinsus.service.impl;

import infsus.pinsus.domain.Instructor;
import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.dto.SubjectDTO;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.repository.SubjectRepository;
import infsus.pinsus.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InstructorServiceImpl implements InstructorService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    @Override
    public List<InstructorDTO> listAllActive() {
        List<InstructorDTO> instructorDTOS = new ArrayList<>();
        List<Instructor> instructors = instructorRepository.findAllByActiveTrue();
        for (Instructor instructor : instructors) {
            InstructorDTO instructorDTO = new InstructorDTO();
            instructorDTO.setName(instructor.getUser().getUsername());
            instructorDTO.setEmail(instructor.getUser().getEmail());
            instructorDTO.setAge(instructorDTO.getAge());
            instructorDTO.setPhone(instructorDTO.getPhone());
            List<SubjectDTO> subjects = new ArrayList<>();
            instructorDTO.setSubjects(subjects);

            instructorDTOS.add(instructorDTO);
        }
        return instructorDTOS;
    }
}
