package com.mansi.wallet_system.controller;

import com.mansi.wallet_system.dto.JwtResponse;
import com.mansi.wallet_system.dto.LoginRequest;
import com.mansi.wallet_system.entity.User;
import com.mansi.wallet_system.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // Since this is a simple prototype, we're generating a dummy token.
                // The SecurityConfig currently permits all requests anyway.
                String dummyToken = "dummy-jwt-token-for-" + user.getId();
                
                return ResponseEntity.ok(new JwtResponse(
                        dummyToken,
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}
