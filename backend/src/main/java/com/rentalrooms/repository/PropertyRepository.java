package com.rentalrooms.repository;

import com.rentalrooms.entity.Property;
import com.rentalrooms.enums.AvailabilityStatus;
import com.rentalrooms.enums.ModerationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);
    List<Property> findByOwnerId(Long ownerId);
    long countByOwnerId(Long ownerId);
    long countByAvailabilityStatus(AvailabilityStatus status);
    long countByModerationStatus(ModerationStatus status);
    List<Property> findTop6ByModerationStatusAndAvailabilityStatusOrderByCreatedAtDesc(
            ModerationStatus modStatus, AvailabilityStatus availStatus);
}
