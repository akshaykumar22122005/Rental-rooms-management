package com.rentalrooms.dto;

import com.rentalrooms.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateRentalRequestStatus {

    @NotNull(message = "Request status is required")
    private RequestStatus status;

    private String ownerResponse;

    public UpdateRentalRequestStatus() {
    }

    public UpdateRentalRequestStatus(RequestStatus status, String ownerResponse) {
        this.status = status;
        this.ownerResponse = ownerResponse;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getOwnerResponse() {
        return ownerResponse;
    }

    public void setOwnerResponse(String ownerResponse) {
        this.ownerResponse = ownerResponse;
    }
}
