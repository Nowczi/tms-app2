package com.tms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false, length = 50)
    private String orderNumber;
    
    @Column(name = "client_reference", length = 100)
    private String clientReference;
    
    @Column(name = "order_number_internal", length = 100)
    private String orderNumberInternal;
    
    @Column(name = "client_name", nullable = false, length = 200)
    private String clientName;
    
    @Column(name = "client_phone", length = 20)
    private String clientPhone;
    
    @Column(name = "pickup_address", columnDefinition = "TEXT")
    private String pickupAddress;
    
    @Column(name = "pickup_latitude", precision = 10, scale = 8)
    private BigDecimal pickupLatitude;
    
    @Column(name = "pickup_longitude", precision = 11, scale = 8)
    private BigDecimal pickupLongitude;
    
    @Column(name = "delivery_address", nullable = false, columnDefinition = "TEXT")
    private String deliveryAddress;
    
    @Column(name = "delivery_latitude", precision = 10, scale = 8)
    private BigDecimal deliveryLatitude;
    
    @Column(name = "delivery_longitude", precision = 11, scale = 8)
    private BigDecimal deliveryLongitude;
    
    @Column(name = "delivery_time_from")
    private LocalTime deliveryTimeFrom;
    
    @Column(name = "delivery_time_to")
    private LocalTime deliveryTimeTo;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal weight;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.NEW;
    
    @ManyToOne
    @JoinColumn(name = "assigned_driver_id")
    private Driver assignedDriver;
    
    @ManyToOne
    @JoinColumn(name = "assigned_vehicle_id")
    private Vehicle assignedVehicle;
    
    @Column(name = "planned_date")
    private LocalDate plannedDate;
    
    @Column(name = "sequence_number")
    private Integer sequenceNumber;
    
    @Column(name = "pod_photo_url", length = 500)
    private String podPhotoUrl;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderHistory> history = new ArrayList<>();
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderDocument> documents = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        NEW, PLANNED, IN_PROGRESS, DELIVERED, PROBLEM, CANCELLED
    }
    
    public void addHistory(OrderHistory historyEntry) {
        history.add(historyEntry);
        historyEntry.setOrder(this);
    }
    
    public void addDocument(OrderDocument document) {
        documents.add(document);
        document.setOrder(this);
    }
    
    public boolean isOverdue() {
        if (status == OrderStatus.DELIVERED || status == OrderStatus.CANCELLED) {
            return false;
        }
        if (updatedAt == null) return false;
        long hoursSinceUpdate = ChronoUnit.HOURS.between(updatedAt, LocalDateTime.now());
        return hoursSinceUpdate >= 2;
    }
    
    public boolean isUnassigned() {
        return assignedDriver == null;
    }
    
    public String getStatusColor() {
        return switch (status) {
            case NEW -> "gray";
            case PLANNED -> "blue";
            case IN_PROGRESS -> "yellow";
            case DELIVERED -> "green";
            case PROBLEM -> "red";
            case CANCELLED -> "gray";
        };
    }
}
