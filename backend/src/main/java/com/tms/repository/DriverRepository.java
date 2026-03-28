package com.tms.repository;

import com.tms.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByUserId(Long userId);
    
    List<Driver> findByStatus(Driver.DriverStatus status);
    
    @Query("SELECT d FROM Driver d WHERE d.status = 'ACTIVE' AND d.id NOT IN " +
           "(SELECT o.assignedDriver.id FROM Order o WHERE o.plannedDate = :date " +
           "AND o.status IN ('PLANNED', 'IN_PROGRESS'))")
    List<Driver> findAvailableDriversForDate(@Param("date") LocalDate date);
    
    @Query("SELECT d FROM Driver d WHERE d.licenseExpiry <= :date OR " +
           "d.medicalExamExpiry <= :date OR d.contractExpiry <= :date")
    List<Driver> findDriversWithExpiringDocuments(@Param("date") LocalDate date);
    
    @Query("SELECT d FROM Driver d WHERE d.vacationStart <= :date AND d.vacationEnd >= :date")
    List<Driver> findDriversOnVacation(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.assignedDriver.id = :driverId")
    Long countOrdersByDriverId(@Param("driverId") Long driverId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.assignedDriver.id = :driverId AND o.status = 'PROBLEM'")
    Long countProblemOrdersByDriverId(@Param("driverId") Long driverId);
    
    boolean existsByAssignedVehicleId(Long vehicleId);
}
