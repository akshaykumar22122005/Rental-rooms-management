package com.rentalrooms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "facilities", indexes = {
    @Index(name = "idx_facility_name", columnList = "facility_name")
})
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_name", nullable = false, unique = true, length = 80)
    private String facilityName;

    @Column(name = "icon", length = 50)
    private String icon;

    public Facility() {
    }

    public Facility(String facilityName, String icon) {
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
