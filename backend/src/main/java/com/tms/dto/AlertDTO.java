package com.tms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {
    private Long id;
    private String type;
    private String severity;
    private String title;
    private String message;
    private Long entityId;
    private String entityType;
    private LocalDateTime createdAt;
    private String link;
}
