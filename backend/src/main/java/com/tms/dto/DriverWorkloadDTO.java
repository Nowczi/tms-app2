package com.tms.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverWorkloadDTO {
    private Long driverId;
    private String driverName;
    private String vehicleRegistration;
    private String workingHours;
    private long totalOrders;
    private long completedOrders;
    private BigDecimal totalWeight;
    private BigDecimal maxWeight;
    private double weightPercentage;
    private boolean locked;
    private String lockReason;
}
