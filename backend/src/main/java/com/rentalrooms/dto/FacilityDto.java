package com.rentalrooms.dto;

public class FacilityDto {
    private Long id;
    private String facilityName;
    private String icon;

    public FacilityDto() {
    }

    public FacilityDto(Long id, String facilityName, String icon) {
        this.id = id;
        this.facilityName = facilityName;
        this.icon = icon;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
