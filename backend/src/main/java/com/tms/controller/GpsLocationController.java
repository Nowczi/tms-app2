package com.tms.controller;

import com.tms.dto.GpsLocationDTO;
import com.tms.service.GpsLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/gps")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GpsLocationController {
    
    private final GpsLocationService gpsLocationService;
    
    @GetMapping("/drivers/{driverId}")
    public ResponseEntity<List<GpsLocationDTO>> getLocationsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(gpsLocationService.findByDriverId(driverId));
    }
    
    @GetMapping("/drivers/{driverId}/latest")
    public ResponseEntity<GpsLocationDTO> getLatestLocation(@PathVariable Long driverId) {
        GpsLocationDTO location = gpsLocationService.findLatestByDriverId(driverId);
        if (location == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(location);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<GpsLocationDTO>> getRecentLocations() {
        return ResponseEntity.ok(gpsLocationService.findRecentLocations());
    }
    
    @PostMapping("/drivers/{driverId}")
    public ResponseEntity<GpsLocationDTO> saveLocation(
            @PathVariable Long driverId,
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude) {
        return ResponseEntity.ok(gpsLocationService.saveLocation(driverId, latitude, longitude));
    }
}
