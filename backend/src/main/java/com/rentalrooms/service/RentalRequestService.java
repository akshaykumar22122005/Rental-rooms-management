package com.rentalrooms.service;

import com.rentalrooms.dto.CreateRentalRequest;
import com.rentalrooms.dto.RentalRequestDto;
import com.rentalrooms.dto.UpdateRentalRequestStatus;
import com.rentalrooms.entity.Notification;
import com.rentalrooms.entity.Property;
import com.rentalrooms.entity.RentalRequest;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.AvailabilityStatus;
import com.rentalrooms.enums.RequestStatus;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.exception.UnauthorizedOperationException;
import com.rentalrooms.repository.NotificationRepository;
import com.rentalrooms.repository.PropertyRepository;
import com.rentalrooms.repository.RentalRequestRepository;
import com.rentalrooms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class RentalRequestService {

    private final RentalRequestRepository rentalRequestRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public RentalRequestService(
            RentalRequestRepository rentalRequestRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.rentalRequestRepository = rentalRequestRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public RentalRequestDto createRentalRequest(Long tenantId, CreateRentalRequest request) {
        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with ID: " + tenantId));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        if (property.getOwner().getId().equals(tenantId)) {
            throw new BadRequestException("You cannot submit a rental request for your own property");
        }

        // Check if tenant already has an active request for this property
        boolean hasActiveRequest = rentalRequestRepository.existsByTenantIdAndPropertyIdAndStatusIn(
                tenantId,
                request.getPropertyId(),
                Set.of(RequestStatus.PENDING, RequestStatus.ACCEPTED)
        );

        if (hasActiveRequest) {
            throw new BadRequestException("You already have an active rental request for this property");
        }

        RentalRequest rentalRequest = new RentalRequest();
        rentalRequest.setProperty(property);
        rentalRequest.setTenant(tenant);
        rentalRequest.setProposedMoveInDate(request.getProposedMoveInDate());
        rentalRequest.setMessage(request.getMessage());
        rentalRequest.setStatus(RequestStatus.PENDING);

        RentalRequest saved = rentalRequestRepository.save(rentalRequest);

        // Notify property owner
        Notification notification = new Notification(
                property.getOwner(),
                "New Rental Inquiry",
                tenant.getFullName() + " submitted a rental request for '" + property.getTitle() + "' for move-in date " + request.getProposedMoveInDate()
        );
        notificationRepository.save(notification);

        return mapToDto(saved);
    }

    public List<RentalRequestDto> getRequestsByTenant(Long tenantId) {
        return rentalRequestRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<RentalRequestDto> getRequestsByOwner(Long ownerId) {
        return rentalRequestRepository.findByPropertyOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<RentalRequestDto> getAllRequests() {
        return rentalRequestRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public RentalRequestDto updateRequestStatus(Long ownerId, Long requestId, UpdateRentalRequestStatus request) {
        RentalRequest rentalRequest = rentalRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental request not found with ID: " + requestId));

        if (!rentalRequest.getProperty().getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedOperationException("You can only respond to rental requests for your own properties");
        }

        if (rentalRequest.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only pending rental requests can be accepted or rejected");
        }

        rentalRequest.setStatus(request.getStatus());
        if (request.getOwnerResponse() != null) {
            rentalRequest.setOwnerResponse(request.getOwnerResponse().trim());
        }

        RentalRequest updated = rentalRequestRepository.save(rentalRequest);

        // Notify tenant
        String statusText = request.getStatus() == RequestStatus.ACCEPTED ? "accepted" : "rejected";
        Notification notification = new Notification(
                rentalRequest.getTenant(),
                "Rental Request " + request.getStatus(),
                "The owner of '" + rentalRequest.getProperty().getTitle() + "' has " + statusText + " your rental request."
                        + (request.getOwnerResponse() != null ? " Note: " + request.getOwnerResponse() : "")
        );
        notificationRepository.save(notification);

        return mapToDto(updated);
    }

    @Transactional
    public RentalRequestDto cancelRequest(Long tenantId, Long requestId) {
        RentalRequest rentalRequest = rentalRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental request not found with ID: " + requestId));

        if (!rentalRequest.getTenant().getId().equals(tenantId)) {
            throw new UnauthorizedOperationException("You can only cancel your own rental requests");
        }

        if (rentalRequest.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be cancelled");
        }

        rentalRequest.setStatus(RequestStatus.CANCELLED);
        RentalRequest updated = rentalRequestRepository.save(rentalRequest);

        // Notify owner
        Notification notification = new Notification(
                rentalRequest.getProperty().getOwner(),
                "Rental Request Cancelled",
                rentalRequest.getTenant().getFullName() + " cancelled their rental request for '" + rentalRequest.getProperty().getTitle() + "'"
        );
        notificationRepository.save(notification);

        return mapToDto(updated);
    }

    private RentalRequestDto mapToDto(RentalRequest req) {
        RentalRequestDto dto = new RentalRequestDto();
        dto.setId(req.getId());
        dto.setPropertyId(req.getProperty().getId());
        dto.setPropertyTitle(req.getProperty().getTitle());
        dto.setPropertyCity(req.getProperty().getCity());
        dto.setPropertyLocality(req.getProperty().getLocality());
        dto.setPropertyRent(req.getProperty().getMonthlyRent());

        if (req.getProperty().getImages() != null && !req.getProperty().getImages().isEmpty()) {
            dto.setPropertyImage(req.getProperty().getImages().get(0).getImageUrl());
        }

        dto.setOwnerId(req.getProperty().getOwner().getId());
        dto.setOwnerName(req.getProperty().getOwner().getFullName());
        dto.setOwnerEmail(req.getProperty().getOwner().getEmail());
        dto.setOwnerPhone(req.getProperty().getOwner().getPhoneNumber());

        dto.setTenantId(req.getTenant().getId());
        dto.setTenantName(req.getTenant().getFullName());
        dto.setTenantEmail(req.getTenant().getEmail());
        dto.setTenantPhone(req.getTenant().getPhoneNumber());

        dto.setProposedMoveInDate(req.getProposedMoveInDate());
        dto.setMessage(req.getMessage());
        dto.setStatus(req.getStatus());
        dto.setOwnerResponse(req.getOwnerResponse());
        dto.setCreatedAt(req.getCreatedAt());
        dto.setUpdatedAt(req.getUpdatedAt());

        return dto;
    }
}
