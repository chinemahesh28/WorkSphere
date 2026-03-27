package com.example.Backend.controller;

import com.example.Backend.entity.Student;
import com.example.Backend.entity.User;
import com.example.Backend.repository.StudentRepository;
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
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        User current = getCurrentUser();
        if (current == null) return List.of();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();
        return studentRepository.findByAdminId(adminId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();

        return studentRepository.findById(id)
                .map(student -> {
                    if (student.getAdminId() != null && !student.getAdminId().equals(current.getId())) {
                        return ResponseEntity.status(403).<Student>build();
                    }
                    return ResponseEntity.ok(student);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody Student student) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        if (studentRepository.existsByEmail(student.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "A student with this email already exists."));
        }

        student.setAdminId(adminId);
        student.setCreatedAt(Instant.now().toString());
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student studentDetails) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();
 
        return studentRepository.findById(id)
                .map(student -> {
                    if (student.getAdminId() != null && !student.getAdminId().equals(adminId)) {
                        return ResponseEntity.status(403).build();
                    }
                    student.setFullName(studentDetails.getFullName());
                    student.setEmail(studentDetails.getEmail());
                    student.setPhone(studentDetails.getPhone());
                    student.setQualification(studentDetails.getQualification());
                    student.setDomainInterest(studentDetails.getDomainInterest());
                    return ResponseEntity.ok(studentRepository.save(student));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        User current = getCurrentUser();
        if (current == null) return ResponseEntity.status(401).build();
        Long adminId = current.getAdminId() != null ? current.getAdminId() : current.getId();

        return studentRepository.findById(id).map(student -> {
            if (student.getAdminId() != null && !student.getAdminId().equals(adminId)) {
                return ResponseEntity.status(403).build();
            }
            studentRepository.delete(student);
            return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
