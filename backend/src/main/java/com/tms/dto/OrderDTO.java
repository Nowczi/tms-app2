package com.tms.dto;

import com.tms.entity.Order;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String clientReference;
    private String orderNumberInternal;
    private String clientName;
    private String clientPhone;
    private String pickupAddress;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private String deliveryAddress;
    private BigDecimal deliveryLatitude;
    private BigDecimal deliveryLongitude;
    private LocalTime deliveryTimeFrom;
    private LocalTime deliveryTimeTo;
    private BigDecimal weight;
    private String notes;
    private Order.OrderStatus status;
    private String statusColor;
    private Long assignedDriverId;
    private String assignedDriverName;
    private Long assignedVehicleId;
    private String assignedVehicleRegistration;
    private LocalDate plannedDate;
    private Integer sequenceNumber;
    private String podPhotoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderHistoryDTO> history;
    private List<OrderDocumentDTO> documents;
    private boolean overdue;
}
