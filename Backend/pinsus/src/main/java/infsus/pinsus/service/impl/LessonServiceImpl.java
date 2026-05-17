package infsus.pinsus.service.impl;

import infsus.pinsus.auth.models.User;
import infsus.pinsus.auth.repository.UserRepository;
import infsus.pinsus.domain.Instructor;
import infsus.pinsus.domain.Lesson;
import infsus.pinsus.dto.LessonDTO;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.repository.LessonRepository;
import infsus.pinsus.repository.SubjectRepository;
import infsus.pinsus.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceImpl implements LessonService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public List<LessonDTO> getAllTaught(String name) {
        List<LessonDTO> lessonDTOS = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(name);
        Instructor instructor = user.get().getInstructor();
        List<Lesson> lessons = instructor.getTaughtLessons();
        for (Lesson lesson : lessons) {
            LessonDTO lessonDTO = new LessonDTO();
            lessonDTO.setDate(lesson.getDate());
            lessonDTO.setTopic(lesson.getTopic());
            lessonDTO.setTeacher(lesson.getTeacher().getUser().getUsername());
            lessonDTO.setStudent(lesson.getStudent().getUser().getUsername());
            lessonDTOS.add(lessonDTO);
        }
        return lessonDTOS;
    }

    @Override
    public List<LessonDTO> getAllListened(String name) {
        List<LessonDTO> lessonDTOS = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(name);
        Instructor instructor = user.get().getInstructor();
        List<Lesson> lessons = instructor.getAttendedLessons();
        for (Lesson lesson : lessons) {
            LessonDTO lessonDTO = new LessonDTO();
            lessonDTO.setDate(lesson.getDate());
            lessonDTO.setTopic(lesson.getTopic());
            lessonDTO.setTeacher(lesson.getTeacher().getUser().getUsername());
            lessonDTO.setStudent(lesson.getStudent().getUser().getUsername());
            lessonDTOS.add(lessonDTO);
        }
        return lessonDTOS;
    }

    @Override
    public Lesson createLesson(LessonDTO lessonDTO) {
        Lesson lesson = new Lesson();
        lesson.setDate(lessonDTO.getDate());
        lesson.setTopic(lessonDTO.getTopic());

        Optional<User> user1 = userRepository.findByUsername(lessonDTO.getTeacher());
        Instructor teacher = user1.get().getInstructor();
        Optional<User> user2 = userRepository.findByUsername(lessonDTO.getStudent());
        Instructor student = user2.get().getInstructor();
        if (lessonRepository.existsByTeacherIdAndStudentIdAndTopicAndDate(
                teacher.getId(),
                student.getId(),
                lessonDTO.getTopic(),
                lessonDTO.getDate()
        )) {
            throw new RuntimeException("Lesson already exists");
        }

        lesson.setTeacher(teacher);
        lesson.setStudent(student);
        List<Lesson> lessons1 = teacher.getTaughtLessons();
        List<Lesson> lessons2 = student.getAttendedLessons();
        lessons1.add(lesson);
        lessons2.add(lesson);
        instructorRepository.save(teacher);
        instructorRepository.save(student);
        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(LessonDTO lessonDTO) {
        Optional<User> user1 = userRepository.findByUsername(lessonDTO.getTeacher());
        Instructor teacher = user1.get().getInstructor();
        Optional<User> user2 = userRepository.findByUsername(lessonDTO.getStudent());
        Instructor student = user2.get().getInstructor();
        Lesson lesson = lessonRepository.findByTeacherIdAndStudentIdAndTopicAndDate(
                teacher.getId(),
                student.getId(),
                lessonDTO.getTopic(),
                lessonDTO.getDate()
        );
        lessonRepository.delete(lesson);
    }
}
