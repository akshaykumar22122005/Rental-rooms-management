package com.rentalrooms.config;

import com.rentalrooms.entity.*;
import com.rentalrooms.enums.*;
import com.rentalrooms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FacilityRepository facilityRepository;
    private final PropertyRepository propertyRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.name:System Administrator}")
    private String adminName;

    @Value("${app.admin.email:admin@rentalrooms.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@12345}")
    private String adminPassword;

    @Value("${app.admin.phone:+1234567890}")
    private String adminPhone;

    public DataInitializer(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            FacilityRepository facilityRepository,
            PropertyRepository propertyRepository,
            RentalRequestRepository rentalRequestRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.facilityRepository = facilityRepository;
        this.propertyRepository = propertyRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedCategories();
        seedFacilities();
        seedSuperAdmin();
        seedDemoData();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                    new Category("1 RK", "1 Room Kitchen, compact self-contained accommodation", true),
                    new Category("1 BHK", "1 Bedroom, Hall, Kitchen apartment", true),
                    new Category("2 BHK", "2 Bedroom, Hall, Kitchen spacious apartment", true),
                    new Category("Studio Apartment", "Modern open-concept living studio with kitchenette", true),
                    new Category("Single Private Room", "Private bedroom in shared flat with shared amenities", true),
                    new Category("Shared Room", "Twin or triple sharing room for students and professionals", true),
                    new Category("PG / Paying Guest", "Full-service paying guest accommodation with meals", true)
            );
            categoryRepository.saveAll(categories);
            logger.info("Seeded default rental categories");
        }
    }

    private void seedFacilities() {
        if (facilityRepository.count() == 0) {
            List<Facility> facilities = List.of(
                    new Facility("High-Speed Wi-Fi", "wifi"),
                    new Facility("Air Conditioning (AC)", "wind"),
                    new Facility("Attached Bathroom", "bath"),
                    new Facility("Bed & Mattress", "bed"),
                    new Facility("Wardrobe", "door-closed"),
                    new Facility("Refrigerator", "refrigerator"),
                    new Facility("Geyser / Hot Water", "flame"),
                    new Facility("Washing Machine", "washing-machine"),
                    new Facility("Power Backup", "zap"),
                    new Facility("RO Drinking Water", "droplet"),
                    new Facility("Kitchen Access", "utensils"),
                    new Facility("Dedicated Parking", "car"),
                    new Facility("24x7 Security & CCTV", "shield"),
                    new Facility("Lift / Elevator", "arrow-up-circle")
            );
            facilityRepository.saveAll(facilities);
            logger.info("Seeded default facilities");
        }
    }

    private void seedSuperAdmin() {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase().trim())) {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail.toLowerCase().trim());
            admin.setPhoneNumber(adminPhone);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setAccountStatus(AccountStatus.ACTIVE);
            userRepository.save(admin);
            logger.info("Bootstrap Super Admin account created: {}", adminEmail);
        }
    }

    private void seedDemoData() {
        String ownerEmail = "owner@rentalrooms.com";
        String tenantEmail = "tenant@rentalrooms.com";

        User owner = userRepository.findByEmail(ownerEmail).orElse(null);
        if (owner == null) {
            owner = new User("Rajesh Sharma", ownerEmail, "+91 9876543210", passwordEncoder.encode("Owner@12345"), Role.ROLE_OWNER);
            owner = userRepository.save(owner);
            logger.info("Seeded demo Landlord: {}", ownerEmail);
        }

        User tenant = userRepository.findByEmail(tenantEmail).orElse(null);
        if (tenant == null) {
            tenant = new User("Priya Patel", tenantEmail, "+91 9123456789", passwordEncoder.encode("Tenant@12345"), Role.ROLE_TENANT);
            tenant = userRepository.save(tenant);
            logger.info("Seeded demo Tenant: {}", tenantEmail);
        }

        if (propertyRepository.count() == 0) {
            List<Category> cats = categoryRepository.findAll();
            Category studioCat = cats.stream().filter(c -> c.getCategoryName().contains("Studio")).findFirst().orElse(cats.get(0));
            Category oneBhkCat = cats.stream().filter(c -> c.getCategoryName().contains("1 BHK")).findFirst().orElse(cats.get(0));
            Category pgCat = cats.stream().filter(c -> c.getCategoryName().contains("PG")).findFirst().orElse(cats.get(0));

            List<Facility> allFacs = facilityRepository.findAll();
            Set<Facility> basicFacs = new HashSet<>(allFacs.subList(0, Math.min(5, allFacs.size())));
            Set<Facility> premiumFacs = new HashSet<>(allFacs.subList(0, Math.min(10, allFacs.size())));

            // Property 1
            Property p1 = new Property();
            p1.setOwner(owner);
            p1.setCategory(studioCat);
            p1.setTitle("Cozy Furnished Studio Room near Tech Park");
            p1.setDescription("Sunny and peaceful studio apartment located 5 minutes from IT Corridor. Includes dedicated work desk, high-speed fiber internet, private bathroom, and balcony.");
            p1.setCity("Bengaluru");
            p1.setLocality("Koramangala");
            p1.setFullAddress("Plot 42, 5th Block, 80 Feet Road, Koramangala, Bengaluru - 560095");
            p1.setMonthlyRent(new BigDecimal("14500.00"));
            p1.setSecurityDeposit(new BigDecimal("29000.00"));
            p1.setMaintenanceCharges(new BigDecimal("1200.00"));
            p1.setElectricityCharges("As per sub-meter (₹8/unit)");
            p1.setRoomType(RoomType.STUDIO_APARTMENT);
            p1.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            p1.setAvailableRooms(1);
            p1.setGenderPreference(GenderPreference.ANY);
            p1.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            p1.setModerationStatus(ModerationStatus.APPROVED);
            p1.setHouseRules("No smoking indoors. Quiet hours after 10:30 PM. Guests allowed on weekends.");
            p1.setFacilities(premiumFacs);
            p1.addImage(new PropertyImage(p1, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80", 0));
            p1.addImage(new PropertyImage(p1, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80", 1));
            p1.addImage(new PropertyImage(p1, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80", 2));
            propertyRepository.save(p1);

            // Property 2
            Property p2 = new Property();
            p2.setOwner(owner);
            p2.setCategory(oneBhkCat);
            p2.setTitle("Spacious 1 BHK Flat with Modern Kitchen");
            p2.setDescription("Spacious 1 BHK unit in a gated community with 24/7 security, power backup, and lift. Close to metro station, supermarkets, and clinics.");
            p2.setCity("Hyderabad");
            p2.setLocality("Hitec City");
            p2.setFullAddress("Flat 302, Green Meadows, Madhapur, Hitec City, Hyderabad - 500081");
            p2.setMonthlyRent(new BigDecimal("18000.00"));
            p2.setSecurityDeposit(new BigDecimal("36000.00"));
            p2.setMaintenanceCharges(new BigDecimal("1500.00"));
            p2.setElectricityCharges("Included up to 100 units, then ₹7/unit");
            p2.setRoomType(RoomType.ONE_BHK);
            p2.setFurnishingStatus(FurnishingStatus.SEMI_FURNISHED);
            p2.setAvailableRooms(2);
            p2.setGenderPreference(GenderPreference.ANY);
            p2.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            p2.setModerationStatus(ModerationStatus.APPROVED);
            p2.setHouseRules("Pets allowed with prior consent. Maintain cleanliness in common corridors.");
            p2.setFacilities(basicFacs);
            p2.addImage(new PropertyImage(p2, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80", 0));
            p2.addImage(new PropertyImage(p2, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80", 1));
            propertyRepository.save(p2);

            // Property 3
            Property p3 = new Property();
            p3.setOwner(owner);
            p3.setCategory(pgCat);
            p3.setTitle("Premium Executive PG Room with Meals & AC");
            p3.setDescription("Luxury paying guest accommodation for working women and men. Includes 3 daily nutritious meals, daily housekeeping, high-speed Wi-Fi, and laundry.");
            p3.setCity("Pune");
            p3.setLocality("Viman Nagar");
            p3.setFullAddress("Bunglow 14, Lane 3, Viman Nagar, Pune - 411014");
            p3.setMonthlyRent(new BigDecimal("11500.00"));
            p3.setSecurityDeposit(new BigDecimal("15000.00"));
            p3.setMaintenanceCharges(new BigDecimal("0.00"));
            p3.setElectricityCharges("All inclusive in rent");
            p3.setRoomType(RoomType.PG);
            p3.setFurnishingStatus(FurnishingStatus.FULLY_FURNISHED);
            p3.setAvailableRooms(3);
            p3.setGenderPreference(GenderPreference.ANY);
            p3.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            p3.setModerationStatus(ModerationStatus.APPROVED);
            p3.setHouseRules("No alcohol in premises. Gate closes at 11:00 PM.");
            p3.setFacilities(premiumFacs);
            p3.addImage(new PropertyImage(p3, "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80", 0));
            p3.addImage(new PropertyImage(p3, "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80", 1));
            propertyRepository.save(p3);

            // Add demo review
            Review review = new Review(p1, tenant, 5, "Amazing room! The place is spotless, well ventilated, and the owner is very responsive. Highly recommended!");
            reviewRepository.save(review);

            // Add demo inquiry
            RentalRequest request = new RentalRequest(p1, tenant, LocalDate.now().plusDays(7), "Hi Rajesh, I am interested in moving into your Koramangala studio next week. Can we schedule a visit?");
            request.setStatus(RequestStatus.PENDING);
            rentalRequestRepository.save(request);

            logger.info("Demo properties, review, and rental request initialized");
        }
    }
}
