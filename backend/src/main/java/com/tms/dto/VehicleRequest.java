package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VehicleRequest {
    @NotBlank(message = "Registration number is required")
    private String registrationNumber;
    
    private String brand;
    private String model;
    private Integer yearOfProduction;
    private BigDecimal loadCapacity;
    private LocalDate insuranceExpiry;
    private LocalDate inspectionExpiry;
    private Integer currentMileage;
    private String serviceNotes;
    private String status;
    private Long assignedDriverId;
}
