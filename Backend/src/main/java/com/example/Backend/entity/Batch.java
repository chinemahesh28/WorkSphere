package com.example.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId; // ID of the admin who created this batch

    @NotBlank(message = "Batch name is required")
    @Size(min = 2, max = 100, message = "Batch name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String batchName;

    @NotBlank(message = "Batch number is required")
    @Column(nullable = false)
    private String batchNo;

    @NotBlank(message = "Domain is required")
    private String domain;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;

    @NotBlank(message = "Timing is required")
    private String timing;

    private String status; // scheduled, active, completed
    private String createdAt;
}
