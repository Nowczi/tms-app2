package com.tms.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatisticsDTO {
    private String date;
    private String label;
    private long orders;
    private long km;
    private long problems;
}
