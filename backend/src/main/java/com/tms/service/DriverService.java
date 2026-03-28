package com.tms.service;

import com.tms.dto.DriverDTO;
import com.tms.dto.DriverRequest;
import com.tms.entity.Driver;
import com.tms.entity.Vehicle;
import com.tms.repository.DriverRepository;
import com.tms.repository.OrderRepository;
import com.tms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverService {
    
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final OrderRepository orderRepository;
    
    @Transactional(readOnly = true)
    public List<DriverDTO> findAll() {
        return driverRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<DriverDTO> findByStatus(String status) {
        Driver.DriverStatus driverStatus = Driver.DriverStatus.valueOf(status);
        return driverRepository.findByStatus(driverStatus).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public DriverDTO findById(Long id) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        return toDTO(driver);
    }
    
    @Transactional(readOnly = true)
    public List<DriverDTO> findAvailableDriversForDate(LocalDate date) {
        return driverRepository.findAvailableDriversForDate(date).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public DriverDTO create(DriverRequest request) {
        Driver driver = new Driver();
        updateDriverFromRequest(driver, request);
        
        Driver saved = driverRepository.save(driver);
        return toDTO(saved);
    }
    
    @Transactional
    public DriverDTO update(Long id, DriverRequest request) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        
        updateDriverFromRequest(driver, request);
        Driver saved = driverRepository.save(driver);
        return toDTO(saved);
    }
    
    @Transactional
    public void delete(Long id) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        driverRepository.delete(driver);
    }
    
    @Transactional(readOnly = true)
    public List<DriverDTO> findDriversWithExpiringDocuments() {
        LocalDate threshold = LocalDate.now().plusDays(30);
        return driverRepository.findDriversWithExpiringDocuments(threshold).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    private void updateDriverFromRequest(Driver driver, DriverRequest request) {
        driver.setFirstName(request.getFirstName());
        driver.setLastName(request.getLastName());
        driver.setPhone(request.getPhone());
        driver.setEmail(request.getEmail());
        driver.setStatus(Driver.DriverStatus.valueOf(request.getStatus()));
        driver.setHireDate(request.getHireDate());
        driver.setContractExpiry(request.getContractExpiry());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseExpiry(request.getLicenseExpiry());
        driver.setMedicalExamExpiry(request.getMedicalExamExpiry());
        driver.setVacationStart(request.getVacationStart());
        driver.setVacationEnd(request.getVacationEnd());
        
        if (request.getAssignedVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getAssignedVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            driver.setAssignedVehicle(vehicle);
        } else {
            driver.setAssignedVehicle(null);
        }
    }
    
    private DriverDTO toDTO(Driver driver) {
        DriverDTO dto = DriverDTO.builder()
            .id(driver.getId())
            .firstName(driver.getFirstName())
            .lastName(driver.getLastName())
            .fullName(driver.getFullName())
            .phone(driver.getPhone())
            .email(driver.getEmail())
            .status(driver.getStatus())
            .hireDate(driver.getHireDate())
            .contractExpiry(driver.getContractExpiry())
            .licenseNumber(driver.getLicenseNumber())
            .licenseExpiry(driver.getLicenseExpiry())
            .licenseExpiryStatus(driver.getLicenseExpiryStatus())
            .medicalExamExpiry(driver.getMedicalExamExpiry())
            .medicalExamExpiryStatus(driver.getMedicalExamExpiryStatus())
            .vacationStart(driver.getVacationStart())
            .vacationEnd(driver.getVacationEnd())
            .userId(driver.getUser() != null ? driver.getUser().getId() : null)
            .createdAt(driver.getCreatedAt())
            .updatedAt(driver.getUpdatedAt())
            .onVacation(driver.isOnVacation())
            .hasVacationInNext7Days(driver.hasVacationInNextDays(7))
            .seniorityDays(driver.getSeniorityDays())
            .build();
        
        if (driver.getAssignedVehicle() != null) {
            dto.setAssignedVehicleId(driver.getAssignedVehicle().getId());
            dto.setAssignedVehicleRegistration(driver.getAssignedVehicle().getRegistrationNumber());
        }
        
        // Add statistics
        dto.setTotalOrders(driverRepository.countOrdersByDriverId(driver.getId()));
        dto.setProblemCount(driverRepository.countProblemOrdersByDriverId(driver.getId()));
        dto.setTotalKm(0L); // Would be calculated from GPS data
        
        long days = driver.getSeniorityDays();
        dto.setAvgOrdersPerDay(days > 0 ? (double) dto.getTotalOrders() / days : 0.0);
        
        return dto;
    }
}
