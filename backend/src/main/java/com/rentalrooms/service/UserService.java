package com.rentalrooms.service;

import com.rentalrooms.dto.ChangePasswordRequest;
import com.rentalrooms.dto.PagedResponse;
import com.rentalrooms.dto.UpdateProfileRequest;
import com.rentalrooms.dto.UserResponse;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.AccountStatus;
import com.rentalrooms.enums.Role;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        User updated = userRepository.save(user);

        return mapToUserResponse(updated);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public PagedResponse<UserResponse> getAllUsers(Role role, Pageable pageable) {
        Page<User> page;
        if (role != null) {
            page = userRepository.findByRole(role, pageable);
        } else {
            page = userRepository.findAll(pageable);
        }

        List<UserResponse> dtos = page.getContent().stream()
                .map(this::mapToUserResponse)
                .toList();

        return new PagedResponse<>(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, AccountStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setAccountStatus(status);
        User updated = userRepository.save(user);
        return mapToUserResponse(updated);
    }

    public UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getAccountStatus(),
                user.getCreatedAt()
        );
    }
}
