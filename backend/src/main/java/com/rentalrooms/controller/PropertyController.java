package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.PagedResponse;
import com.rentalrooms.dto.PropertyRequest;
import com.rentalrooms.dto.PropertyResponse;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.AvailabilityStatus;
import com.rentalrooms.enums.FurnishingStatus;
import com.rentalrooms.enums.GenderPreference;
import com.rentalrooms.enums.RoomType;
import com.rentalrooms.service.AuthService;
import com.rentalrooms.service.FileStorageService;
import com.rentalrooms.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final AuthService authService;
    private final FileStorageService fileStorageService;

    public PropertyController(
            PropertyService propertyService,
            AuthService authService,
            FileStorageService fileStorageService
    ) {
        this.propertyService = propertyService;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) RoomType roomType,
            @RequestParam(required = false) FurnishingStatus furnishingStatus,
            @RequestParam(required = false) GenderPreference genderPreference,
            @RequestParam(required = false) AvailabilityStatus availabilityStatus,
            @RequestParam(required = false) Set<Long> facilityIds,
            @RequestParam(required = false, defaultValue = "recently_added") String sortBy,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "9") int size
    ) {
        Long currentUserId = null;
        try {
            User user = authService.getCurrentAuthenticatedUser();
            currentUserId = user.getId();
        } catch (Exception ignored) {
            // Unauthenticated public request
        }

        PagedResponse<PropertyResponse> result = propertyService.searchProperties(
                city, locality, query, minRent, maxRent, categoryId, roomType,
                furnishingStatus, genderPreference, availabilityStatus, facilityIds,
                sortBy, page, size, currentUserId
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        Long currentUserId = null;
        try {
            User user = authService.getCurrentAuthenticatedUser();
            currentUserId = user.getId();
        } catch (Exception ignored) {
        }
        PropertyResponse response = propertyService.getPropertyById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getFeaturedProperties() {
        Long currentUserId = null;
        try {
            User user = authService.getCurrentAuthenticatedUser();
            currentUserId = user.getId();
        } catch (Exception ignored) {
        }
        return ResponseEntity.ok(ApiResponse.success(propertyService.getFeaturedProperties(currentUserId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(@Valid @RequestBody PropertyRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        PropertyResponse response = propertyService.createProperty(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Property listing created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request
    ) {
        User user = authService.getCurrentAuthenticatedUser();
        PropertyResponse response = propertyService.updateProperty(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Property listing updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        propertyService.deleteProperty(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Property deleted successfully", null));
    }

    @PostMapping("/upload-images")
    @PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        List<String> urls = fileStorageService.storeFiles(files);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", urls));
    }
}
