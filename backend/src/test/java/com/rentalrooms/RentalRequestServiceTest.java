package com.rentalrooms;

import com.rentalrooms.dto.CreateRentalRequest;
import com.rentalrooms.dto.RentalRequestDto;
import com.rentalrooms.entity.Notification;
import com.rentalrooms.entity.Property;
import com.rentalrooms.entity.RentalRequest;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.Role;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.repository.NotificationRepository;
import com.rentalrooms.repository.PropertyRepository;
import com.rentalrooms.repository.RentalRequestRepository;
import com.rentalrooms.repository.UserRepository;
import com.rentalrooms.service.RentalRequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalRequestServiceTest {

    @Mock
    private RentalRequestRepository rentalRequestRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private RentalRequestService rentalRequestService;

    private User owner;
    private User tenant;
    private Property property;

    @BeforeEach
    void setUp() {
        owner = new User("Owner Name", "owner@example.com", "9999999999", "pass", Role.ROLE_OWNER);
        owner.setId(10L);

        tenant = new User("Tenant Name", "tenant@example.com", "8888888888", "pass", Role.ROLE_TENANT);
        tenant.setId(20L);

        property = new Property();
        property.setId(100L);
        property.setTitle("Test Room");
        property.setCity("Pune");
        property.setLocality("Kothrud");
        property.setMonthlyRent(new BigDecimal("10000.00"));
        property.setOwner(owner);
    }

    @Test
    void testCreateRentalRequestSuccess() {
        CreateRentalRequest req = new CreateRentalRequest(100L, LocalDate.now().plusDays(5), "Interested in renting");

        when(userRepository.findById(20L)).thenReturn(Optional.of(tenant));
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));
        when(rentalRequestRepository.existsByTenantIdAndPropertyIdAndStatusIn(eq(20L), eq(100L), any())).thenReturn(false);

        RentalRequest savedReq = new RentalRequest(property, tenant, req.getProposedMoveInDate(), req.getMessage());
        savedReq.setId(500L);
        when(rentalRequestRepository.save(any(RentalRequest.class))).thenReturn(savedReq);

        RentalRequestDto result = rentalRequestService.createRentalRequest(20L, req);

        assertNotNull(result);
        assertEquals(500L, result.getId());
        assertEquals("Test Room", result.getPropertyTitle());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testOwnerCannotBookOwnRoom() {
        CreateRentalRequest req = new CreateRentalRequest(100L, LocalDate.now().plusDays(5), "Self booking");

        when(userRepository.findById(10L)).thenReturn(Optional.of(owner));
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));

        assertThrows(BadRequestException.class, () -> rentalRequestService.createRentalRequest(10L, req));
    }

    @Test
    void testDuplicateActiveRequestThrowsException() {
        CreateRentalRequest req = new CreateRentalRequest(100L, LocalDate.now().plusDays(5), "Duplicate request");

        when(userRepository.findById(20L)).thenReturn(Optional.of(tenant));
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));
        when(rentalRequestRepository.existsByTenantIdAndPropertyIdAndStatusIn(eq(20L), eq(100L), any())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> rentalRequestService.createRentalRequest(20L, req));
    }
}
