package com.rentalrooms;

import com.rentalrooms.dto.AuthResponse;
import com.rentalrooms.dto.LoginRequest;
import com.rentalrooms.dto.RegisterRequest;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.AccountStatus;
import com.rentalrooms.enums.Role;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.repository.UserRepository;
import com.rentalrooms.security.JwtService;
import com.rentalrooms.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Test Tenant", "test@example.com", "1234567890", "encodedPassword", Role.ROLE_TENANT);
        sampleUser.setId(1L);
        sampleUser.setAccountStatus(AccountStatus.ACTIVE);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("Test Tenant", "test@example.com", "1234567890", "password123", Role.ROLE_TENANT);

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken(any(), eq(1L), eq("Test Tenant"), eq("ROLE_TENANT"))).thenReturn("mock.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals(Role.ROLE_TENANT, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest("Test Tenant", "test@example.com", "1234567890", "password123", Role.ROLE_TENANT);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegisterAdminDisallowed() {
        RegisterRequest request = new RegisterRequest("Admin Hacker", "admin@fake.com", "1234567890", "password123", Role.ROLE_ADMIN);
        when(userRepository.existsByEmail("admin@fake.com")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("test@example.com", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(jwtService.generateToken(any(), eq(1L), eq("Test Tenant"), eq("ROLE_TENANT"))).thenReturn("mock.jwt.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("mock.jwt.token", response.getToken());
    }
}
