package com.rentalrooms.repository;

import com.rentalrooms.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    List<Review> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    List<Review> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
    boolean existsByTenantIdAndPropertyId(Long tenantId, Long propertyId);
    long countByPropertyId(Long propertyId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId")
    Double getAverageRatingByPropertyId(@Param("propertyId") Long propertyId);
}
