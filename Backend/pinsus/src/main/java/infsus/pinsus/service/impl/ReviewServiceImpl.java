package infsus.pinsus.service.impl;

import infsus.pinsus.auth.models.User;
import infsus.pinsus.auth.repository.UserRepository;
import infsus.pinsus.domain.Instructor;
import infsus.pinsus.domain.Review;
import infsus.pinsus.dto.ReviewDTO;
import infsus.pinsus.dto.ReviewDTO2;
import infsus.pinsus.repository.InstructorRepository;
import infsus.pinsus.repository.ReviewRepository;
import infsus.pinsus.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ReviewDTO> getAllForInstructor(String name) {
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(name);
        Instructor instructor = user.get().getInstructor();
        List<Review> receivedReviews = instructor.getReceivedReviews();
        for (Review review : receivedReviews) {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setScore(review.getScore());
            reviewDTO.setComment(review.getComment());
            reviewDTO.setReviewer(review.getReviewer().getUser().getUsername());
            reviewDTO.setReviewed(review.getReviewed().getUser().getUsername());
            reviewDTOS.add(reviewDTO);
        }
        return reviewDTOS;
    }

    @Override
    public Review createReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setComment(reviewDTO.getComment());
        review.setScore(reviewDTO.getScore());

        Optional<User> user1 = userRepository.findByUsername(reviewDTO.getReviewer());
        Instructor reviewer = user1.get().getInstructor();
        Optional<User> user2 = userRepository.findByUsername(reviewDTO.getReviewed());
        Instructor reviewed = user2.get().getInstructor();
        if (reviewRepository.existsByReviewerIdAndReviewedId(reviewer.getId(), reviewed.getId())) {
            throw new RuntimeException("Review already exists");
        }

        review.setReviewer(reviewer);
        review.setReviewed(reviewed);
        List<Review> reviews1 = reviewer.getWrittenReviews();
        List<Review> reviews2 = reviewed.getReceivedReviews();
        reviews1.add(review);
        reviews2.add(review);
        instructorRepository.save(reviewer);
        instructorRepository.save(reviewed);

        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(ReviewDTO reviewDTO) {
        Optional<User> user1 = userRepository.findByUsername(reviewDTO.getReviewer());
        Instructor reviewer = user1.get().getInstructor();
        Optional<User> user2 = userRepository.findByUsername(reviewDTO.getReviewed());
        Instructor reviewed = user2.get().getInstructor();
        Review review = reviewRepository
                .findByReviewerIdAndReviewedId(reviewer.getId(), reviewed.getId());
        review.setComment(reviewDTO.getComment());
        review.setScore(reviewDTO.getScore());
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(ReviewDTO2 reviewDTO) {
        Optional<User> user1 = userRepository.findByUsername(reviewDTO.getReviewer());
        Instructor reviewer = user1.get().getInstructor();
        Optional<User> user2 = userRepository.findByUsername(reviewDTO.getReviewed());
        Instructor reviewed = user2.get().getInstructor();
        Review review = reviewRepository
                .findByReviewerIdAndReviewedId(reviewer.getId(), reviewed.getId());
        reviewRepository.delete(review);
    }
}
