package com.rentalrooms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReportRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Reason is required")
    @Size(min = 3, max = 120)
    private String reason;

    @Size(max = 1000)
    private String description;

    public ReportRequest() {
    }

    public ReportRequest(Long propertyId, String reason, String description) {
        this.propertyId = propertyId;
        this.reason = reason;
        this.description = description;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
