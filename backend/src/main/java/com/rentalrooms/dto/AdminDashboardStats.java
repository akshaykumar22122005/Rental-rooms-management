package com.rentalrooms.dto;

public class AdminDashboardStats {
    private long totalUsers;
    private long totalTenants;
    private long totalOwners;
    private long totalProperties;
    private long activeProperties;
    private long pendingModerationProperties;
    private long totalRentalRequests;
    private long pendingRentalRequests;
    private long acceptedRentalRequests;
    private long totalReports;
    private long pendingReports;
    private long totalReviews;

    public AdminDashboardStats() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalTenants() {
        return totalTenants;
    }

    public void setTotalTenants(long totalTenants) {
        this.totalTenants = totalTenants;
    }

    public long getTotalOwners() {
        return totalOwners;
    }

    public void setTotalOwners(long totalOwners) {
        this.totalOwners = totalOwners;
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getActiveProperties() {
        return activeProperties;
    }

    public void setActiveProperties(long activeProperties) {
        this.activeProperties = activeProperties;
    }

    public long getPendingModerationProperties() {
        return pendingModerationProperties;
    }

    public void setPendingModerationProperties(long pendingModerationProperties) {
        this.pendingModerationProperties = pendingModerationProperties;
    }

    public long getTotalRentalRequests() {
        return totalRentalRequests;
    }

    public void setTotalRentalRequests(long totalRentalRequests) {
        this.totalRentalRequests = totalRentalRequests;
    }

    public long getPendingRentalRequests() {
        return pendingRentalRequests;
    }

    public void setPendingRentalRequests(long pendingRentalRequests) {
        this.pendingRentalRequests = pendingRentalRequests;
    }

    public long getAcceptedRentalRequests() {
        return acceptedRentalRequests;
    }

    public void setAcceptedRentalRequests(long acceptedRentalRequests) {
        this.acceptedRentalRequests = acceptedRentalRequests;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }
}
