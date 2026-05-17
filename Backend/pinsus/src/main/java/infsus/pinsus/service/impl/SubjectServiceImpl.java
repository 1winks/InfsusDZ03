package infsus.pinsus.service.impl;

import infsus.pinsus.domain.Subject;
import infsus.pinsus.dto.SubjectDTO;
import infsus.pinsus.repository.SubjectRepository;
import infsus.pinsus.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public List<SubjectDTO> listAll() {
        List<Subject> subjects = subjectRepository.findAll();
        List<SubjectDTO> subjectDTOS = new ArrayList<>();
        for (Subject subject : subjects) {
            SubjectDTO subjectDTO = new SubjectDTO(subject.getName());
            subjectDTOS.add(subjectDTO);
        }
        return subjectDTOS;
    }
}
