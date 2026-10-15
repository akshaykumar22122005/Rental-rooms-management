package com.rentalrooms.service;

import com.rentalrooms.dto.OwnerDashboardStats;
import com.rentalrooms.enums.AvailabilityStatus;
import com.rentalrooms.enums.RequestStatus;
import com.rentalrooms.repository.PropertyRepository;
import com.rentalrooms.repository.RentalRequestRepository;
import com.rentalrooms.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class OwnerService {

    private final PropertyRepository propertyRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ReviewRepository reviewRepository;

    public OwnerService(
            PropertyRepository propertyRepository,
            RentalRequestRepository rentalRequestRepository,
            ReviewRepository reviewRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.reviewRepository = reviewRepository;
    }

    public OwnerDashboardStats getOwnerDashboardStats(Long ownerId) {
        OwnerDashboardStats stats = new OwnerDashboardStats();

        stats.setTotalProperties(propertyRepository.countByOwnerId(ownerId));
        stats.setTotalInquiries(rentalRequestRepository.countByPropertyOwnerId(ownerId));
        stats.setPendingInquiries(rentalRequestRepository.countByPropertyOwnerIdAndStatus(ownerId, RequestStatus.PENDING));
        stats.setAcceptedInquiries(rentalRequestRepository.countByPropertyOwnerIdAndStatus(ownerId, RequestStatus.ACCEPTED));
        stats.setRejectedInquiries(rentalRequestRepository.countByPropertyOwnerIdAndStatus(ownerId, RequestStatus.REJECTED));

        return stats;
    }
}
