package com.rentalrooms.controller;

import com.rentalrooms.dto.*;
import com.rentalrooms.entity.User;
import com.rentalrooms.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners/me")
@PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
public class OwnerController {

    private final PropertyService propertyService;
    private final RentalRequestService rentalRequestService;
    private final OwnerService ownerService;
    private final ReviewService reviewService;
    private final AuthService authService;

    public OwnerController(
            PropertyService propertyService,
            RentalRequestService rentalRequestService,
            OwnerService ownerService,
            ReviewService reviewService,
            AuthService authService
    ) {
        this.propertyService = propertyService;
        this.rentalRequestService = rentalRequestService;
        this.ownerService = ownerService;
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getMyProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User user = authService.getCurrentAuthenticatedUser();
        PagedResponse<PropertyResponse> properties = propertyService.getPropertiesByOwner(user.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(properties));
    }

    @GetMapping("/rental-requests")
    public ResponseEntity<ApiResponse<List<RentalRequestDto>>> getMyRentalRequests() {
        User user = authService.getCurrentAuthenticatedUser();
        List<RentalRequestDto> requests = rentalRequestService.getRequestsByOwner(user.getId());
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<OwnerDashboardStats>> getDashboardStats() {
        User user = authService.getCurrentAuthenticatedUser();
        OwnerDashboardStats stats = ownerService.getOwnerDashboardStats(user.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getPropertyReviews() {
        User user = authService.getCurrentAuthenticatedUser();
        List<ReviewResponse> reviews = reviewService.getReviewsByOwner(user.getId());
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}
