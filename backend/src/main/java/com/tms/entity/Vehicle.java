package com.tms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "registration_number", unique = true, nullable = false, length = 20)
    private String registrationNumber;
    
    @Column(length = 100)
    private String brand;
    
    @Column(length = 100)
    private String model;
    
    @Column(name = "year_of_production")
    private Integer yearOfProduction;
    
    @Column(name = "load_capacity", precision = 10, scale = 2)
    private BigDecimal loadCapacity;
    
    @Column(name = "insurance_expiry")
    private LocalDate insuranceExpiry;
    
    @Column(name = "inspection_expiry")
    private LocalDate inspectionExpiry;
    
    @Column(name = "current_mileage")
    private Integer currentMileage;
    
    @Column(name = "service_notes", columnDefinition = "TEXT")
    private String serviceNotes;
    
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;
    
    @OneToOne
    @JoinColumn(name = "assigned_driver_id")
    private Driver assignedDriver;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum VehicleStatus {
        AVAILABLE, IN_TRANSIT, SERVICE
    }
    
    public String getExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null) return "UNKNOWN";
        LocalDate now = LocalDate.now();
        long daysUntilExpiry = java.time.temporal.ChronoUnit.DAYS.between(now, expiryDate);
        
        if (daysUntilExpiry < 0) return "EXPIRED";
        if (daysUntilExpiry < 14) return "CRITICAL";
        if (daysUntilExpiry < 30) return "WARNING";
        return "OK";
    }
    
    public String getInsuranceExpiryStatus() {
        return getExpiryStatus(insuranceExpiry);
    }
    
    public String getInspectionExpiryStatus() {
        return getExpiryStatus(inspectionExpiry);
    }
}
