package com.tms.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GpsLocationDTO {
    private Long id;
    private Long driverId;
    private String driverName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDateTime recordedAt;
}
