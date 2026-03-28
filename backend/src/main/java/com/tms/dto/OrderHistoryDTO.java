package com.tms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistoryDTO {
    private Long id;
    private String status;
    private String notes;
    private String createdBy;
    private LocalDateTime createdAt;
}
