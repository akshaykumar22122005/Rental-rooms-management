package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.ReportDto;
import com.rentalrooms.dto.ReportRequest;
import com.rentalrooms.entity.User;
import com.rentalrooms.service.AuthService;
import com.rentalrooms.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;

    public ReportController(ReportService reportService, AuthService authService) {
        this.reportService = reportService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReportDto>> reportProperty(@Valid @RequestBody ReportRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        ReportDto response = reportService.reportProperty(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Property reported successfully. Our moderation team will investigate.", response));
    }
}
