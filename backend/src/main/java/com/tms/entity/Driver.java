package com.tms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(length = 20)
    private String phone;
    
    @Column(length = 255)
    private String email;
    
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DriverStatus status = DriverStatus.ACTIVE;
    
    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    @Column(name = "contract_expiry")
    private LocalDate contractExpiry;
    
    @Column(name = "license_number", length = 50)
    private String licenseNumber;
    
    @Column(name = "license_expiry")
    private LocalDate licenseExpiry;
    
    @Column(name = "medical_exam_expiry")
    private LocalDate medicalExamExpiry;
    
    @Column(name = "vacation_start")
    private LocalDate vacationStart;
    
    @Column(name = "vacation_end")
    private LocalDate vacationEnd;
    
    @OneToOne
    @JoinColumn(name = "assigned_vehicle_id")
    private Vehicle assignedVehicle;
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum DriverStatus {
        ACTIVE, INACTIVE, VACATION
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public String getExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null) return "UNKNOWN";
        LocalDate now = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(now, expiryDate);
        
        if (daysUntilExpiry < 0) return "EXPIRED";
        if (daysUntilExpiry < 14) return "CRITICAL";
        if (daysUntilExpiry < 30) return "WARNING";
        return "OK";
    }
    
    public String getLicenseExpiryStatus() {
        return getExpiryStatus(licenseExpiry);
    }
    
    public String getMedicalExamExpiryStatus() {
        return getExpiryStatus(medicalExamExpiry);
    }
    
    public String getContractExpiryStatus() {
        return getExpiryStatus(contractExpiry);
    }
    
    public boolean isOnVacation() {
        if (vacationStart == null || vacationEnd == null) return false;
        LocalDate now = LocalDate.now();
        return !now.isBefore(vacationStart) && !now.isAfter(vacationEnd);
    }
    
    public boolean hasVacationInNextDays(int days) {
        if (vacationStart == null) return false;
        LocalDate now = LocalDate.now();
        LocalDate future = now.plusDays(days);
        return !vacationStart.isAfter(future) && !vacationStart.isBefore(now);
    }
    
    public long getSeniorityDays() {
        if (hireDate == null) return 0;
        return ChronoUnit.DAYS.between(hireDate, LocalDate.now());
    }
}
