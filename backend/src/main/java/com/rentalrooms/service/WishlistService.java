package com.rentalrooms.service;

import com.rentalrooms.dto.PropertyResponse;
import com.rentalrooms.entity.Property;
import com.rentalrooms.entity.User;
import com.rentalrooms.entity.Wishlist;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.repository.PropertyRepository;
import com.rentalrooms.repository.UserRepository;
import com.rentalrooms.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyService propertyService;

    public WishlistService(
            WishlistRepository wishlistRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            PropertyService propertyService
    ) {
        this.wishlistRepository = wishlistRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyService = propertyService;
    }

    public List<PropertyResponse> getWishlist(Long tenantId) {
        return wishlistRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(w -> propertyService.mapToResponse(w.getProperty(), tenantId))
                .toList();
    }

    @Transactional
    public void addToWishlist(Long tenantId, Long propertyId) {
        if (wishlistRepository.existsByTenantIdAndPropertyId(tenantId, propertyId)) {
            return; // already saved
        }

        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with ID: " + tenantId));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        Wishlist wishlist = new Wishlist(tenant, property);
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long tenantId, Long propertyId) {
        wishlistRepository.deleteByTenantIdAndPropertyId(tenantId, propertyId);
    }
}
