# Rental Rooms Management System - REST API Documentation

Base URL: `http://localhost:8080/api`

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phoneNumber": "+91 9876543210",
  "password": "Password@123",
  "role": "ROLE_TENANT"
}
```
*Note: Valid roles are `ROLE_TENANT` and `ROLE_OWNER`. `ROLE_ADMIN` cannot be self-registered.*

- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 6,
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNumber": "+91 9876543210",
    "role": "ROLE_TENANT",
    "accountStatus": "ACTIVE"
  },
  "timestamp": "2026-10-12T22:15:00"
}
```

---

### 1.2 User Login
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "owner@rentalrooms.com",
  "password": "Owner@12345"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 2,
    "fullName": "Rajesh Sharma",
    "email": "owner@rentalrooms.com",
    "phoneNumber": "+91 9876543210",
    "role": "ROLE_OWNER",
    "accountStatus": "ACTIVE"
  },
  "timestamp": "2026-10-12T22:15:00"
}
```

---

### 1.3 Verify Current Session
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Access**: Bearer Token required
- **Header**: `Authorization: Bearer <TOKEN>`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 2,
    "fullName": "Rajesh Sharma",
    "email": "owner@rentalrooms.com",
    "phoneNumber": "+91 9876543210",
    "role": "ROLE_OWNER",
    "accountStatus": "ACTIVE",
    "createdAt": "2026-10-12T21:00:00"
  }
}
```

---

## 2. Properties Endpoints

### 2.1 Search and Filter Properties
- **Method**: `GET`
- **URL**: `/api/properties`
- **Access**: Public
- **Query Parameters**:
  - `city` (string, optional)
  - `locality` (string, optional)
  - `query` (string, optional - searches title, description, address)
  - `minRent` (decimal, optional)
  - `maxRent` (decimal, optional)
  - `categoryId` (long, optional)
  - `roomType` (SINGLE_ROOM, DOUBLE_ROOM, SHARED_ROOM, STUDIO_APARTMENT, ONE_BHK, TWO_BHK, PG)
  - `furnishingStatus` (FULLY_FURNISHED, SEMI_FURNISHED, UNFURNISHED)
  - `genderPreference` (ANY, MALE_ONLY, FEMALE_ONLY, FAMILY_ONLY)
  - `availabilityStatus` (AVAILABLE, RENTED, UNDER_MAINTENANCE)
  - `facilityIds` (comma-separated list of IDs)
  - `sortBy` (`lowest_rent`, `highest_rent`, `recently_added`)
  - `page` (int, default: 0)
  - `size` (int, default: 9)

- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "content": [
      {
        "id": 1,
        "ownerId": 2,
        "ownerName": "Rajesh Sharma",
        "ownerEmail": "owner@rentalrooms.com",
        "ownerPhone": "+91 9876543210",
        "categoryId": 4,
        "categoryName": "Studio Apartment",
        "title": "Cozy Furnished Studio Room near Tech Park",
        "description": "Sunny and peaceful studio apartment...",
        "city": "Bengaluru",
        "locality": "Koramangala",
        "fullAddress": "Plot 42, 5th Block, 80 Feet Road...",
        "monthlyRent": 14500.00,
        "securityDeposit": 29000.00,
        "maintenanceCharges": 1200.00,
        "electricityCharges": "As per sub-meter (₹8/unit)",
        "roomType": "STUDIO_APARTMENT",
        "furnishingStatus": "FULLY_FURNISHED",
        "availableRooms": 1,
        "genderPreference": "ANY",
        "availabilityStatus": "AVAILABLE",
        "moderationStatus": "APPROVED",
        "houseRules": "No smoking indoors...",
        "images": ["https://images.unsplash.com/..."],
        "facilities": [
          {"id": 1, "facilityName": "High-Speed Wi-Fi", "icon": "wifi"}
        ],
        "averageRating": 5.0,
        "reviewCount": 1,
        "wishlisted": false,
        "createdAt": "2026-10-12T21:00:00"
      }
    ],
    "page": 0,
    "size": 9,
    "totalElements": 5,
    "totalPages": 1,
    "last": true
  }
}
```

---

### 2.2 Get Property by ID
- **Method**: `GET`
- **URL**: `/api/properties/{id}`
- **Access**: Public

---

### 2.3 Create Property Listing
- **Method**: `POST`
- **URL**: `/api/properties`
- **Access**: ROLE_OWNER, ROLE_ADMIN
- **Header**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
```json
{
  "title": "Modern 1 BHK Apartment near Cyber City",
  "description": "Fully furnished bedroom with balcony and dedicated parking.",
  "city": "Gurugram",
  "locality": "DLF Phase 2",
  "fullAddress": "House 102, Sector 25, Gurugram, Haryana - 122002",
  "monthlyRent": 22000.00,
  "securityDeposit": 44000.00,
  "maintenanceCharges": 2000.00,
  "electricityCharges": "₹8.5 per unit",
  "roomType": "ONE_BHK",
  "furnishingStatus": "FULLY_FURNISHED",
  "availableRooms": 1,
  "genderPreference": "ANY",
  "availabilityStatus": "AVAILABLE",
  "houseRules": "No loud music after 11 PM.",
  "categoryId": 2,
  "facilityIds": [1, 2, 3, 4, 8, 11, 12],
  "imageUrls": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
  ]
}
```

---

### 2.4 Upload Property Images
- **Method**: `POST`
- **URL**: `/api/properties/upload-images`
- **Access**: ROLE_OWNER, ROLE_ADMIN
- **Content-Type**: `multipart/form-data`
- **Form Key**: `files` (array of image files)

---

## 3. Rental Requests Endpoints

### 3.1 Submit Rental Request
- **Method**: `POST`
- **URL**: `/api/rental-requests`
- **Access**: ROLE_TENANT (or authenticated user)
- **Request Body**:
```json
{
  "propertyId": 1,
  "proposedMoveInDate": "2026-10-20",
  "message": "Hello, I am relocating for work and would like to rent this room."
}
```

### 3.2 View Tenant's Requests
- **Method**: `GET`
- **URL**: `/api/rental-requests/me`
- **Access**: ROLE_TENANT

### 3.3 Landlord Update Request Status
- **Method**: `PATCH`
- **URL**: `/api/rental-requests/{id}/status`
- **Access**: ROLE_OWNER
- **Request Body**:
```json
{
  "status": "ACCEPTED",
  "ownerResponse": "Your request is accepted. Please visit on Sunday to sign the agreement."
}
```

### 3.4 Cancel Rental Request
- **Method**: `PATCH`
- **URL**: `/api/rental-requests/{id}/cancel`
- **Access**: Request creator (Tenant)

---

## 4. Wishlist Endpoints

- `GET /api/wishlist` (List bookmarked properties)
- `POST /api/wishlist/{propertyId}` (Save property)
- `DELETE /api/wishlist/{propertyId}` (Remove property from saved list)

---

## 5. Reviews Endpoints

- `POST /api/reviews`:
```json
{
  "propertyId": 1,
  "rating": 5,
  "comment": "Super clean room with all amenities as advertised."
}
```
- `GET /api/properties/{id}/reviews`: View reviews of a property
- `GET /api/reviews/me`: Tenant's written reviews
- `DELETE /api/reviews/{id}`: Delete a review

---

## 6. Notifications Endpoints

- `GET /api/notifications`: Retrieve current user alerts and `unreadCount`
- `PATCH /api/notifications/{id}/read`: Mark notification as read
- `PATCH /api/notifications/read-all`: Mark all alerts as read

---

## 7. Super Admin Endpoints

- `GET /api/admin/dashboard`: Platform counts (users, properties, inquiries, reports, reviews)
- `GET /api/admin/users`: List users with role filter and pagination
- `PATCH /api/admin/users/{id}/status`: Activate/Deactivate user (`{"status": "SUSPENDED"}`)
- `GET /api/admin/properties`: Moderation listing of all properties
- `PATCH /api/admin/properties/{id}/moderation`: (`{"status": "APPROVED" | "REJECTED" | "SUSPENDED"}`)
- `POST /api/admin/categories`: Create new rental category
- `PUT /api/admin/categories/{id}`: Edit category
- `DELETE /api/admin/categories/{id}`: Delete category
- `GET /api/admin/reports`: View complaint reports
- `PATCH /api/admin/reports/{id}/status`: Resolve/Dismiss report (`{"status": "RESOLVED", "adminNotes": "Owner verified."}`)
