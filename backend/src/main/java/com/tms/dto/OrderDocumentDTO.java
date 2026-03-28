package com.tms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDocumentDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
}
