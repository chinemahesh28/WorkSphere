package com.example.Backend.controller;

import com.example.Backend.dto.*;
import com.example.Backend.entity.User;
import com.example.Backend.repository.UserRepository;
import com.example.Backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists!"));
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : "ADMIN")
                .status("active")
                .createdAt(Instant.now().toString())
                .build();

        user = userRepository.save(user);

        // If it's an admin, set adminId to self
        if ("ADMIN".equals(user.getRole())) {
            user.setAdminId(user.getId());
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(AuthResponse.fromUser(user, token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String identifier = request.getIdentifier().trim();

        // Try finding user by email first, then by username
        User user = userRepository.findByEmail(identifier).orElse(null);
        if (user == null) {
            user = userRepository.findByUsername(identifier).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        if (request.getRole() != null && !user.getRole().equals(request.getRole())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid role for this user"));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(AuthResponse.fromUser(user, token));
    }
}
