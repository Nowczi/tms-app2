package com.tms.controller;

import com.tms.dto.DriverDTO;
import com.tms.dto.DriverRequest;
import com.tms.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DriverController {
    
    private final DriverService driverService;
    
    @GetMapping
    public ResponseEntity<List<DriverDTO>> getAllDrivers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate availableDate) {
        
        List<DriverDTO> drivers;
        if (status != null) {
            drivers = driverService.findByStatus(status);
        } else if (availableDate != null) {
            drivers = driverService.findAvailableDriversForDate(availableDate);
        } else {
            drivers = driverService.findAll();
        }
        return ResponseEntity.ok(drivers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.findById(id));
    }
    
    @GetMapping("/expiring-documents")
    public ResponseEntity<List<DriverDTO>> getDriversWithExpiringDocuments() {
        return ResponseEntity.ok(driverService.findDriversWithExpiringDocuments());
    }
    
    @PostMapping
    public ResponseEntity<DriverDTO> createDriver(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.create(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DriverDTO> updateDriver(@PathVariable Long id, @Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
