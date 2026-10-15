package com.rentalrooms.service;

import com.rentalrooms.dto.NotificationDto;
import com.rentalrooms.entity.Notification;
import com.rentalrooms.entity.User;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.exception.UnauthorizedOperationException;
import com.rentalrooms.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadStatusFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedOperationException("Cannot update another user's notification");
        }

        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notif) {
        return new NotificationDto(
                notif.getId(),
                notif.getTitle(),
                notif.getMessage(),
                notif.isReadStatus(),
                notif.getCreatedAt()
        );
    }
}
