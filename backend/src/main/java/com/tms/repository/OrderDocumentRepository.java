package com.tms.repository;

import com.tms.entity.OrderDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDocumentRepository extends JpaRepository<OrderDocument, Long> {
    List<OrderDocument> findByOrderId(Long orderId);
}
