package com.example.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId; // ID of the admin who created this student

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Phone number must start with 6-9 and contain 10 digits")
    private String phone;

    private String qualification;
    private String domainInterest;
    private String createdAt;
}
