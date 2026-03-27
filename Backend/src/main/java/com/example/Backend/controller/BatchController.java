package com.example.Backend.controller;

import com.example.Backend.entity.Batch;
import com.example.Backend.entity.User;
import com.example.Backend.repository.BatchRepository;
import com.example.Backend.repository.UserRepository;
import com.example.Backend.security.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public List<Batch> getAllBatches() {
        User current = getCurrentUser();
        if (current == null) return List.of();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();
        return batchRepository.findByAdminId(adminId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable Long id) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        return batchRepository.findById(id)
                .map(batch -> {
                    if (batch.getAdminId() != null && !batch.getAdminId().equals(adminId)) {
                        return ResponseEntity.status(403).<Batch>build();
                    }
                    return ResponseEntity.ok(batch);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Batch> createBatch(@Valid @RequestBody Batch batch) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        batch.setAdminId(adminId);
        batch.setCreatedAt(Instant.now().toString());
        if (batch.getStatus() == null) batch.setStatus("scheduled");
        Batch saved = batchRepository.save(batch);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBatch(@PathVariable Long id, @Valid @RequestBody Batch batchDetails) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();
 
        return batchRepository.findById(id)
                .map(batch -> {
                    if (batch.getAdminId() != null && !batch.getAdminId().equals(adminId)) {
                        return ResponseEntity.status(403).build();
                    }
                    batch.setBatchName(batchDetails.getBatchName());
                    batch.setBatchNo(batchDetails.getBatchNo());
                    batch.setDomain(batchDetails.getDomain());
                    batch.setStartDate(batchDetails.getStartDate());
                    batch.setEndDate(batchDetails.getEndDate());
                    batch.setTiming(batchDetails.getTiming());
                    batch.setStatus(batchDetails.getStatus());
                    return ResponseEntity.ok(batchRepository.save(batch));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBatch(@PathVariable Long id) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        return batchRepository.findById(id).map(batch -> {
            if (batch.getAdminId() != null && !batch.getAdminId().equals(adminId)) {
                return ResponseEntity.status(403).build();
            }
            batchRepository.delete(batch);
            return ResponseEntity.ok(Map.of("message", "Batch deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
