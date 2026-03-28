package com.tms.service;

import com.tms.dto.GpsLocationDTO;
import com.tms.entity.Driver;
import com.tms.entity.GpsLocation;
import com.tms.repository.DriverRepository;
import com.tms.repository.GpsLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GpsLocationService {
    
    private final GpsLocationRepository gpsLocationRepository;
    private final DriverRepository driverRepository;
    
    @Transactional
    public GpsLocationDTO saveLocation(Long driverId, BigDecimal latitude, BigDecimal longitude) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));
        
        GpsLocation location = GpsLocation.builder()
            .driver(driver)
            .latitude(latitude)
            .longitude(longitude)
            .build();
        
        GpsLocation saved = gpsLocationRepository.save(location);
        return toDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<GpsLocationDTO> findByDriverId(Long driverId) {
        return gpsLocationRepository.findByDriverId(driverId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public GpsLocationDTO findLatestByDriverId(Long driverId) {
        return gpsLocationRepository.findLatestByDriverId(driverId)
            .map(this::toDTO)
            .orElse(null);
    }
    
    @Transactional(readOnly = true)
    public List<GpsLocationDTO> findRecentLocations() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        return gpsLocationRepository.findRecentLocations(oneHourAgo).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    private GpsLocationDTO toDTO(GpsLocation location) {
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
