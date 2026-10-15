package com.rentalrooms.controller;

import com.rentalrooms.dto.*;
import com.rentalrooms.enums.*;
import com.rentalrooms.service.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final PropertyService propertyService;
    private final CategoryService categoryService;
    private final FacilityService facilityService;
    private final ReportService reportService;
    private final RentalRequestService rentalRequestService;
    private final ReviewService reviewService;

    public AdminController(
            AdminService adminService,
            UserService userService,
            PropertyService propertyService,
            CategoryService categoryService,
            FacilityService facilityService,
            ReportService reportService,
            RentalRequestService rentalRequestService,
            ReviewService reviewService
    ) {
        this.adminService = adminService;
        this.userService = userService;
        this.propertyService = propertyService;
        this.categoryService = categoryService;
        this.facilityService = facilityService;
        this.reportService = reportService;
        this.rentalRequestService = rentalRequestService;
        this.reviewService = reviewService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(role, pageable)));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody AdminStatusUpdateRequest request
    ) {
        AccountStatus status = AccountStatus.valueOf(request.getStatus().toUpperCase());
        UserResponse response = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("User status updated to " + status, response));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<PropertyResponse> result = propertyService.searchProperties(
                null, null, null, null, null, null, null, null, null, null, null,
                "recently_added", page, size, null
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/properties/{id}/moderation")
    public ResponseEntity<ApiResponse<PropertyResponse>> updatePropertyModeration(
            @PathVariable Long id,
            @RequestBody AdminStatusUpdateRequest request
    ) {
        ModerationStatus status = ModerationStatus.valueOf(request.getStatus().toUpperCase());
        PropertyResponse response = propertyService.updateModerationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Property moderation status updated to " + status, response));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CategoryDto dto) {
        CategoryDto created = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", created));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto dto
    ) {
        CategoryDto updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    @PostMapping("/facilities")
    public ResponseEntity<ApiResponse<FacilityDto>> createFacility(@Valid @RequestBody FacilityDto dto) {
        FacilityDto created = facilityService.createFacility(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Facility created successfully", created));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getAllReports(
            @RequestParam(required = false) ReportStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getAllReports(status)));
    }

    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<ApiResponse<ReportDto>> updateReportStatus(
            @PathVariable Long id,
            @RequestBody AdminStatusUpdateRequest request
    ) {
        ReportStatus status = ReportStatus.valueOf(request.getStatus().toUpperCase());
        ReportDto updated = reportService.updateReportStatus(id, status, request.getAdminNotes());
        return ResponseEntity.ok(ApiResponse.success("Report updated", updated));
    }

    @GetMapping("/rental-requests")
    public ResponseEntity<ApiResponse<List<RentalRequestDto>>> getAllRentalRequests() {
        return ResponseEntity.ok(ApiResponse.success(rentalRequestService.getAllRequests()));
    }

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviews()));
    }
}
