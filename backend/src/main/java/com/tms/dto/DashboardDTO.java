package com.tms.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private KpiDTO kpi;
    private List<AlertDTO> alerts;
    private List<DriverWorkloadDTO> driverWorkloads;
    private List<OrderDTO> recentOrders;
    private StatisticsDTO statistics;
}
