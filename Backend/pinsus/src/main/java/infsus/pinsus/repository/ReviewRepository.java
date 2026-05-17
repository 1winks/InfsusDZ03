package infsus.pinsus.repository;

import infsus.pinsus.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByReviewerIdAndReviewedId(Long id, Long id1);

    Review findByReviewerIdAndReviewedId(Long id1, Long id2);
}
