package com.tms.controller;

import com.tms.dto.PlanningDTO;
import com.tms.service.PlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/planning")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlanningController {
    
    private final PlanningService planningService;
    
    @GetMapping
    public ResponseEntity<PlanningDTO> getPlanning(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now();
        }
        return ResponseEntity.ok(planningService.getPlanningData(date));
    }
}
