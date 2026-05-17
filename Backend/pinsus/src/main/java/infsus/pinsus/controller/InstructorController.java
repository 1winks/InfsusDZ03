package infsus.pinsus.controller;

import infsus.pinsus.domain.Instructor;
import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.dto.InstructorDTO2;
import infsus.pinsus.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/resources/instructors")
public class InstructorController {
    @Autowired
    private InstructorService instructorService;

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
}
