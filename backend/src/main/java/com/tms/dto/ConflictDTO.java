package com.tms.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConflictDTO {
    private Long id;
    private String type;
    private String severity;
    private String message;
    private Long entityId;
    private String entityType;
}
