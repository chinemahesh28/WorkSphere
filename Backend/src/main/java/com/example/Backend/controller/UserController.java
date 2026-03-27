package com.example.Backend.controller;

import com.example.Backend.entity.User;
import com.example.Backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        String email = com.example.Backend.security.SecurityUtils.getCurrentUserEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String role) {
        User current = getCurrentUser();
        if (current == null) return List.of();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        if (role != null && !role.isEmpty()) {
            return userRepository.findByRoleAndAdminId(role.toUpperCase(), adminId);
        }
        return userRepository.findByAdminId(adminId);
    }

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        User current = getCurrentUser();
        if (current == null) return List.of();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();
        return userRepository.findByRoleAndAdminId(role.toUpperCase(), adminId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        return userRepository.findById(id)
                .map(user -> {
                    if (user.getAdminId() != null && !user.getAdminId().equals(adminId)) {
                        return ResponseEntity.status(403).<User>build();
                    }
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User with this email already exists!"));
        }

        user.setAdminId(adminId);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(Instant.now().toString());
        if (user.getStatus() == null) user.setStatus("active");

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        return userRepository.findById(id)
                .map(user -> {
                    if (user.getAdminId() != null && !user.getAdminId().equals(adminId)) {
                        return ResponseEntity.status(403).build();
                    }
                    user.setUsername(userDetails.getUsername());
                    user.setEmail(userDetails.getEmail());
                    if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                    }
                    user.setRole(userDetails.getRole());
                    user.setFullName(userDetails.getFullName());
                    user.setAge(userDetails.getAge());
                    user.setSalary(userDetails.getSalary());
                    user.setPhoneNo(userDetails.getPhoneNo());
                    user.setExperience(userDetails.getExperience());
                    user.setQualification(userDetails.getQualification());
                    user.setJoiningDate(userDetails.getJoiningDate());
                    user.setAddress(userDetails.getAddress());
                    user.setStatus(userDetails.getStatus());
                    user.setDomain(userDetails.getDomain());
                    user.setSpecialization(userDetails.getSpecialization());
                    user.setTools(userDetails.getTools());
                    user.setCertifications(userDetails.getCertifications());
                    user.setLanguages(userDetails.getLanguages());
                    user.setCounselingMode(userDetails.getCounselingMode());
                    user.setMaxClients(userDetails.getMaxClients());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        return userRepository.findById(id).map(user -> {
            if (user.getAdminId() != null && !user.getAdminId().equals(adminId)) {
                return ResponseEntity.status(403).build();
            }
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
