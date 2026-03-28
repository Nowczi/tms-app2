package com.tms.dto;

import com.tms.entity.Vehicle;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    private String registrationNumber;
    private String brand;
    private String model;
    private Integer yearOfProduction;
    private BigDecimal loadCapacity;
    private LocalDate insuranceExpiry;
    private String insuranceExpiryStatus;
    private LocalDate inspectionExpiry;
    private String inspectionExpiryStatus;
    private Integer currentMileage;
    private String serviceNotes;
    private Vehicle.VehicleStatus status;
    private Long assignedDriverId;
    private String assignedDriverName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Statistics
    private Long totalKm;
    private BigDecimal totalServiceCost;
}
