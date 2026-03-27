package com.example.Backend.repository;

import com.example.Backend.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByAdminId(Long adminId);
}
