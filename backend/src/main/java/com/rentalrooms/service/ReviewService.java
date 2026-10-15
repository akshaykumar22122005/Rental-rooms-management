package com.rentalrooms.service;

import com.rentalrooms.dto.ReviewRequest;
import com.rentalrooms.dto.ReviewResponse;
import com.rentalrooms.entity.Property;
import com.rentalrooms.entity.Review;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.Role;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.exception.UnauthorizedOperationException;
import com.rentalrooms.repository.PropertyRepository;
import com.rentalrooms.repository.ReviewRepository;
import com.rentalrooms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewResponse addReview(Long tenantId, ReviewRequest request) {
        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with ID: " + tenantId));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        if (property.getOwner().getId().equals(tenantId)) {
            throw new BadRequestException("You cannot submit a review for your own property");
        }

        if (reviewRepository.existsByTenantIdAndPropertyId(tenantId, request.getPropertyId())) {
            throw new BadRequestException("You have already reviewed this property");
        }

        Review review = new Review();
        review.setTenant(tenant);
        review.setProperty(property);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    public List<ReviewResponse> getReviewsByProperty(Long propertyId) {
        return reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByTenant(Long tenantId) {
        return reviewRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByOwner(Long ownerId) {
        return reviewRepository.findByPropertyOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteReview(Long reviewId, Long currentUserId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        if (!isAdmin && !review.getTenant().getId().equals(currentUserId)) {
            throw new UnauthorizedOperationException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    public ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProperty().getId(),
                review.getProperty().getTitle(),
                review.getTenant().getId(),
                review.getTenant().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
