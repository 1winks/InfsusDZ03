package infsus.pinsus.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import infsus.pinsus.auth.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "`instructor`", schema = "public")
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Integer age;

    @Column(nullable = true, unique = true)
    private String phone;

    @Column(nullable = false)
    private Boolean active = false;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "instructor")
    private List<Profile> profiles = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reviewer")
    private List<Review> writtenReviews = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reviewed")
    private List<Review> receivedReviews = new ArrayList<>();
}
