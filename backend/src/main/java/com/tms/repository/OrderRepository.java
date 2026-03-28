package com.tms.repository;

import com.tms.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByAssignedDriverId(Long driverId);
    
    List<Order> findByPlannedDate(LocalDate plannedDate);
    
    List<Order> findByAssignedDriverIdAndPlannedDate(Long driverId, LocalDate plannedDate);
    
    @Query("SELECT o FROM Order o WHERE o.plannedDate = :date ORDER BY o.sequenceNumber")
    List<Order> findByPlannedDateOrderBySequence(@Param("date") LocalDate date);
    
    @Query("SELECT o FROM Order o WHERE o.assignedDriver.id = :driverId AND o.plannedDate = :date ORDER BY o.sequenceNumber")
    List<Order> findByDriverAndDateOrderBySequence(@Param("driverId") Long driverId, @Param("date") LocalDate date);
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('NEW', 'PLANNED', 'IN_PROGRESS', 'PROBLEM') AND o.updatedAt < :time")
    List<Order> findStaleOrders(@Param("time") LocalDateTime time);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'NEW' AND o.plannedDate = :date")
    List<Order> findUnassignedOrdersForDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.plannedDate = :date")
    long countByPlannedDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.plannedDate = :date AND o.status = 'DELIVERED'")
    long countCompletedByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.plannedDate = :date AND o.status = 'IN_PROGRESS'")
    long countInProgressByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.plannedDate = :date AND o.status = 'PROBLEM'")
    long countProblemsByDate(@Param("date") LocalDate date);
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.assignedDriver.id = :driverId AND o.plannedDate BETWEEN :startDate AND :endDate")
    long countByDriverAndDateRange(@Param("driverId") Long driverId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(o.weight) FROM Order o WHERE o.assignedDriver.id = :driverId AND o.plannedDate = :date")
    java.math.BigDecimal sumWeightByDriverAndDate(@Param("driverId") Long driverId, @Param("date") LocalDate date);
}
