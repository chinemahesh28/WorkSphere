package com.example.Backend.dto;

import com.example.Backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String role;
    private String fullName;
    private String age;
    private String salary;
    private String phoneNo;
    private String experience;
    private String qualification;
    private String joiningDate;
    private String address;
    private String status;
    private String domain;
    private String specialization;
    private String tools;
    private String certifications;
    private String languages;
    private String counselingMode;
    private String maxClients;

    public static AuthResponse fromUser(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .age(user.getAge())
                .salary(user.getSalary())
                .phoneNo(user.getPhoneNo())
                .experience(user.getExperience())
                .qualification(user.getQualification())
                .joiningDate(user.getJoiningDate())
                .address(user.getAddress())
                .status(user.getStatus())
                .domain(user.getDomain())
                .specialization(user.getSpecialization())
                .tools(user.getTools())
                .certifications(user.getCertifications())
                .languages(user.getLanguages())
                .counselingMode(user.getCounselingMode())
                .maxClients(user.getMaxClients())
                .build();
    }
}
