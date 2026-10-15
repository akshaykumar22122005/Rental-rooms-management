package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.FacilityDto;
import com.rentalrooms.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityDto>>> getAllFacilities() {
        return ResponseEntity.ok(ApiResponse.success(facilityService.getAllFacilities()));
    }
}
