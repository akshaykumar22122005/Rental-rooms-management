-- =============================================================================
-- RENTAL ROOMS MANAGEMENT SYSTEM
-- Sample Data Script (MySQL 8.0+)
-- BCrypt password for all sample accounts is: Password@123
-- (Hash: $2a$10$e8w.b0n4Z0JmJzXf3s64eOG8z5W2G3rJqWk8fT9jL8aU2jY1qCqSu)
-- =============================================================================

USE rental_rooms_db;

-- Insert Users (Super Admin, Landlords, Tenants)
INSERT INTO users (id, full_name, email, phone_number, password, role, account_status, created_at)
VALUES
(1, 'System Administrator', 'admin@rentalrooms.com', '+1234567890', '$2a$10$e8w.b0n4Z0JmJzXf3s64eOG8z5W2G3rJqWk8fT9jL8aU2jY1qCqSu', 'ROLE_ADMIN', 'ACTIVE', NOW()),
(2, 'Rajesh Sharma', 'owner@rentalrooms.com', '+91 9876543210', '$2a$10$e8w.b0n4Z0JmJzXf3s64eOG8z5W2G3rJqWk8fT9jL8aU2jY1qCqSu', 'ROLE_OWNER', 'ACTIVE', NOW()),
(3, 'Priya Patel', 'tenant@rentalrooms.com', '+91 9123456789', '$2a$10$e8w.b0n4Z0JmJzXf3s64eOG8z5W2G3rJqWk8fT9jL8aU2jY1qCqSu', 'ROLE_TENANT', 'ACTIVE', NOW()),
(4, 'Vikram Malhotra', 'vikram.owner@example.com', '+91 9811223344', '$2a$10$e8w.b0n4Z0JmJzXf3s64eOG8z5W2G3rJqWk8fT9jL8aU2jY1qCqSu', 'ROLE_OWNER', 'ACTIVE', NOW()),
(5, 'Ananya Sen', 'ananya.seeker@example.com', '+91 9744556677', '$2a$10$e8w.b0n4Z0JmJzXf3s64eOG8z5W2G3rJqWk8fT9jL8aU2jY1qCqSu', 'ROLE_TENANT', 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE email=email;

-- Insert Categories
INSERT INTO categories (id, category_name, description, active)
VALUES
(1, '1 RK', '1 Room Kitchen, compact self-contained accommodation', TRUE),
(2, '1 BHK', '1 Bedroom, Hall, Kitchen apartment', TRUE),
(3, '2 BHK', '2 Bedroom, Hall, Kitchen spacious apartment', TRUE),
(4, 'Studio Apartment', 'Modern open-concept living studio with kitchenette', TRUE),
(5, 'Single Private Room', 'Private bedroom in shared flat with shared amenities', TRUE),
(6, 'Shared Room', 'Twin or triple sharing room for students and professionals', TRUE),
(7, 'PG / Paying Guest', 'Full-service paying guest accommodation with meals', TRUE)
ON DUPLICATE KEY UPDATE category_name=category_name;

-- Insert Facilities
INSERT INTO facilities (id, facility_name, icon)
VALUES
(1, 'High-Speed Wi-Fi', 'wifi'),
(2, 'Air Conditioning (AC)', 'wind'),
(3, 'Attached Bathroom', 'bath'),
(4, 'Bed & Mattress', 'bed'),
(5, 'Wardrobe', 'door-closed'),
(6, 'Refrigerator', 'refrigerator'),
(7, 'Geyser / Hot Water', 'flame'),
(8, 'Washing Machine', 'washing-machine'),
(9, 'Power Backup', 'zap'),
(10, 'RO Drinking Water', 'droplet'),
(11, 'Kitchen Access', 'utensils'),
(12, 'Dedicated Parking', 'car'),
(13, '24x7 Security & CCTV', 'shield'),
(14, 'Lift / Elevator', 'arrow-up-circle')
ON DUPLICATE KEY UPDATE facility_name=facility_name;

-- Insert Properties
INSERT INTO properties (id, owner_id, category_id, title, description, city, locality, full_address, monthly_rent, security_deposit, maintenance_charges, electricity_charges, roomType, furnishing_status, available_rooms, gender_preference, availability_status, moderation_status, house_rules, created_at)
VALUES
(1, 2, 4, 'Cozy Furnished Studio Room near Tech Park', 'Sunny and peaceful studio apartment located 5 minutes from IT Corridor. Includes dedicated work desk, high-speed fiber internet, private bathroom, and balcony.', 'Bengaluru', 'Koramangala', 'Plot 42, 5th Block, 80 Feet Road, Koramangala, Bengaluru - 560095', 14500.00, 29000.00, 1200.00, 'As per sub-meter (₹8/unit)', 'STUDIO_APARTMENT', 'FULLY_FURNISHED', 1, 'ANY', 'AVAILABLE', 'APPROVED', 'No smoking indoors. Quiet hours after 10:30 PM. Guests allowed on weekends.', NOW()),
(2, 2, 2, 'Spacious 1 BHK Flat with Modern Kitchen', 'Spacious 1 BHK unit in a gated community with 24/7 security, power backup, and lift. Close to metro station, supermarkets, and clinics.', 'Hyderabad', 'Hitec City', 'Flat 302, Green Meadows, Madhapur, Hitec City, Hyderabad - 500081', 18000.00, 36000.00, 1500.00, 'Included up to 100 units, then ₹7/unit', 'ONE_BHK', 'SEMI_FURNISHED', 2, 'ANY', 'AVAILABLE', 'APPROVED', 'Pets allowed with prior consent. Maintain cleanliness in common corridors.', NOW()),
(3, 4, 7, 'Premium Executive PG Room with Meals & AC', 'Luxury paying guest accommodation for working women and men. Includes 3 daily nutritious meals, daily housekeeping, high-speed Wi-Fi, and laundry.', 'Pune', 'Viman Nagar', 'Bunglow 14, Lane 3, Viman Nagar, Pune - 411014', 11500.00, 15000.00, 0.00, 'All inclusive in rent', 'PG', 'FULLY_FURNISHED', 3, 'ANY', 'AVAILABLE', 'APPROVED', 'No alcohol in premises. Gate closes at 11:00 PM.', NOW()),
(4, 4, 3, 'Luxury 2 BHK Apartment with Scenic Balcony', 'Beautifully designed 2 BHK apartment on the 8th floor with panoramic city views. Fully modular kitchen, Italian tiles, premium bathroom fittings.', 'Mumbai', 'Andheri West', 'Tower B, Ocean Heights, Link Road, Andheri West, Mumbai - 400053', 38000.00, 75000.00, 2500.00, 'Direct government meter billing', 'TWO_BHK', 'FULLY_FURNISHED', 1, 'FAMILY_ONLY', 'AVAILABLE', 'APPROVED', 'Families preferred. No loud parties on weekdays.', NOW()),
(5, 2, 5, 'Single Private Room for Students & Interns', 'Well-lit private bedroom with study table, bookshelf, and high-speed Wi-Fi. Quiet residential neighborhood close to colleges and libraries.', 'Delhi', 'North Campus', 'House 58, Chhatra Marg, Near University Gate, Delhi - 110007', 8500.00, 12000.00, 500.00, 'Shared equally among flatmates', 'SINGLE_ROOM', 'FULLY_FURNISHED', 2, 'STUDENTS_ONLY', 'AVAILABLE', 'APPROVED', 'Quiet study hours 9 PM - 7 AM.', NOW())
ON DUPLICATE KEY UPDATE title=title;

-- Insert Property Images
INSERT INTO property_images (property_id, image_url, display_order)
VALUES
(1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80', 0),
(1, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80', 1),
(1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80', 2),
(2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80', 0),
(2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80', 1),
(3, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80', 0),
(3, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80', 1),
(4, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80', 0),
(4, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', 1),
(5, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80', 0);

-- Insert Property Facilities
INSERT INTO property_facilities (property_id, facility_id)
VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(2, 1), (2, 3), (2, 4), (2, 7), (2, 9), (2, 11), (2, 12), (2, 13),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 8), (3, 10), (3, 13),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 12), (4, 13), (4, 14),
(5, 1), (5, 3), (5, 4), (5, 5), (5, 7), (5, 10);

-- Insert Sample Reviews
INSERT INTO reviews (property_id, tenant_id, rating, comment, created_at)
VALUES
(1, 3, 5, 'Amazing place to stay! High speed internet was super stable for remote work and the owner Rajesh was very polite and helpful.', NOW()),
(2, 5, 4, 'Very spacious apartment in a safe gated society. Metro station is walking distance. Highly recommended.', NOW());

-- Insert Sample Rental Request
INSERT INTO rental_requests (property_id, tenant_id, proposed_move_in_date, message, status, created_at)
VALUES
(1, 3, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 'Hi Rajesh, I am interested in visiting the studio room this Saturday. Looking to move in next week.', 'PENDING', NOW());
