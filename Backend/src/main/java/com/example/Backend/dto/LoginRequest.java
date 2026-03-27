package com.example.Backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username or Email is required")
    private String identifier; // Can be email or username

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Please select a role")
    private String role;
}
