package infsus.pinsus.service;

import infsus.pinsus.domain.Lesson;
import infsus.pinsus.dto.LessonDTO;

import java.util.List;

public interface LessonService {

    List<LessonDTO> getAllTaught(String name);

    List<LessonDTO> getAllListened(String name);

    Lesson createLesson(LessonDTO lessonDTO);

    void deleteLesson(LessonDTO lessonDTO);
}
