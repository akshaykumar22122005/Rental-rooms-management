package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.CreateRentalRequest;
import com.rentalrooms.dto.RentalRequestDto;
import com.rentalrooms.dto.UpdateRentalRequestStatus;
import com.rentalrooms.entity.User;
import com.rentalrooms.service.AuthService;
import com.rentalrooms.service.RentalRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental-requests")
public class RentalRequestController {

    private final RentalRequestService rentalRequestService;
    private final AuthService authService;

    public RentalRequestController(RentalRequestService rentalRequestService, AuthService authService) {
        this.rentalRequestService = rentalRequestService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RentalRequestDto>> createRentalRequest(@Valid @RequestBody CreateRentalRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        RentalRequestDto response = rentalRequestService.createRentalRequest(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rental inquiry submitted successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<RentalRequestDto>>> getMyRentalRequests() {
        User user = authService.getCurrentAuthenticatedUser();
        List<RentalRequestDto> requests = rentalRequestService.getRequestsByTenant(user.getId());
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RentalRequestDto>> updateRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRentalRequestStatus request
    ) {
        User user = authService.getCurrentAuthenticatedUser();
        RentalRequestDto response = rentalRequestService.updateRequestStatus(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Rental request status updated to " + request.getStatus(), response));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<RentalRequestDto>> cancelRequest(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        RentalRequestDto response = rentalRequestService.cancelRequest(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Rental request cancelled", response));
    }
}
