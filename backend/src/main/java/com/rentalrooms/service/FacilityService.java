package com.rentalrooms.service;

import com.rentalrooms.dto.FacilityDto;
import com.rentalrooms.entity.Facility;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<FacilityDto> getAllFacilities() {
        return facilityRepository.findAllByOrderByFacilityNameAsc().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public FacilityDto createFacility(FacilityDto dto) {
        if (facilityRepository.existsByFacilityNameIgnoreCase(dto.getFacilityName().trim())) {
            throw new BadRequestException("Facility '" + dto.getFacilityName() + "' already exists");
        }
        Facility facility = new Facility(dto.getFacilityName().trim(), dto.getIcon());
        Facility saved = facilityRepository.save(facility);
        return mapToDto(saved);
    }

    public FacilityDto mapToDto(Facility facility) {
        return new FacilityDto(facility.getId(), facility.getFacilityName(), facility.getIcon());
    }
}
