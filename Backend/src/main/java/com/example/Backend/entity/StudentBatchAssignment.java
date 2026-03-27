package com.example.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_batch_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentBatchAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private Long batchId;

    private String assignedAt;
}
