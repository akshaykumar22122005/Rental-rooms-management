package com.rentalrooms.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateRentalRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Proposed move-in date is required")
    @FutureOrPresent(message = "Move-in date must be today or in the future")
    private LocalDate proposedMoveInDate;

    private String message;

    public CreateRentalRequest() {
    }

    public CreateRentalRequest(Long propertyId, LocalDate proposedMoveInDate, String message) {
        this.propertyId = propertyId;
        this.proposedMoveInDate = proposedMoveInDate;
        this.message = message;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public LocalDate getProposedMoveInDate() {
        return proposedMoveInDate;
    }

    public void setProposedMoveInDate(LocalDate proposedMoveInDate) {
        this.proposedMoveInDate = proposedMoveInDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
