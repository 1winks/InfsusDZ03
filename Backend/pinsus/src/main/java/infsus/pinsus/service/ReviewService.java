package infsus.pinsus.service;

import infsus.pinsus.domain.Review;
import infsus.pinsus.dto.ProfileDTO;
import infsus.pinsus.dto.ReviewDTO;
import infsus.pinsus.dto.ReviewDTO2;

import java.util.List;

public interface ReviewService {
    List<ReviewDTO> getAllForInstructor(String name);

    Review createReview(ReviewDTO reviewDTO);

    Review updateReview(ReviewDTO reviewDTO);

    void deleteReview(ReviewDTO2 reviewDTO);
}
