package com.rentalrooms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Full name cannot be empty")
    @Size(min = 2, max = 100)
    private String fullName;

    @NotBlank(message = "Phone number cannot be empty")
    @Size(min = 7, max = 20)
    private String phoneNumber;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String phoneNumber) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
