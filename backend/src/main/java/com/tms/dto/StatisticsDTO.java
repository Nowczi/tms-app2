package com.tms.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private List<DailyStatisticsDTO> dailyStats;
    private long totalOrders;
    private double onTimePercentage;
    private long problemCount;
}
