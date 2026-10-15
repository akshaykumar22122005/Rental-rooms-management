package com.rentalrooms.service;

import com.rentalrooms.dto.FacilityDto;
import com.rentalrooms.dto.PagedResponse;
import com.rentalrooms.dto.PropertyRequest;
import com.rentalrooms.dto.PropertyResponse;
import com.rentalrooms.entity.*;
import com.rentalrooms.enums.*;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.exception.UnauthorizedOperationException;
import com.rentalrooms.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FacilityRepository facilityRepository;
    private final WishlistRepository wishlistRepository;
    private final ReviewRepository reviewRepository;

    public PropertyService(
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            FacilityRepository facilityRepository,
            WishlistRepository wishlistRepository,
            ReviewRepository reviewRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.facilityRepository = facilityRepository;
        this.wishlistRepository = wishlistRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public PropertyResponse createProperty(Long ownerId, PropertyRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with ID: " + ownerId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Property property = new Property();
        property.setOwner(owner);
        property.setCategory(category);
        populatePropertyFields(property, request);

        // Facilities
        if (request.getFacilityIds() != null && !request.getFacilityIds().isEmpty()) {
            List<Facility> facilities = facilityRepository.findAllById(request.getFacilityIds());
            property.setFacilities(new HashSet<>(facilities));
        }

        // Images
        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                if (url != null && !url.trim().isEmpty()) {
                    PropertyImage img = new PropertyImage(property, url.trim(), i);
                    property.addImage(img);
                }
            }
        }

        Property saved = propertyRepository.save(property);
        return mapToResponse(saved, ownerId);
    }

    @Transactional
    public PropertyResponse updateProperty(Long ownerId, Long propertyId, PropertyRequest request) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        User currentUser = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + ownerId));

        if (!property.getOwner().getId().equals(ownerId) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedOperationException("You can only modify properties owned by your account");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        property.setCategory(category);
        populatePropertyFields(property, request);

        // Update facilities
        if (request.getFacilityIds() != null) {
            List<Facility> facilities = facilityRepository.findAllById(request.getFacilityIds());
            property.setFacilities(new HashSet<>(facilities));
        }

        // Update images
        if (request.getImageUrls() != null) {
            property.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                if (url != null && !url.trim().isEmpty()) {
                    PropertyImage img = new PropertyImage(property, url.trim(), i);
                    property.addImage(img);
                }
            }
        }

        Property updated = propertyRepository.save(property);
        return mapToResponse(updated, ownerId);
    }

    @Transactional
    public void deleteProperty(Long ownerId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        User currentUser = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + ownerId));

        if (!property.getOwner().getId().equals(ownerId) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedOperationException("You are not authorized to delete this property");
        }

        propertyRepository.delete(property);
    }

    public PropertyResponse getPropertyById(Long propertyId, Long currentUserId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));
        return mapToResponse(property, currentUserId);
    }

    public PagedResponse<PropertyResponse> searchProperties(
            String city,
            String locality,
            String query,
            BigDecimal minRent,
            BigDecimal maxRent,
            Long categoryId,
            RoomType roomType,
            FurnishingStatus furnishingStatus,
            GenderPreference genderPreference,
            AvailabilityStatus availabilityStatus,
            Set<Long> facilityIds,
            String sortBy,
            int page,
            int size,
            Long currentUserId
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("lowest_rent".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "monthlyRent");
        } else if ("highest_rent".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "monthlyRent");
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Property> spec = (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only show APPROVED properties to public
            predicates.add(cb.equal(root.get("moderationStatus"), ModerationStatus.APPROVED));

            if (availabilityStatus != null) {
                predicates.add(cb.equal(root.get("availabilityStatus"), availabilityStatus));
            } else {
                predicates.add(cb.equal(root.get("availabilityStatus"), AvailabilityStatus.AVAILABLE));
            }

            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.trim().toLowerCase() + "%"));
            }

            if (locality != null && !locality.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("locality")), "%" + locality.trim().toLowerCase() + "%"));
            }

            if (query != null && !query.trim().isEmpty()) {
                String searchPattern = "%" + query.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                Predicate addressMatch = cb.like(cb.lower(root.get("fullAddress")), searchPattern);
                predicates.add(cb.or(titleMatch, descMatch, addressMatch));
            }

            if (minRent != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("monthlyRent"), minRent));
            }

            if (maxRent != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("monthlyRent"), maxRent));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (roomType != null) {
                predicates.add(cb.equal(root.get("roomType"), roomType));
            }

            if (furnishingStatus != null) {
                predicates.add(cb.equal(root.get("furnishingStatus"), furnishingStatus));
            }

            if (genderPreference != null && genderPreference != GenderPreference.ANY) {
                predicates.add(cb.equal(root.get("genderPreference"), genderPreference));
            }

            if (facilityIds != null && !facilityIds.isEmpty()) {
                Join<Property, Facility> facilityJoin = root.join("facilities");
                predicates.add(facilityJoin.get("id").in(facilityIds));
                criteriaQuery.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);

        List<PropertyResponse> responses = propertyPage.getContent().stream()
                .map(p -> mapToResponse(p, currentUserId))
                .toList();

        return new PagedResponse<>(
                responses,
                propertyPage.getNumber(),
                propertyPage.getSize(),
                propertyPage.getTotalElements(),
                propertyPage.getTotalPages(),
                propertyPage.isLast()
        );
    }

    public PagedResponse<PropertyResponse> getPropertiesByOwner(Long ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Property> propertyPage = propertyRepository.findByOwnerId(ownerId, pageable);

        List<PropertyResponse> responses = propertyPage.getContent().stream()
                .map(p -> mapToResponse(p, ownerId))
                .toList();

        return new PagedResponse<>(
                responses,
                propertyPage.getNumber(),
                propertyPage.getSize(),
                propertyPage.getTotalElements(),
                propertyPage.getTotalPages(),
                propertyPage.isLast()
        );
    }

    public List<PropertyResponse> getFeaturedProperties(Long currentUserId) {
        List<Property> featured = propertyRepository.findTop6ByModerationStatusAndAvailabilityStatusOrderByCreatedAtDesc(
                ModerationStatus.APPROVED, AvailabilityStatus.AVAILABLE);

        return featured.stream()
                .map(p -> mapToResponse(p, currentUserId))
                .toList();
    }

    @Transactional
    public PropertyResponse updateModerationStatus(Long propertyId, ModerationStatus status) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        property.setModerationStatus(status);
        Property updated = propertyRepository.save(property);
        return mapToResponse(updated, null);
    }

    private void populatePropertyFields(Property property, PropertyRequest request) {
        property.setTitle(request.getTitle().trim());
        property.setDescription(request.getDescription());
        property.setCity(request.getCity().trim());
        property.setLocality(request.getLocality().trim());
        property.setFullAddress(request.getFullAddress().trim());
        property.setMonthlyRent(request.getMonthlyRent());
        property.setSecurityDeposit(request.getSecurityDeposit());
        property.setMaintenanceCharges(request.getMaintenanceCharges());
        property.setElectricityCharges(request.getElectricityCharges());
        property.setRoomType(request.getRoomType());
        property.setFurnishingStatus(request.getFurnishingStatus());
        property.setAvailableRooms(request.getAvailableRooms() != null ? request.getAvailableRooms() : 1);
        property.setGenderPreference(request.getGenderPreference() != null ? request.getGenderPreference() : GenderPreference.ANY);
        property.setAvailabilityStatus(request.getAvailabilityStatus() != null ? request.getAvailabilityStatus() : AvailabilityStatus.AVAILABLE);
        property.setHouseRules(request.getHouseRules());
    }

    public PropertyResponse mapToResponse(Property property, Long currentUserId) {
        PropertyResponse res = new PropertyResponse();
        res.setId(property.getId());
        res.setOwnerId(property.getOwner().getId());
        res.setOwnerName(property.getOwner().getFullName());
        res.setOwnerEmail(property.getOwner().getEmail());
        res.setOwnerPhone(property.getOwner().getPhoneNumber());

        res.setCategoryId(property.getCategory().getId());
        res.setCategoryName(property.getCategory().getCategoryName());

        res.setTitle(property.getTitle());
        res.setDescription(property.getDescription());
        res.setCity(property.getCity());
        res.setLocality(property.getLocality());
        res.setFullAddress(property.getFullAddress());
        res.setMonthlyRent(property.getMonthlyRent());
        res.setSecurityDeposit(property.getSecurityDeposit());
        res.setMaintenanceCharges(property.getMaintenanceCharges());
        res.setElectricityCharges(property.getElectricityCharges());
        res.setRoomType(property.getRoomType());
        res.setFurnishingStatus(property.getFurnishingStatus());
        res.setAvailableRooms(property.getAvailableRooms());
        res.setGenderPreference(property.getGenderPreference());
        res.setAvailabilityStatus(property.getAvailabilityStatus());
        res.setModerationStatus(property.getModerationStatus());
        res.setHouseRules(property.getHouseRules());
        res.setCreatedAt(property.getCreatedAt());
        res.setUpdatedAt(property.getUpdatedAt());

        // Images
        List<String> imgUrls = property.getImages().stream()
                .map(PropertyImage::getImageUrl)
                .toList();
        res.setImages(imgUrls);

        // Facilities
        List<FacilityDto> facDtos = property.getFacilities().stream()
                .map(f -> new FacilityDto(f.getId(), f.getFacilityName(), f.getIcon()))
                .toList();
        res.setFacilities(facDtos);

        // Review aggregate
        Double avgRating = reviewRepository.getAverageRatingByPropertyId(property.getId());
        res.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        res.setReviewCount(reviewRepository.countByPropertyId(property.getId()));

        // Wishlist status for current user
        if (currentUserId != null) {
            res.setWishlisted(wishlistRepository.existsByTenantIdAndPropertyId(currentUserId, property.getId()));
        }

        return res;
    }
}
