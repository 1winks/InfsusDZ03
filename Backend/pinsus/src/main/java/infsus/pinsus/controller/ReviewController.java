package infsus.pinsus.controller;

import infsus.pinsus.domain.Profile;
import infsus.pinsus.domain.Review;
import infsus.pinsus.dto.*;
import infsus.pinsus.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/resources/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<ReviewDTO> listReviews(@PathVariable String name){
        return reviewService.getAllForInstructor(name);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Review createReview(@RequestBody ReviewDTO reviewDTO) {
        return reviewService.createReview(reviewDTO);
    }

    @PutMapping ("/update")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Review updateReview(@RequestBody ReviewDTO reviewDTO) {
        return reviewService.updateReview(reviewDTO);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public void deleteReview(@RequestBody ReviewDTO2 reviewDTO) {
        reviewService.deleteReview(reviewDTO);
    }
}
