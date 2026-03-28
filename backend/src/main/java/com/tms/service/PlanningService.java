package com.tms.service;

import com.tms.dto.*;
import com.tms.entity.Driver;
import com.tms.entity.GpsLocation;
import com.tms.entity.Order;
import com.tms.entity.Vehicle;
import com.tms.repository.DriverRepository;
import com.tms.repository.GpsLocationRepository;
import com.tms.repository.OrderRepository;
import com.tms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanningService {
    
    private final OrderRepository orderRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final GpsLocationRepository gpsLocationRepository;
    
    @Transactional(readOnly = true)
    public PlanningDTO getPlanningData(LocalDate date) {
        return PlanningDTO.builder()
            .drivers(getDriverPlannings(date))
            .unassignedOrders(getUnassignedOrders(date))
            .driverLocations(getDriverLocations())
            .conflicts(getConflicts(date))
            .build();
    }
    
    private List<DriverPlanningDTO> getDriverPlannings(LocalDate date) {
        List<Driver> activeDrivers = driverRepository.findByStatus(Driver.DriverStatus.ACTIVE);
        
        return activeDrivers.stream()
            .filter(d -> !d.isOnVacation())
            .map(driver -> {
                List<Order> driverOrders = orderRepository.findByDriverAndDateOrderBySequence(driver.getId(), date);
                
                BigDecimal totalWeight = driverOrders.stream()
                    .map(Order::getWeight)
                    .filter(w -> w != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                BigDecimal maxWeight = driver.getAssignedVehicle() != null && driver.getAssignedVehicle().getLoadCapacity() != null
                    ? driver.getAssignedVehicle().getLoadCapacity().multiply(BigDecimal.valueOf(1000))
                    : BigDecimal.valueOf(10000);
                
                double weightPercentage = maxWeight.compareTo(BigDecimal.ZERO) > 0
                    ? totalWeight.doubleValue() / maxWeight.doubleValue() * 100
                    : 0;
                
                boolean locked = driver.getAssignedVehicle() != null && 
                    driver.getAssignedVehicle().getStatus() == Vehicle.VehicleStatus.SERVICE;
                
                return DriverPlanningDTO.builder()
                    .driverId(driver.getId())
                    .driverName(driver.getFullName())
                    .vehicleRegistration(driver.getAssignedVehicle() != null 
                        ? driver.getAssignedVehicle().getRegistrationNumber() : null)
                    .workingHours("08:00 - 16:00")
                    .currentWeight(totalWeight)
                    .maxWeight(maxWeight)
                    .weightPercentage(Math.min(weightPercentage, 100))
                    .locked(locked)
                    .lockReason(locked ? "Pojazd w serwisie" : null)
                    .orders(driverOrders.stream()
                        .map(this::toOrderDTO)
                        .collect(Collectors.toList()))
                    .build();
            })
            .collect(Collectors.toList());
    }
    
    private List<OrderDTO> getUnassignedOrders(LocalDate date) {
        return orderRepository.findUnassignedOrdersForDate(date).stream()
            .map(this::toOrderDTO)
            .collect(Collectors.toList());
    }
    
    private List<GpsLocationDTO> getDriverLocations() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        return gpsLocationRepository.findRecentLocations(oneHourAgo).stream()
            .map(this::toGpsLocationDTO)
            .collect(Collectors.toList());
    }
    
    private List<ConflictDTO> getConflicts(LocalDate date) {
        List<ConflictDTO> conflicts = new ArrayList<>();
        
        // Check for vehicles in service with assigned orders
        List<Vehicle> serviceVehicles = vehicleRepository.findByStatus(Vehicle.VehicleStatus.SERVICE);
        for (Vehicle vehicle : serviceVehicles) {
            List<Order> orders = orderRepository.findByPlannedDate(date).stream()
                .filter(o -> o.getAssignedVehicle() != null && o.getAssignedVehicle().getId().equals(vehicle.getId()))
                .filter(o -> o.getStatus() == Order.OrderStatus.PLANNED || o.getStatus() == Order.OrderStatus.IN_PROGRESS)
                .collect(Collectors.toList());
            
            for (Order order : orders) {
                conflicts.add(ConflictDTO.builder()
                    .type("VEHICLE_IN_SERVICE")
                    .severity("HIGH")
                    .message("Pojazd " + vehicle.getRegistrationNumber() + " jest w serwisie ale ma przypisane zlecenie " + order.getOrderNumber())
                    .entityId(order.getId())
                    .entityType("ORDER")
                    .build());
            }
        }
        
        // Check for drivers on vacation with assigned orders
        List<Driver> vacationDrivers = driverRepository.findByStatus(Driver.DriverStatus.VACATION);
        for (Driver driver : vacationDrivers) {
            List<Order> orders = orderRepository.findByAssignedDriverIdAndPlannedDate(driver.getId(), date);
            for (Order order : orders) {
                if (order.getStatus() == Order.OrderStatus.PLANNED || order.getStatus() == Order.OrderStatus.IN_PROGRESS) {
                    conflicts.add(ConflictDTO.builder()
                        .type("DRIVER_ON_VACATION")
                        .severity("HIGH")
                        .message("Kierowca " + driver.getFullName() + " jest na urlopie ale ma przypisane zlecenie " + order.getOrderNumber())
                        .entityId(order.getId())
                        .entityType("ORDER")
                        .build());
                }
            }
        }
        
        // Check for weight capacity exceeded
        List<Driver> activeDrivers = driverRepository.findByStatus(Driver.DriverStatus.ACTIVE);
        for (Driver driver : activeDrivers) {
            List<Order> driverOrders = orderRepository.findByDriverAndDateOrderBySequence(driver.getId(), date);
            
            BigDecimal totalWeight = driverOrders.stream()
                .map(Order::getWeight)
                .filter(w -> w != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal maxWeight = driver.getAssignedVehicle() != null && driver.getAssignedVehicle().getLoadCapacity() != null
                ? driver.getAssignedVehicle().getLoadCapacity().multiply(BigDecimal.valueOf(1000))
                : BigDecimal.valueOf(10000);
            
            if (totalWeight.compareTo(maxWeight) > 0) {
                conflicts.add(ConflictDTO.builder()
                    .type("WEIGHT_EXCEEDED")
                    .severity("MEDIUM")
                    .message("Przekroczona ładowność pojazdu " + driver.getAssignedVehicle().getRegistrationNumber() + 
                        " (" + totalWeight + " kg / " + maxWeight + " kg)")
                    .entityId(driver.getId())
                    .entityType("DRIVER")
                    .build());
            }
        }
        
        return conflicts;
    }
    
    private OrderDTO toOrderDTO(Order order) {
        return OrderDTO.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .clientName(order.getClientName())
            .pickupAddress(order.getPickupAddress())
            .deliveryAddress(order.getDeliveryAddress())
            .deliveryTimeFrom(order.getDeliveryTimeFrom())
            .deliveryTimeTo(order.getDeliveryTimeTo())
            .weight(order.getWeight())
            .status(order.getStatus())
            .statusColor(order.getStatusColor())
            .sequenceNumber(order.getSequenceNumber())
            .build();
    }
    
    private GpsLocationDTO toGpsLocationDTO(GpsLocation location) {
        return GpsLocationDTO.builder()
            .id(location.getId())
            .driverId(location.getDriver().getId())
            .driverName(location.getDriver().getFullName())
            .latitude(location.getLatitude())
            .longitude(location.getLongitude())
            .recordedAt(location.getRecordedAt())
            .build();
    }
}
