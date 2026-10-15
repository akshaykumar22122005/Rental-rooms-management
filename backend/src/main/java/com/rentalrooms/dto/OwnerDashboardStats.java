package com.rentalrooms.dto;

public class OwnerDashboardStats {
    private long totalProperties;
    private long availableProperties;
    private long rentedProperties;
    private long totalInquiries;
    private long pendingInquiries;
    private long acceptedInquiries;
    private long rejectedInquiries;
    private long totalReviews;
    private double averageRating;

    public OwnerDashboardStats() {
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getAvailableProperties() {
        return availableProperties;
    }

    public void setAvailableProperties(long availableProperties) {
        this.availableProperties = availableProperties;
    }

    public long getRentedProperties() {
        return rentedProperties;
    }

    public void setRentedProperties(long rentedProperties) {
        this.rentedProperties = rentedProperties;
    }

    public long getTotalInquiries() {
        return totalInquiries;
    }

    public void setTotalInquiries(long totalInquiries) {
        this.totalInquiries = totalInquiries;
    }

    public long getPendingInquiries() {
        return pendingInquiries;
    }

    public void setPendingInquiries(long pendingInquiries) {
        this.pendingInquiries = pendingInquiries;
    }

    public long getAcceptedInquiries() {
        return acceptedInquiries;
    }

    public void setAcceptedInquiries(long acceptedInquiries) {
        this.acceptedInquiries = acceptedInquiries;
    }

    public long getRejectedInquiries() {
        return rejectedInquiries;
    }

    public void setRejectedInquiries(long rejectedInquiries) {
        this.rejectedInquiries = rejectedInquiries;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}
