export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'VACATION';
  hireDate?: string;
  contractExpiry?: string;
  contractExpiryStatus?: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'CRITICAL' | 'WARNING';
  licenseNumber?: string;
  licenseExpiry?: string;
  licenseExpiryStatus?: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'CRITICAL' | 'WARNING';
  medicalExamExpiry?: string;
  medicalExamExpiryStatus?: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'CRITICAL' | 'WARNING';
  vacationStart?: string;
  vacationEnd?: string;
  assignedVehicleId?: number;
  assignedVehicleRegistration?: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  // Extended fields from DriverDTO
  fullName?: string;
  onVacation?: boolean;
  hasVacationInNext7Days?: boolean;
  seniorityDays?: number;
  // Statistics
  totalOrders?: number;
  totalKm?: number;
  avgOrdersPerDay?: number;
  problemCount?: number;
}

export interface DriverWithVehicle extends Driver {
  assignedVehicle?: {
    id: number;
    registrationNumber: string;
    brand: string;
    model: string;
  };
}
