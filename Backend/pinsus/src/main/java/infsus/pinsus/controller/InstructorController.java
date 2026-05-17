package infsus.pinsus.controller;

import infsus.pinsus.dto.InstructorDTO;
import infsus.pinsus.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
