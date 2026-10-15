# Rental Rooms Management System - Database Design Documentation

## 1. Overview
The **Rental Rooms Management System** relational database is engineered on **MySQL 8.0+**, utilizing InnoDB engine for ACID compliance, referential integrity with foreign key cascades, and B-tree indexes for low-latency queries on searches, filters, and relationships.

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PROPERTIES : "owns"
    USERS ||--o{ RENTAL_REQUESTS : "submits"
    USERS ||--o{ WISHLISTS : "saves"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ REPORTS : "files"
    
    CATEGORIES ||--o{ PROPERTIES : "classifies"
    
    PROPERTIES ||--o{ PROPERTY_IMAGES : "has"
    PROPERTIES ||--o{ PROPERTY_FACILITIES : "contains"
    FACILITIES ||--o{ PROPERTY_FACILITIES : "tagged_in"
    
    PROPERTIES ||--o{ RENTAL_REQUESTS : "receives"
    PROPERTIES ||--o{ WISHLISTS : "bookmarked_in"
    PROPERTIES ||--o{ REVIEWS : "evaluated_by"
    PROPERTIES ||--o{ REPORTS : "flagged_in"

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar phone_number
        varchar password
        varchar role
        varchar account_status
        datetime created_at
        datetime updated_at
    }

    CATEGORIES {
        bigint id PK
        varchar category_name UK
        varchar description
        boolean active
    }

    FACILITIES {
        bigint id PK
        varchar facility_name UK
        varchar icon
    }

    PROPERTIES {
        bigint id PK
        bigint owner_id FK
        bigint category_id FK
        varchar title
        text description
        varchar city
        varchar locality
        varchar full_address
        decimal monthly_rent
        decimal security_deposit
        decimal maintenance_charges
        varchar electricity_charges
        varchar room_type
        varchar furnishing_status
        int available_rooms
        varchar gender_preference
        varchar availability_status
        varchar moderation_status
        text house_rules
        datetime created_at
        datetime updated_at
    }

    PROPERTY_IMAGES {
        bigint id PK
        bigint property_id FK
        varchar image_url
        int display_order
    }

    PROPERTY_FACILITIES {
        bigint property_id PK,FK
        bigint facility_id PK,FK
    }

    RENTAL_REQUESTS {
        bigint id PK
        bigint property_id FK
        bigint tenant_id FK
        date proposed_move_in_date
        text message
        varchar status
        text owner_response
        datetime created_at
        datetime updated_at
    }

    WISHLISTS {
        bigint id PK
        bigint tenant_id FK
        bigint property_id FK
        datetime created_at
    }

    REVIEWS {
        bigint id PK
        bigint property_id FK
        bigint tenant_id FK
        int rating
        text comment
        datetime created_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar title
        text message
        boolean read_status
        datetime created_at
    }

    REPORTS {
        bigint id PK
        bigint property_id FK
        bigint reporter_id FK
        varchar reason
        text description
        varchar status
        text admin_notes
        datetime created_at
    }
```

---

## 3. Detailed Table Specifications

### 3.1. `users`
- **Purpose**: Stores authentication credentials, contact details, account states, and security roles.
- **Constraints**:
  - `email`: UNIQUE constraint, non-null, lowercased.
  - `role`: Enum constraint (`ROLE_TENANT`, `ROLE_OWNER`, `ROLE_ADMIN`).
  - `account_status`: Enum constraint (`ACTIVE`, `INACTIVE`, `SUSPENDED`).
- **Indexes**: `idx_user_email` (B-tree), `idx_user_role` (B-tree).

### 3.2. `categories`
- **Purpose**: Classifies room configurations (`1 RK`, `1 BHK`, `2 BHK`, `Studio Apartment`, `Single Private Room`, `Shared Room`, `PG / Paying Guest`).
- **Constraints**:
  - `category_name`: UNIQUE constraint, non-null.

### 3.3. `facilities`
- **Purpose**: Amenity catalog (`High-Speed Wi-Fi`, `Air Conditioning`, `Attached Bathroom`, `Power Backup`, `Washing Machine`, `Kitchen Access`, etc.).
- **Constraints**:
  - `facility_name`: UNIQUE constraint.

### 3.4. `properties`
- **Purpose**: Core entity for rental room listings posted by landlords.
- **Constraints**:
  - `monthly_rent`: `CHECK (monthly_rent > 0)`.
  - `security_deposit`: `CHECK (security_deposit >= 0)`.
  - `available_rooms`: `CHECK (available_rooms >= 0)`.
  - Foreign key `owner_id` references `users(id)` ON DELETE CASCADE.
  - Foreign key `category_id` references `categories(id)` ON DELETE RESTRICT.
- **Indexes**:
  - `idx_property_city`, `idx_property_locality` for search queries.
  - `idx_property_rent` for price range filtering and sorting.
  - `idx_property_availability`, `idx_property_moderation` for active listing filters.

### 3.5. `property_images`
- **Purpose**: Multiple high-resolution images per room listing.
- **Constraints**:
  - Foreign key `property_id` references `properties(id)` ON DELETE CASCADE.

### 3.6. `property_facilities`
- **Purpose**: Many-to-many junction between properties and amenities.
- **Primary Key**: Composite `(property_id, facility_id)`.

### 3.7. `rental_requests`
- **Purpose**: Booking inquiries and tenancy negotiations.
- **Workflow States**: `PENDING` -> `ACCEPTED` / `REJECTED` / `CANCELLED` / `COMPLETED`.
- **Integrity Rule**: A tenant cannot create duplicate active requests on the same property.

### 3.8. `wishlists`
- **Purpose**: Bookmarked rooms for tenant dashboard.
- **Constraint**: `UNIQUE (tenant_id, property_id)` prevents duplicate bookmarks.

### 3.9. `reviews`
- **Purpose**: Verified tenant ratings and feedback.
- **Constraints**:
  - `rating`: `CHECK (rating BETWEEN 1 AND 5)`.
  - `UNIQUE (property_id, tenant_id)` enforces one review per tenant per property.

### 3.10. `notifications`
- **Purpose**: Real-time in-app alerts for status updates, new inquiries, and admin notices.

### 3.11. `reports`
- **Purpose**: Tenant complaints regarding suspicious, misleading, or inappropriate listings.
- **States**: `PENDING`, `INVESTIGATING`, `RESOLVED`, `DISMISSED`.
