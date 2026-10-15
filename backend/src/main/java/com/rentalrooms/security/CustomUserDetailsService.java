package com.rentalrooms.security;

import com.rentalrooms.entity.User;
import com.rentalrooms.enums.AccountStatus;
import com.rentalrooms.repository.UserRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new DisabledException("Your account is currently " + user.getAccountStatus() + ". Please contact administrator.");
        }

        return new CustomUserDetails(user);
    }
}
