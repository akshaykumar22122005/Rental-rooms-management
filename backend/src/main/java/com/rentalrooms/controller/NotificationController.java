package com.rentalrooms.controller;

import com.rentalrooms.dto.ApiResponse;
import com.rentalrooms.dto.NotificationDto;
import com.rentalrooms.entity.User;
import com.rentalrooms.service.AuthService;
import com.rentalrooms.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNotifications() {
        User user = authService.getCurrentAuthenticatedUser();
        List<NotificationDto> notifications = notificationService.getUserNotifications(user.getId());
        long unreadCount = notificationService.getUnreadCount(user.getId());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("notifications", notifications);
        responseData.put("unreadCount", unreadCount);

        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User user = authService.getCurrentAuthenticatedUser();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
