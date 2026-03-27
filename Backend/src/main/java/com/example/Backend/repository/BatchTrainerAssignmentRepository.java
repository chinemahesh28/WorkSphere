package com.example.Backend.repository;

import com.example.Backend.entity.BatchTrainerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchTrainerAssignmentRepository extends JpaRepository<BatchTrainerAssignment, Long> {
    List<BatchTrainerAssignment> findByBatchId(Long batchId);
    List<BatchTrainerAssignment> findByTrainerId(Long trainerId);
    List<BatchTrainerAssignment> findByAdminId(Long adminId);
    boolean existsByBatchIdAndTrainerId(Long batchId, Long trainerId);
}
