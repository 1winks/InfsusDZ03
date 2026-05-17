package infsus.pinsus.dto;

import infsus.pinsus.domain.Instructor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonDTO {
    private LocalDate date;
    private String topic;
    private String teacher;
    private String student;
}
