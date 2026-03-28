package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class OrderRequest {
    private String orderNumber;
    private String clientReference;
    private String orderNumberInternal;
    
    @NotBlank(message = "Client name is required")
    private String clientName;
    
    private String clientPhone;
    private String pickupAddress;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    private BigDecimal deliveryLatitude;
    private BigDecimal deliveryLongitude;
    private LocalTime deliveryTimeFrom;
    private LocalTime deliveryTimeTo;
    private BigDecimal weight;
    private String notes;
    private Long assignedDriverId;
    private Long assignedVehicleId;
    private LocalDate plannedDate;
    private Integer sequenceNumber;
}
