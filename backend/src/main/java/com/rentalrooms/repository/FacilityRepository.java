package com.rentalrooms.repository;

import com.rentalrooms.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    Optional<Facility> findByFacilityNameIgnoreCase(String facilityName);
    boolean existsByFacilityNameIgnoreCase(String facilityName);
    List<Facility> findAllByOrderByFacilityNameAsc();
}
