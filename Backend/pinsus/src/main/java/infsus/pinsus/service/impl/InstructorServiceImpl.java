package infsus.pinsus.service.impl;

import infsus.pinsus.auth.models.User;
import infsus.pinsus.auth.repository.UserRepository;
import infsus.pinsus.domain.Instructor;
import infsus.pinsus.domain.Profile;
import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.dto.InstructorDTO2;
import infsus.pinsus.dto.InstructorDTO3;
import infsus.pinsus.dto.SubjectDTO;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.repository.SubjectRepository;
import infsus.pinsus.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InstructorServiceImpl implements InstructorService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<InstructorDTO> listAllActive() {
        List<InstructorDTO> instructorDTOS = new ArrayList<>();
        List<Instructor> instructors = instructorRepository.findAllByActiveTrue();
        for (Instructor instructor : instructors) {
            InstructorDTO instructorDTO = new InstructorDTO();
            instructorDTO.setName(instructor.getUser().getUsername());
            instructorDTO.setEmail(instructor.getUser().getEmail());
            instructorDTO.setAge(instructor.getAge());
            instructorDTO.setPhone(instructor.getPhone());

            List<Profile> profiles = instructor.getProfiles();
            List<SubjectDTO> subjects = new ArrayList<>();
            for (Profile profile : profiles) {
                String subjectName = profile.getSubject().getName();
                SubjectDTO subjectDTO = new SubjectDTO(subjectName);
                subjects.add(subjectDTO);
            }
            instructorDTO.setSubjects(subjects);

            instructorDTOS.add(instructorDTO);
        }
        return instructorDTOS;
    }

    @Override
    public Instructor updateInstructor(InstructorDTO2 instructorDTO) {
        Optional<User> user = userRepository.findByUsername(instructorDTO.getName());
        Instructor instructor = user.get().getInstructor();
        instructor.setAge(instructorDTO.getAge());
        instructor.setPhone(instructorDTO.getPhone());
        instructor.setActive(instructorDTO.getActive());
        return instructorRepository.save(instructor);
    }

    @Override
    public List<InstructorDTO3> listAll() {
        List<InstructorDTO3> instructorDTO3s = new ArrayList<>();
        List<Instructor> instructors = instructorRepository.findAll();
        for (Instructor instructor : instructors) {
            User user = instructor.getUser();
            InstructorDTO3 instructorDTO3 = new InstructorDTO3();
            instructorDTO3.setBlocked(user.getBlocked());
            instructorDTO3.setName(user.getUsername());
            instructorDTO3.setActive(instructor.getActive());
            instructorDTO3s.add(instructorDTO3);
        }
        return instructorDTO3s;
    }
}
