-- =============================================================================
-- RENTAL ROOMS MANAGEMENT SYSTEM
-- Database Schema Definition (MySQL 8.0+)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS rental_rooms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rental_rooms_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone_number VARCHAR(25) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. FACILITIES TABLE (Amenities)
CREATE TABLE IF NOT EXISTS facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_name VARCHAR(80) NOT NULL UNIQUE,
    icon VARCHAR(50) NULL,
    INDEX idx_facility_name (facility_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    city VARCHAR(80) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    full_address VARCHAR(255) NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL CHECK (monthly_rent > 0),
    security_deposit DECIMAL(10, 2) NOT NULL CHECK (security_deposit >= 0),
    maintenance_charges DECIMAL(10, 2) NULL DEFAULT 0.00 CHECK (maintenance_charges >= 0),
    electricity_charges VARCHAR(100) NULL,
    room_type VARCHAR(40) NOT NULL,
    furnishing_status VARCHAR(40) NOT NULL,
    available_rooms INT NOT NULL DEFAULT 1 CHECK (available_rooms >= 0),
    gender_preference VARCHAR(30) NOT NULL DEFAULT 'ANY',
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    moderation_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    house_rules TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prop_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_prop_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT,
    INDEX idx_property_city (city),
    INDEX idx_property_locality (locality),
    INDEX idx_property_rent (monthly_rent),
    INDEX idx_property_availability (availability_status),
    INDEX idx_property_moderation (moderation_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_img_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    INDEX idx_img_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PROPERTY FACILITIES JOIN TABLE
CREATE TABLE IF NOT EXISTS property_facilities (
    property_id BIGINT NOT NULL,
    facility_id BIGINT NOT NULL,
    PRIMARY KEY (property_id, facility_id),
    CONSTRAINT fk_pf_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_pf_facility FOREIGN KEY (facility_id) REFERENCES facilities (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. RENTAL REQUESTS TABLE
CREATE TABLE IF NOT EXISTS rental_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    proposed_move_in_date DATE NOT NULL,
    message TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    owner_response TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_req_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_req_tenant FOREIGN KEY (tenant_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_req_property (property_id),
    INDEX idx_req_tenant (tenant_id),
    INDEX idx_req_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_property UNIQUE (tenant_id, property_id),
    CONSTRAINT fk_wish_tenant FOREIGN KEY (tenant_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_wish_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    INDEX idx_wish_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_review_tenant_property UNIQUE (property_id, tenant_id),
    CONSTRAINT fk_rev_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_rev_tenant FOREIGN KEY (tenant_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_rev_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_read (read_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. REPORTS TABLE (Listing Abuse Complaints)
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(120) NOT NULL,
    description TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rep_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_rep_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_rep_property (property_id),
    INDEX idx_rep_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
