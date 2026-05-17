package infsus.pinsus.controller;

import infsus.pinsus.dto.SubjectDTO;
import infsus.pinsus.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/resources/subjects")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @GetMapping("")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<SubjectDTO> listSubjects(){
        return subjectService.listAll();
    }
}
