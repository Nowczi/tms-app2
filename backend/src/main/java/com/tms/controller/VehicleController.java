package com.tms.controller;

import com.tms.dto.VehicleDTO;
import com.tms.dto.VehicleRequest;
import com.tms.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleController {
    
    private final VehicleService vehicleService;
    
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles(
            @RequestParam(required = false) String status) {
        
        List<VehicleDTO> vehicles;
        if (status != null) {
            vehicles = vehicleService.findByStatus(status);
        } else {
            vehicles = vehicleService.findAll();
        }
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<VehicleDTO>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.findAvailableVehicles());
    }
    
    @GetMapping("/expiring-documents")
    public ResponseEntity<List<VehicleDTO>> getVehiclesWithExpiringDocuments() {
        return ResponseEntity.ok(vehicleService.findVehiclesWithExpiringDocuments());
    }
    
    @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
