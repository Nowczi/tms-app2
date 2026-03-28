package com.tms.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiDTO {
    private long ordersTodayTotal;
    private long ordersTodayCompleted;
    private long ordersInProgress;
    private long ordersWithProblem;
    private long availableDrivers;
}
