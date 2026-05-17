package infsus.pinsus.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "`lesson`", schema = "public")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String topic;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Instructor teacher;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Instructor student;
}
