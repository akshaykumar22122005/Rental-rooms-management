package com.rentalrooms.repository;

import com.rentalrooms.entity.User;
import com.rentalrooms.enums.AccountStatus;
import com.rentalrooms.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    long countByAccountStatus(AccountStatus status);
    Page<User> findByRole(Role role, Pageable pageable);
}
