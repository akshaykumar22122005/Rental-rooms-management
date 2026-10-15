package com.rentalrooms.dto;

public class AdminStatusUpdateRequest {
    private String status;
    private String adminNotes;

    public AdminStatusUpdateRequest() {
    }

    public AdminStatusUpdateRequest(String status, String adminNotes) {
        this.status = status;
        this.adminNotes = adminNotes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
