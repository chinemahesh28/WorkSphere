package com.example.Backend.controller;

import com.example.Backend.entity.ClassUpdate;
import com.example.Backend.repository.ClassUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/class-updates")
public class ClassUpdateController {

    @Autowired
    private ClassUpdateRepository classUpdateRepository;

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
        return ResponseEntity.ok(classUpdateRepository.findByAdminId(adminId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        return classUpdateRepository.findById(id)
                .map(update -> {
                    if (!adminId.equals(update.getAdminId())) {
                        return ResponseEntity.status(403).build();
                    }
                    return ResponseEntity.ok(update);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<?> getByTrainer(@PathVariable Long trainerId) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        List<ClassUpdate> updates = classUpdateRepository.findByTrainerId(trainerId);
        List<ClassUpdate> filtered = updates.stream()
                .filter(u -> adminId.equals(u.getAdminId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<?> getByBatch(@PathVariable Long batchId) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        List<ClassUpdate> updates = classUpdateRepository.findByBatchId(batchId);
        List<ClassUpdate> filtered = updates.stream()
                .filter(u -> adminId.equals(u.getAdminId()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ClassUpdate classUpdate) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        classUpdate.setAdminId(adminId);
        classUpdate.setCreatedAt(Instant.now().toString());
        ClassUpdate saved = classUpdateRepository.save(classUpdate);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ClassUpdate details) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        return classUpdateRepository.findById(id)
                .map(update -> {
                    if (!adminId.equals(update.getAdminId())) {
                        return ResponseEntity.status(403).build();
                    }
                    update.setBatchId(details.getBatchId());
                    update.setDate(details.getDate());
                    update.setTopic(details.getTopic());
                    update.setDescription(details.getDescription());
                    update.setStatus(details.getStatus());
                    update.setMaterialTitle(details.getMaterialTitle());
                    update.setFileName(details.getFileName());
                    update.setFileData(details.getFileData());
                    return ResponseEntity.ok(classUpdateRepository.save(update));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        com.example.Backend.entity.User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        Long adminId = user.getAdminId() != null ? user.getAdminId() : user.getId();

        return classUpdateRepository.findById(id)
                .map(update -> {
                    if (!adminId.equals(update.getAdminId())) {
                        return ResponseEntity.status(403).build();
                    }
                    classUpdateRepository.delete(update);
                    return ResponseEntity.ok(Map.of("message", "Class update deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
