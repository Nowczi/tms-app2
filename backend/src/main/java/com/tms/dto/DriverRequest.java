package com.tms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DriverRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    private String phone;
    private String email;
    private String status;
    private LocalDate hireDate;
    private LocalDate contractExpiry;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private LocalDate medicalExamExpiry;
    private LocalDate vacationStart;
    private LocalDate vacationEnd;
    private Long assignedVehicleId;
}
