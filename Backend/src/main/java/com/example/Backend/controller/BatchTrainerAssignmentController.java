package com.example.Backend.controller;

import com.example.Backend.entity.BatchTrainerAssignment;
import com.example.Backend.repository.BatchTrainerAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batch-trainer-assignments")
public class BatchTrainerAssignmentController {

    @Autowired
    private BatchTrainerAssignmentRepository assignmentRepository;

    @Autowired
    private com.example.Backend.repository.UserRepository userRepository;

    private com.example.Backend.entity.User getCurrentUser() {
        String email = com.example.Backend.security.SecurityUtils.getCurrentUserEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();
        return ResponseEntity.ok(assignmentRepository.findByAdminId(adminId));
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<?> getByBatch(@PathVariable Long batchId) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        List<BatchTrainerAssignment> assignments = assignmentRepository.findByBatchId(batchId);
        // Filter to ensure data belongs to the current admin
        List<BatchTrainerAssignment> filtered = assignments.stream()
                .filter(a -> adminId.equals(a.getAdminId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<?> getByTrainer(@PathVariable Long trainerId) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        List<BatchTrainerAssignment> assignments = assignmentRepository.findByTrainerId(trainerId);
        // Filter to ensure data belongs to the current admin
        List<BatchTrainerAssignment> filtered = assignments.stream()
                .filter(a -> adminId.equals(a.getAdminId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BatchTrainerAssignment assignment) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        if (assignmentRepository.existsByBatchIdAndTrainerId(assignment.getBatchId(), assignment.getTrainerId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "This trainer is already assigned to this batch."));
        }

        assignment.setAdminId(adminId);
        assignment.setAssignedAt(Instant.now().toString());
        BatchTrainerAssignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody BatchTrainerAssignment details) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        return assignmentRepository.findById(id)
                .map(assignment -> {
                    if (!adminId.equals(assignment.getAdminId())) {
                        return ResponseEntity.status(403).build();
                    }
                    assignment.setBatchId(details.getBatchId());
                    assignment.setTrainerId(details.getTrainerId());
                    return ResponseEntity.ok(assignmentRepository.save(assignment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        return assignmentRepository.findById(id)
                .map(assignment -> {
                    if (!adminId.equals(assignment.getAdminId())) {
                        return ResponseEntity.status(403).build();
                    }
                    assignmentRepository.delete(assignment);
                    return ResponseEntity.ok(Map.of("message", "Assignment removed"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
