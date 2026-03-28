package com.tms.controller;

import com.tms.dto.OrderDTO;
import com.tms.dto.OrderRequest;
import com.tms.dto.StatusUpdateRequest;
import com.tms.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long driverId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<OrderDTO> orders;
        if (status != null) {
            orders = orderService.findByStatus(status);
        } else if (driverId != null) {
            orders = orderService.findByDriver(driverId);
        } else if (date != null) {
            orders = orderService.findByPlannedDate(date);
        } else {
            orders = orderService.findAll();
        }
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<OrderDTO>> getRecentOrders(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(orderService.findRecentOrders(limit));
    }
    
    @GetMapping("/unassigned")
    public ResponseEntity<List<OrderDTO>> getUnassignedOrders(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(orderService.findUnassignedOrdersForDate(date));
    }
    
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.update(id, request));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }
    
    @PostMapping("/{id}/assign")
    public ResponseEntity<OrderDTO> assignDriver(
            @PathVariable Long id,
            @RequestParam Long driverId,
            @RequestParam(required = false) Long vehicleId) {
        return ResponseEntity.ok(orderService.assignDriver(id, driverId, vehicleId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
