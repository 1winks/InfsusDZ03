package infsus.pinsus.controller;

import infsus.pinsus.auth.models.User;
import infsus.pinsus.auth.repository.UserRepository;
import infsus.pinsus.domain.Instructor;
import infsus.pinsus.dto.BlockDTO;
import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.dto.InstructorDTO2;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/resources/instructors")
public class InstructorController {
    @Autowired
    private InstructorService instructorService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InstructorRepository instructorRepository;

    @GetMapping("")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<InstructorDTO> listInstructors(){
        return instructorService.listAllActive();
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Instructor updateInstructor(@RequestBody InstructorDTO2 instructorDTO){
        return instructorService.updateInstructor(instructorDTO);
    }

    @PutMapping("/block")
    @PreAuthorize("hasRole('ADMIN')")
    public void changeBlockInstructor(@RequestBody BlockDTO blockDTO){
        Optional<User> user = userRepository.findByUsername(blockDTO.getUsername());
        Boolean blocked = user.get().getBlocked();
        if (blocked) {
            user.get().setBlocked(false);
        } else {
            user.get().setBlocked(true);
            Instructor instructor = user.get().getInstructor();
            instructor.setActive(false);
            instructorRepository.save(instructor);
        }
        userRepository.save(user.get());
    }
}
