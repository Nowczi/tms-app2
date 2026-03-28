package com.tms.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanningDTO {
    private List<DriverPlanningDTO> drivers;
    private List<OrderDTO> unassignedOrders;
    private List<GpsLocationDTO> driverLocations;
    private List<ConflictDTO> conflicts;
}
