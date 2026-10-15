package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.PropertyResponse;
import com.rentalrooms.entity.User;
import com.rentalrooms.service.AuthService;
import com.rentalrooms.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final AuthService authService;

    public WishlistController(WishlistService wishlistService, AuthService authService) {
        this.wishlistService = wishlistService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getMyWishlist() {
        User user = authService.getCurrentAuthenticatedUser();
        List<PropertyResponse> wishlist = wishlistService.getWishlist(user.getId());
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    @PostMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<Void>> addToWishlist(@PathVariable Long propertyId) {
        User user = authService.getCurrentAuthenticatedUser();
        wishlistService.addToWishlist(user.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property added to saved rooms", null));
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable Long propertyId) {
        User user = authService.getCurrentAuthenticatedUser();
        wishlistService.removeFromWishlist(user.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property removed from saved rooms", null));
    }
}
