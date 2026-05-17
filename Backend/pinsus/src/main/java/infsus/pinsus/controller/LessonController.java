package infsus.pinsus.controller;

import infsus.pinsus.domain.Lesson;
import infsus.pinsus.dto.LessonDTO;
import infsus.pinsus.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/resources/lessons")
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @GetMapping("/taught/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<LessonDTO> listLessonsTaught(@PathVariable String name){
        return lessonService.getAllTaught(name);
    }

    @GetMapping("/listened/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<LessonDTO> listLessonsListened(@PathVariable String name){
        return lessonService.getAllListened(name);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Lesson createLesson(@RequestBody LessonDTO lessonDTO) {
        return lessonService.createLesson(lessonDTO);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public void deleteLesson(@RequestBody LessonDTO lessonDTO) {
        lessonService.deleteLesson(lessonDTO);
    }
}
