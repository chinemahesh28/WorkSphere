package com.example.Backend.repository;

import com.example.Backend.entity.StudentBatchAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentBatchAssignmentRepository extends JpaRepository<StudentBatchAssignment, Long> {
    List<StudentBatchAssignment> findByStudentId(Long studentId);
    List<StudentBatchAssignment> findByBatchId(Long batchId);
    List<StudentBatchAssignment> findByAdminId(Long adminId);
    boolean existsByStudentIdAndBatchId(Long studentId, Long batchId);
}
