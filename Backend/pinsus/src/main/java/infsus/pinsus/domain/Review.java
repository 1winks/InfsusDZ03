package infsus.pinsus.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "`review`", schema = "public")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private Double score;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Instructor reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewed_id", nullable = false)
    private Instructor reviewed;
}
