package com.example.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_updates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId;

    @Column(nullable = false)
    private Long trainerId;

    @Column(nullable = false)
    private Long batchId;

    private String date;
    private String topic;

    @Column(length = 2000)
    private String description;

    private String status; // completed, cancelled

    private String materialTitle;
    private String fileName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fileData; // base64 encoded PDF

    private String createdAt;
}
