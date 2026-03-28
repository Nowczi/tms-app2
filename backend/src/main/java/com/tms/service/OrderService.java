package com.tms.service;

import com.tms.dto.*;
import com.tms.entity.Driver;
import com.tms.entity.Order;
import com.tms.entity.OrderHistory;
import com.tms.entity.Vehicle;
import com.tms.repository.DriverRepository;
import com.tms.repository.OrderHistoryRepository;
import com.tms.repository.OrderRepository;
import com.tms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    
    private static final DateTimeFormatter ORDER_NUMBER_FORMATTER = DateTimeFormatter.ofPattern("yyyy");
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findAll() {
        return orderRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public OrderDTO findById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return toDTO(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findByStatus(String status) {
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status);
        return orderRepository.findByStatus(orderStatus).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findByDriver(Long driverId) {
        return orderRepository.findByAssignedDriverId(driverId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findByPlannedDate(LocalDate date) {
        return orderRepository.findByPlannedDateOrderBySequence(date).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findRecentOrders(int limit) {
        return orderRepository.findRecentOrders(PageRequest.of(0, limit)).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findUnassignedOrdersForDate(LocalDate date) {
        return orderRepository.findUnassignedOrdersForDate(date).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public OrderDTO create(OrderRequest request) {
        Order order = new Order();
        
        // Generate order number if not provided
        if (request.getOrderNumber() == null || request.getOrderNumber().isEmpty()) {
            order.setOrderNumber(generateOrderNumber());
        } else {
            order.setOrderNumber(request.getOrderNumber());
        }
        
        updateOrderFromRequest(order, request);
        
        Order saved = orderRepository.save(order);
        
        // Add history entry
        OrderHistory history = OrderHistory.builder()
            .order(saved)
            .status(saved.getStatus().name())
            .notes("Zlecenie utworzone")
            .createdBy("system")
            .build();
        orderHistoryRepository.save(history);
        
        return toDTO(saved);
    }
    
    @Transactional
    public OrderDTO update(Long id, OrderRequest request) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        Order.OrderStatus oldStatus = order.getStatus();
        updateOrderFromRequest(order, request);
        Order saved = orderRepository.save(order);
        
        // Add history entry if status changed
        if (oldStatus != saved.getStatus()) {
            OrderHistory history = OrderHistory.builder()
                .order(saved)
                .status(saved.getStatus().name())
                .notes("Status zmieniony z " + oldStatus + " na " + saved.getStatus())
                .createdBy("system")
                .build();
            orderHistoryRepository.save(history);
        }
        
        return toDTO(saved);
    }
    
    @Transactional
    public OrderDTO updateStatus(Long id, StatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        Order.OrderStatus oldStatus = order.getStatus();
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(request.getStatus());
        
        order.setStatus(newStatus);
        if (request.getPodPhotoUrl() != null) {
            order.setPodPhotoUrl(request.getPodPhotoUrl());
        }
        
        Order saved = orderRepository.save(order);
        
        // Add history entry
        OrderHistory history = OrderHistory.builder()
            .order(saved)
            .status(newStatus.name())
            .notes(request.getNotes() != null ? request.getNotes() : "Status zmieniony z " + oldStatus + " na " + newStatus)
            .createdBy("system")
            .build();
        orderHistoryRepository.save(history);
        
        return toDTO(saved);
    }
    
    @Transactional
    public OrderDTO assignDriver(Long orderId, Long driverId, Long vehicleId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));
        
        order.setAssignedDriver(driver);
        
        if (vehicleId != null) {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));
            order.setAssignedVehicle(vehicle);
        }
        
        if (order.getStatus() == Order.OrderStatus.NEW) {
            order.setStatus(Order.OrderStatus.PLANNED);
        }
        
        Order saved = orderRepository.save(order);
        
        // Add history entry
        OrderHistory history = OrderHistory.builder()
            .order(saved)
            .status(saved.getStatus().name())
            .notes("Przypisano kierowcę: " + driver.getFullName())
            .createdBy("system")
            .build();
        orderHistoryRepository.save(history);
        
        return toDTO(saved);
    }
    
    @Transactional
    public void delete(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderDTO> findStaleOrders() {
        LocalDateTime twoHoursAgo = LocalDateTime.now().minusHours(2);
        return orderRepository.findStaleOrders(twoHoursAgo).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    private String generateOrderNumber() {
        String year = LocalDate.now().format(ORDER_NUMBER_FORMATTER);
        long count = orderRepository.count() + 1;
        return String.format("ZL-%s-%04d", year, count);
    }
    
    private void updateOrderFromRequest(Order order, OrderRequest request) {
        order.setClientReference(request.getClientReference());
        order.setOrderNumberInternal(request.getOrderNumberInternal());
        order.setClientName(request.getClientName());
        order.setClientPhone(request.getClientPhone());
        order.setPickupAddress(request.getPickupAddress());
        order.setPickupLatitude(request.getPickupLatitude());
        order.setPickupLongitude(request.getPickupLongitude());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryLatitude(request.getDeliveryLatitude());
        order.setDeliveryLongitude(request.getDeliveryLongitude());
        order.setDeliveryTimeFrom(request.getDeliveryTimeFrom());
        order.setDeliveryTimeTo(request.getDeliveryTimeTo());
        order.setWeight(request.getWeight());
        order.setNotes(request.getNotes());
        order.setPlannedDate(request.getPlannedDate());
        order.setSequenceNumber(request.getSequenceNumber());
        
        if (request.getAssignedDriverId() != null) {
            Driver driver = driverRepository.findById(request.getAssignedDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            order.setAssignedDriver(driver);
        }
        
        if (request.getAssignedVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getAssignedVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            order.setAssignedVehicle(vehicle);
        }
    }
    
    private OrderDTO toDTO(Order order) {
        OrderDTO dto = OrderDTO.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .clientReference(order.getClientReference())
            .orderNumberInternal(order.getOrderNumberInternal())
            .clientName(order.getClientName())
            .clientPhone(order.getClientPhone())
            .pickupAddress(order.getPickupAddress())
            .pickupLatitude(order.getPickupLatitude())
            .pickupLongitude(order.getPickupLongitude())
            .deliveryAddress(order.getDeliveryAddress())
            .deliveryLatitude(order.getDeliveryLatitude())
            .deliveryLongitude(order.getDeliveryLongitude())
            .deliveryTimeFrom(order.getDeliveryTimeFrom())
            .deliveryTimeTo(order.getDeliveryTimeTo())
            .weight(order.getWeight())
            .notes(order.getNotes())
            .status(order.getStatus())
            .statusColor(order.getStatusColor())
            .plannedDate(order.getPlannedDate())
            .sequenceNumber(order.getSequenceNumber())
            .podPhotoUrl(order.getPodPhotoUrl())
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .overdue(order.isOverdue())
            .build();
        
        if (order.getAssignedDriver() != null) {
            dto.setAssignedDriverId(order.getAssignedDriver().getId());
            dto.setAssignedDriverName(order.getAssignedDriver().getFullName());
        }
        
        if (order.getAssignedVehicle() != null) {
            dto.setAssignedVehicleId(order.getAssignedVehicle().getId());
            dto.setAssignedVehicleRegistration(order.getAssignedVehicle().getRegistrationNumber());
        }
        
        // Map history
        if (order.getHistory() != null) {
            dto.setHistory(order.getHistory().stream()
                .map(h -> OrderHistoryDTO.builder()
                    .id(h.getId())
                    .status(h.getStatus())
                    .notes(h.getNotes())
                    .createdBy(h.getCreatedBy())
                    .createdAt(h.getCreatedAt())
                    .build())
                .collect(Collectors.toList()));
        }
        
        // Map documents
        if (order.getDocuments() != null) {
            dto.setDocuments(order.getDocuments().stream()
                .map(d -> OrderDocumentDTO.builder()
                    .id(d.getId())
                    .fileName(d.getFileName())
                    .fileUrl(d.getFileUrl())
                    .fileType(d.getFileType())
                    .uploadedBy(d.getUploadedBy())
                    .uploadedAt(d.getUploadedAt())
                    .build())
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
