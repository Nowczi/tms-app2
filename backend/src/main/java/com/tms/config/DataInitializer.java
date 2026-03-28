package com.tms.config;

import com.tms.entity.User;
import com.tms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Create default users if they don't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin"))
                .email("admin@tms.pl")
                .firstName("Admin")
                .lastName("System")
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByUsername("dispatcher")) {
            User dispatcher = User.builder()
                .username("dispatcher")
                .password(passwordEncoder.encode("dispatcher"))
                .email("dispatcher@tms.pl")
                .firstName("Jan")
                .lastName("Kowalski")
                .role(User.Role.DISPATCHER)
                .isActive(true)
                .build();
            userRepository.save(dispatcher);
        }
    }
}
