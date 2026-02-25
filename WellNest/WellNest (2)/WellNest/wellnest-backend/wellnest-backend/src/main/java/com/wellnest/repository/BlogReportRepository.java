package com.wellnest.repository;

import com.wellnest.entity.BlogReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogReportRepository extends JpaRepository<BlogReport, Long> {
    List<BlogReport> findByResolvedFalse();

    long countByResolvedFalse();
}
