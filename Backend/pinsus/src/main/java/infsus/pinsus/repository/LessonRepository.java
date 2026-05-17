package infsus.pinsus.repository;

import infsus.pinsus.domain.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    boolean existsByTeacherIdAndStudentIdAndTopicAndDate(
            Long teacherId,
            Long studentId,
            String topic,
            LocalDate date
    );

    Lesson findByTeacherIdAndStudentIdAndTopicAndDate(
            Long teacherId,
            Long studentId,
            String topic,
            LocalDate date
    );
}
