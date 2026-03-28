package com.tms.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverPlanningDTO {
    private Long driverId;
    private String driverName;
    private String vehicleRegistration;
    private String workingHours;
    private BigDecimal currentWeight;
    private BigDecimal maxWeight;
    private double weightPercentage;
    private boolean locked;
    private String lockReason;
    private List<OrderDTO> orders;
}
