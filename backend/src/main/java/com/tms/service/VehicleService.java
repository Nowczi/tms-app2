package com.tms.service;

import com.tms.dto.VehicleDTO;
import com.tms.dto.VehicleRequest;
import com.tms.entity.Driver;
import com.tms.entity.Vehicle;
import com.tms.repository.DriverRepository;
import com.tms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {
    
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    
    @Transactional(readOnly = true)
    public List<VehicleDTO> findAll() {
        return vehicleRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<VehicleDTO> findByStatus(String status) {
        Vehicle.VehicleStatus vehicleStatus = Vehicle.VehicleStatus.valueOf(status);
        return vehicleRepository.findByStatus(vehicleStatus).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public VehicleDTO findById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        return toDTO(vehicle);
    }
    
    @Transactional(readOnly = true)
    public List<VehicleDTO> findAvailableVehicles() {
        return vehicleRepository.findAvailableVehicles().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public VehicleDTO create(VehicleRequest request) {
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new RuntimeException("Vehicle with this registration number already exists");
        }
        
        Vehicle vehicle = new Vehicle();
        updateVehicleFromRequest(vehicle, request);
        
        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }
    
    @Transactional
    public VehicleDTO update(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        if (!vehicle.getRegistrationNumber().equals(request.getRegistrationNumber()) &&
            vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new RuntimeException("Vehicle with this registration number already exists");
        }
        
        updateVehicleFromRequest(vehicle, request);
        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }
    
    @Transactional
    public void delete(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }
    
    @Transactional(readOnly = true)
    public List<VehicleDTO> findVehiclesWithExpiringDocuments() {
        LocalDate threshold = LocalDate.now().plusDays(30);
        return vehicleRepository.findVehiclesWithExpiringDocuments(threshold).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    private void updateVehicleFromRequest(Vehicle vehicle, VehicleRequest request) {
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYearOfProduction(request.getYearOfProduction());
        vehicle.setLoadCapacity(request.getLoadCapacity());
        vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        vehicle.setInspectionExpiry(request.getInspectionExpiry());
        vehicle.setCurrentMileage(request.getCurrentMileage());
        vehicle.setServiceNotes(request.getServiceNotes());
        vehicle.setStatus(Vehicle.VehicleStatus.valueOf(request.getStatus()));
        
        if (request.getAssignedDriverId() != null) {
            Driver driver = driverRepository.findById(request.getAssignedDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            vehicle.setAssignedDriver(driver);
        } else {
            vehicle.setAssignedDriver(null);
        }
    }
    
    private VehicleDTO toDTO(Vehicle vehicle) {
        VehicleDTO dto = VehicleDTO.builder()
            .id(vehicle.getId())
            .registrationNumber(vehicle.getRegistrationNumber())
            .brand(vehicle.getBrand())
            .model(vehicle.getModel())
            .yearOfProduction(vehicle.getYearOfProduction())
            .loadCapacity(vehicle.getLoadCapacity())
            .insuranceExpiry(vehicle.getInsuranceExpiry())
            .insuranceExpiryStatus(vehicle.getInsuranceExpiryStatus())
            .inspectionExpiry(vehicle.getInspectionExpiry())
            .inspectionExpiryStatus(vehicle.getInspectionExpiryStatus())
            .currentMileage(vehicle.getCurrentMileage())
            .serviceNotes(vehicle.getServiceNotes())
            .status(vehicle.getStatus())
            .createdAt(vehicle.getCreatedAt())
            .updatedAt(vehicle.getUpdatedAt())
            .build();
        
        if (vehicle.getAssignedDriver() != null) {
            dto.setAssignedDriverId(vehicle.getAssignedDriver().getId());
            dto.setAssignedDriverName(vehicle.getAssignedDriver().getFullName());
        }
        
        // Add statistics
        dto.setTotalKm(vehicle.getCurrentMileage() != null ? vehicle.getCurrentMileage().longValue() : 0L);
        dto.setTotalServiceCost(java.math.BigDecimal.ZERO); // Would be calculated from service records
        
        return dto;
    }
}
