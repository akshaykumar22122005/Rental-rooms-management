package com.rentalrooms.service;

import com.rentalrooms.dto.AdminDashboardStats;
import com.rentalrooms.enums.*;
import com.rentalrooms.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ReportRepository reportRepository;
    private final ReviewRepository reviewRepository;

    public AdminService(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            RentalRequestRepository rentalRequestRepository,
            ReportRepository reportRepository,
            ReviewRepository reviewRepository
    ) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.reportRepository = reportRepository;
        this.reviewRepository = reviewRepository;
    }

    public AdminDashboardStats getDashboardStats() {
        AdminDashboardStats stats = new AdminDashboardStats();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalTenants(userRepository.countByRole(Role.ROLE_TENANT));
        stats.setTotalOwners(userRepository.countByRole(Role.ROLE_OWNER));

        stats.setTotalProperties(propertyRepository.count());
        stats.setActiveProperties(propertyRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE));
        stats.setPendingModerationProperties(propertyRepository.countByModerationStatus(ModerationStatus.PENDING));

        stats.setTotalRentalRequests(rentalRequestRepository.count());
        stats.setPendingRentalRequests(rentalRequestRepository.countByStatus(RequestStatus.PENDING));
        stats.setAcceptedRentalRequests(rentalRequestRepository.countByStatus(RequestStatus.ACCEPTED));

        stats.setTotalReports(reportRepository.count());
        stats.setPendingReports(reportRepository.countByStatus(ReportStatus.PENDING));

        stats.setTotalReviews(reviewRepository.count());

        return stats;
    }
}
