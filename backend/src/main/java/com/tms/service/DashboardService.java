package com.tms.service;

import com.tms.dto.*;
import com.tms.entity.Driver;
import com.tms.entity.Order;
import com.tms.entity.Vehicle;
import com.tms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final OrderRepository orderRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final GpsLocationRepository gpsLocationRepository;
    
    @Transactional(readOnly = true)
    public DashboardDTO getDashboardData() {
        LocalDate today = LocalDate.now();
        
        return DashboardDTO.builder()
            .kpi(getKpi(today))
            .alerts(getAlerts())
            .driverWorkloads(getDriverWorkloads(today))
            .recentOrders(getRecentOrders())
            .statistics(getStatistics(today))
            .build();
    }
    
    private KpiDTO getKpi(LocalDate date) {
        long totalOrders = orderRepository.countByPlannedDate(date);
        long completedOrders = orderRepository.countCompletedByDate(date);
        long inProgress = orderRepository.countInProgressByDate(date);
        long problems = orderRepository.countProblemsByDate(date);
        
        // Count available drivers (active and not on vacation)
        List<Driver> allDrivers = driverRepository.findByStatus(Driver.DriverStatus.ACTIVE);
        long availableDrivers = allDrivers.stream()
            .filter(d -> !d.isOnVacation())
            .count();
        
        return KpiDTO.builder()
            .ordersTodayTotal(totalOrders)
            .ordersTodayCompleted(completedOrders)
            .ordersInProgress(inProgress)
            .ordersWithProblem(problems)
            .availableDrivers(availableDrivers)
            .build();
    }
    
    private List<AlertDTO> getAlerts() {
        List<AlertDTO> alerts = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate warningThreshold = today.plusDays(30);
        LocalDate criticalThreshold = today.plusDays(14);
        
        // Overdue orders
        List<Order> staleOrders = orderRepository.findStaleOrders(today.atStartOfDay().minusHours(2));
        for (Order order : staleOrders) {
            alerts.add(AlertDTO.builder()
                .type("ORDER_OVERDUE")
                .severity("HIGH")
                .title("Zlecenie przeterminowane")
                .message("Zlecenie " + order.getOrderNumber() + " - brak zmiany statusu od 2+ godzin")
                .entityId(order.getId())
                .entityType("ORDER")
                .link("/orders/" + order.getId())
                .build());
        }
        
        // Driver document alerts
        List<Driver> drivers = driverRepository.findDriversWithExpiringDocuments(warningThreshold);
        for (Driver driver : drivers) {
            if (driver.getLicenseExpiry() != null && driver.getLicenseExpiry().isBefore(warningThreshold)) {
                String severity = driver.getLicenseExpiry().isBefore(criticalThreshold) ? "HIGH" : "MEDIUM";
                alerts.add(AlertDTO.builder()
                    .type("LICENSE_EXPIRING")
                    .severity(severity)
                    .title("Prawo jazdy wygasa")
                    .message("Prawo jazdy kierowcy " + driver.getFullName() + " wygasa " + driver.getLicenseExpiry())
                    .entityId(driver.getId())
                    .entityType("DRIVER")
                    .link("/drivers/" + driver.getId())
                    .build());
            }
            
            if (driver.getMedicalExamExpiry() != null && driver.getMedicalExamExpiry().isBefore(warningThreshold)) {
                String severity = driver.getMedicalExamExpiry().isBefore(criticalThreshold) ? "HIGH" : "MEDIUM";
                alerts.add(AlertDTO.builder()
                    .type("MEDICAL_EXPIRING")
                    .severity(severity)
                    .title("Badania lekarskie wygasają")
                    .message("Badania lekarskie kierowcy " + driver.getFullName() + " wygasają " + driver.getMedicalExamExpiry())
                    .entityId(driver.getId())
                    .entityType("DRIVER")
                    .link("/drivers/" + driver.getId())
                    .build());
            }
            
            if (driver.getContractExpiry() != null && driver.getContractExpiry().isBefore(warningThreshold)) {
                String severity = driver.getContractExpiry().isBefore(criticalThreshold) ? "HIGH" : "MEDIUM";
                alerts.add(AlertDTO.builder()
                    .type("CONTRACT_EXPIRING")
                    .severity(severity)
                    .title("Umowa wygasa")
                    .message("Umowa kierowcy " + driver.getFullName() + " wygasa " + driver.getContractExpiry())
                    .entityId(driver.getId())
                    .entityType("DRIVER")
                    .link("/drivers/" + driver.getId())
                    .build());
            }
        }
        
        // Vehicle document alerts
        List<Vehicle> vehicles = vehicleRepository.findVehiclesWithExpiringDocuments(warningThreshold);
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getInsuranceExpiry() != null && vehicle.getInsuranceExpiry().isBefore(warningThreshold)) {
                String severity = vehicle.getInsuranceExpiry().isBefore(criticalThreshold) ? "HIGH" : "MEDIUM";
                alerts.add(AlertDTO.builder()
                    .type("INSURANCE_EXPIRING")
                    .severity(severity)
                    .title("OC pojazdu wygasa")
                    .message("OC pojazdu " + vehicle.getRegistrationNumber() + " wygasa " + vehicle.getInsuranceExpiry())
                    .entityId(vehicle.getId())
                    .entityType("VEHICLE")
                    .link("/vehicles/" + vehicle.getId())
                    .build());
            }
            
            if (vehicle.getInspectionExpiry() != null && vehicle.getInspectionExpiry().isBefore(warningThreshold)) {
                String severity = vehicle.getInspectionExpiry().isBefore(criticalThreshold) ? "HIGH" : "MEDIUM";
                alerts.add(AlertDTO.builder()
                    .type("INSPECTION_EXPIRING")
                    .severity(severity)
                    .title("Przegląd pojazdu wygasa")
                    .message("Przegląd pojazdu " + vehicle.getRegistrationNumber() + " wygasa " + vehicle.getInspectionExpiry())
                    .entityId(vehicle.getId())
                    .entityType("VEHICLE")
                    .link("/vehicles/" + vehicle.getId())
                    .build());
            }
        }
        
        // Driver vacation alerts
        List<Driver> allDrivers = driverRepository.findAll();
        for (Driver driver : allDrivers) {
            if (driver.hasVacationInNextDays(7)) {
                alerts.add(AlertDTO.builder()
                    .type("VACATION_UPCOMING")
                    .severity("LOW")
                    .title("Urlop kierowcy zbliża się")
                    .message("Kierowca " + driver.getFullName() + " ma urlop od " + driver.getVacationStart())
                    .entityId(driver.getId())
                    .entityType("DRIVER")
                    .link("/drivers/" + driver.getId())
                    .build());
            }
        }
        
        // Sort alerts by severity
        return alerts.stream()
            .sorted(Comparator.comparing(this::severityPriority))
            .collect(Collectors.toList());
    }
    
    private int severityPriority(AlertDTO alert) {
        return switch (alert.getSeverity()) {
            case "HIGH" -> 0;
            case "MEDIUM" -> 1;
            case "LOW" -> 2;
            default -> 3;
        };
    }
    
    private List<DriverWorkloadDTO> getDriverWorkloads(LocalDate date) {
        List<Driver> activeDrivers = driverRepository.findByStatus(Driver.DriverStatus.ACTIVE);
        
        return activeDrivers.stream()
            .filter(d -> !d.isOnVacation())
            .map(driver -> {
                List<Order> driverOrders = orderRepository.findByDriverAndDateOrderBySequence(driver.getId(), date);
                long totalOrders = driverOrders.size();
                long completedOrders = driverOrders.stream()
                    .filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED)
                    .count();
                
                BigDecimal totalWeight = driverOrders.stream()
                    .map(Order::getWeight)
                    .filter(w -> w != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                BigDecimal maxWeight = driver.getAssignedVehicle() != null && driver.getAssignedVehicle().getLoadCapacity() != null
                    ? driver.getAssignedVehicle().getLoadCapacity().multiply(BigDecimal.valueOf(1000)) // Convert tons to kg
                    : BigDecimal.valueOf(10000); // Default 10 tons
                
                double weightPercentage = maxWeight.compareTo(BigDecimal.ZERO) > 0
                    ? totalWeight.doubleValue() / maxWeight.doubleValue() * 100
                    : 0;
                
                boolean locked = driver.getAssignedVehicle() != null && 
                    driver.getAssignedVehicle().getStatus() == Vehicle.VehicleStatus.SERVICE;
                
                return DriverWorkloadDTO.builder()
                    .driverId(driver.getId())
                    .driverName(driver.getFullName())
                    .vehicleRegistration(driver.getAssignedVehicle() != null 
                        ? driver.getAssignedVehicle().getRegistrationNumber() : null)
                    .workingHours("08:00 - 16:00")
                    .totalOrders(totalOrders)
                    .completedOrders(completedOrders)
                    .totalWeight(totalWeight)
                    .maxWeight(maxWeight)
                    .weightPercentage(Math.min(weightPercentage, 100))
                    .locked(locked)
                    .lockReason(locked ? "Pojazd w serwisie" : null)
                    .build();
            })
            .collect(Collectors.toList());
    }
    
    private List<OrderDTO> getRecentOrders() {
        return orderRepository.findRecentOrders(org.springframework.data.domain.PageRequest.of(0, 10))
            .stream()
            .map(order -> OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .clientName(order.getClientName())
                .deliveryAddress(order.getDeliveryAddress())
                .status(order.getStatus())
                .statusColor(order.getStatusColor())
                .assignedDriverName(order.getAssignedDriver() != null ? order.getAssignedDriver().getFullName() : null)
                .createdAt(order.getCreatedAt())
                .build())
            .collect(Collectors.toList());
    }
    
    private StatisticsDTO getStatistics(LocalDate date) {
        // Get last 7 days statistics
        List<DailyStatisticsDTO> dailyStats = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM");
        
        long totalOrders = 0;
        long totalProblems = 0;
        
        for (int i = 6; i >= 0; i--) {
            LocalDate day = date.minusDays(i);
            long orders = orderRepository.countByPlannedDate(day);
            long problems = orderRepository.countProblemsByDate(day);
            
            totalOrders += orders;
            totalProblems += problems;
            
            dailyStats.add(DailyStatisticsDTO.builder()
                .date(day.toString())
                .label(day.format(formatter))
                .orders(orders)
                .km(orders * 50) // Estimated
                .problems(problems)
                .build());
        }
        
        long completedOnTime = totalOrders - totalProblems;
        double onTimePercentage = totalOrders > 0 ? (double) completedOnTime / totalOrders * 100 : 0;
        
        return StatisticsDTO.builder()
            .dailyStats(dailyStats)
            .totalOrders(totalOrders)
            .onTimePercentage(Math.round(onTimePercentage * 100.0) / 100.0)
            .problemCount(totalProblems)
            .build();
    }
}
