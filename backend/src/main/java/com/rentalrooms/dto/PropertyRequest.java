package com.rentalrooms.dto;

import com.rentalrooms.enums.AvailabilityStatus;
import com.rentalrooms.enums.FurnishingStatus;
import com.rentalrooms.enums.GenderPreference;
import com.rentalrooms.enums.RoomType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PropertyRequest {

    @NotBlank(message = "Property title is required")
    @Size(min = 5, max = 150)
    private String title;

    private String description;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotBlank(message = "Full address is required")
    private String fullAddress;

    @NotNull(message = "Monthly rent is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly rent must be greater than zero")
    private BigDecimal monthlyRent;

    @NotNull(message = "Security deposit is required")
    @DecimalMin(value = "0.0", message = "Security deposit cannot be negative")
    private BigDecimal securityDeposit;

    @DecimalMin(value = "0.0", message = "Maintenance charges cannot be negative")
    private BigDecimal maintenanceCharges;

    private String electricityCharges;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @NotNull(message = "Furnishing status is required")
    private FurnishingStatus furnishingStatus;

    @Min(value = 1, message = "At least one room must be available")
    private Integer availableRooms = 1;

    private GenderPreference genderPreference = GenderPreference.ANY;

    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    private String houseRules;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Set<Long> facilityIds = new HashSet<>();

    private List<String> imageUrls = new ArrayList<>();

    public PropertyRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public BigDecimal getMaintenanceCharges() {
        return maintenanceCharges;
    }

    public void setMaintenanceCharges(BigDecimal maintenanceCharges) {
        this.maintenanceCharges = maintenanceCharges;
    }

    public String getElectricityCharges() {
        return electricityCharges;
    }

    public void setElectricityCharges(String electricityCharges) {
        this.electricityCharges = electricityCharges;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public FurnishingStatus getFurnishingStatus() {
        return furnishingStatus;
    }

    public void setFurnishingStatus(FurnishingStatus furnishingStatus) {
        this.furnishingStatus = furnishingStatus;
    }

    public Integer getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(Integer availableRooms) {
        this.availableRooms = availableRooms;
    }

    public GenderPreference getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(GenderPreference genderPreference) {
        this.genderPreference = genderPreference;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public String getHouseRules() {
        return houseRules;
    }

    public void setHouseRules(String houseRules) {
        this.houseRules = houseRules;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Set<Long> getFacilityIds() {
        return facilityIds;
    }

    public void setFacilityIds(Set<Long> facilityIds) {
        this.facilityIds = facilityIds;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
