package com.example.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId; // ID of the admin who created this user

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Role is required")
    @Column(nullable = false)
    private String role; // ADMIN, TRAINER, ANALYST, COUNSELLOR

    private String fullName;
    // ---- Shared staff fields ----


    @Pattern(regexp = "^$|^(1[89]|[2-5][0-9]|60)$", message = "Age must be between 18 and 60")
    private String age;


    @Pattern(regexp = "^$|^[0-9]+(\\.[0-9]{1,2})?$", message = "Salary must be a valid positive number")
    private String salary;


    @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Phone number must start with 6-9 and contain 10 digits")
    private String phoneNo;

    @Pattern(regexp = "^$|^([0-9]|[1-4][0-9]|50)$", message = "Experience must be between 0 and 50 years")
    private String experience;

    private String qualification;

    private String joiningDate;

    @Size(max = 500, message = "Address must be less than 500 characters")
    @Column(length = 500)
    private String address;

    private String status; // active, inactive, on-leave

    // ---- Trainer-specific ----
    private String domain;

    // ---- Analyst-specific ----
    private String specialization;
    private String tools;

    // ---- Counsellor-specific ----
    private String certifications;
    private String languages;
    private String counselingMode; // online, offline, both
    private String maxClients;

    private String createdAt;
}
