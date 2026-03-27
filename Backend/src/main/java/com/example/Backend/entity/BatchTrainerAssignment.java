package com.example.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batch_trainer_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchTrainerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId;

    @Column(nullable = false)
    private Long batchId;

    @Column(nullable = false)
    private Long trainerId;

    private String assignedAt;
}
