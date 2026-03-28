package com.tms.repository;

import com.tms.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    
    List<Vehicle> findByStatus(Vehicle.VehicleStatus status);
    
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'AVAILABLE'")
    List<Vehicle> findAvailableVehicles();
    
    @Query("SELECT v FROM Vehicle v WHERE v.insuranceExpiry <= :date OR v.inspectionExpiry <= :date")
    List<Vehicle> findVehiclesWithExpiringDocuments(@Param("date") LocalDate date);
    
    boolean existsByRegistrationNumber(String registrationNumber);
    
    boolean existsByAssignedDriverId(Long driverId);
}
