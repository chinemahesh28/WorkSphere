package com.example.Backend.repository;

import com.example.Backend.entity.ClassUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassUpdateRepository extends JpaRepository<ClassUpdate, Long> {
    List<ClassUpdate> findByTrainerId(Long trainerId);
    List<ClassUpdate> findByBatchId(Long batchId);
    List<ClassUpdate> findByAdminId(Long adminId);
}
