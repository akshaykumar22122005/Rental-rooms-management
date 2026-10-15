package com.rentalrooms.repository;

import com.rentalrooms.entity.RentalRequest;
import com.rentalrooms.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RentalRequestRepository extends JpaRepository<RentalRequest, Long> {
    List<RentalRequest> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    List<RentalRequest> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<RentalRequest> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    boolean existsByTenantIdAndPropertyIdAndStatusIn(Long tenantId, Long propertyId, Collection<RequestStatus> statuses);
    long countByStatus(RequestStatus status);
    long countByPropertyOwnerId(Long ownerId);
    long countByPropertyOwnerIdAndStatus(Long ownerId, RequestStatus status);
}
