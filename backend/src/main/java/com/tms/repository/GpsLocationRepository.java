package com.tms.repository;

import com.tms.entity.GpsLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GpsLocationRepository extends JpaRepository<GpsLocation, Long> {
    
    List<GpsLocation> findByDriverId(Long driverId);
    
    @Query("SELECT g FROM GpsLocation g WHERE g.driver.id = :driverId ORDER BY g.recordedAt DESC")
    Optional<GpsLocation> findLatestByDriverId(@Param("driverId") Long driverId);
    
    @Query("SELECT g FROM GpsLocation g WHERE g.recordedAt > :since ORDER BY g.recordedAt DESC")
    List<GpsLocation> findRecentLocations(@Param("since") LocalDateTime since);
    
    @Query("SELECT g FROM GpsLocation g WHERE g.driver.id IN :driverIds AND g.recordedAt > :since")
    List<GpsLocation> findRecentLocationsForDrivers(@Param("driverIds") List<Long> driverIds, @Param("since") LocalDateTime since);
}
