package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.ReviewRequest;
import com.rentalrooms.dto.ReviewResponse;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.Role;
import com.rentalrooms.service.AuthService;
import com.rentalrooms.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public ReviewController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(@Valid @RequestBody ReviewRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        ReviewResponse response = reviewService.addReview(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews() {
        User user = authService.getCurrentAuthenticatedUser();
        List<ReviewResponse> reviews = reviewService.getReviewsByTenant(user.getId());
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getPropertyReviews(@PathVariable Long propertyId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProperty(propertyId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        reviewService.deleteReview(id, user.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
