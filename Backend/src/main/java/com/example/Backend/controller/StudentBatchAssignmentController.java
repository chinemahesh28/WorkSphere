package com.example.Backend.controller;

import com.example.Backend.entity.StudentBatchAssignment;
import com.example.Backend.repository.StudentBatchAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-batch-assignments")
public class StudentBatchAssignmentController {

    @Autowired
    private StudentBatchAssignmentRepository assignmentRepository;

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

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        List<StudentBatchAssignment> assignments = assignmentRepository.findByStudentId(studentId);
        List<StudentBatchAssignment> filtered = assignments.stream()
                .filter(a -> adminId.equals(a.getAdminId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<?> getByBatch(@PathVariable Long batchId) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        List<StudentBatchAssignment> assignments = assignmentRepository.findByBatchId(batchId);
        List<StudentBatchAssignment> filtered = assignments.stream()
                .filter(a -> adminId.equals(a.getAdminId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody StudentBatchAssignment assignment) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        if (assignmentRepository.existsByStudentIdAndBatchId(assignment.getStudentId(), assignment.getBatchId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "This student is already assigned to this batch."));
        }

        assignment.setAdminId(adminId);
        assignment.setAssignedAt(Instant.now().toString());
        StudentBatchAssignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody StudentBatchAssignment details) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        return assignmentRepository.findById(id)
                .map(assignment -> {
                    if (!adminId.equals(assignment.getAdminId())) {
                        return ResponseEntity.status(403).build();
                    }
                    assignment.setStudentId(details.getStudentId());
                    assignment.setBatchId(details.getBatchId());
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
