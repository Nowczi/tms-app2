package com.tms.dto;

import com.tms.entity.Driver;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phone;
    private String email;
    private Driver.DriverStatus status;
    private LocalDate hireDate;
    private LocalDate contractExpiry;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String licenseExpiryStatus;
    private LocalDate medicalExamExpiry;
    private String medicalExamExpiryStatus;
    private LocalDate vacationStart;
    private LocalDate vacationEnd;
    private Long assignedVehicleId;
    private String assignedVehicleRegistration;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean onVacation;
    private boolean hasVacationInNext7Days;
    private long seniorityDays;
    
    // Statistics
    private Long totalOrders;
    private Long totalKm;
    private Double avgOrdersPerDay;
    private Long problemCount;
}
