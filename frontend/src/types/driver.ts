export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'VACATION';
  hireDate?: string;
  contractExpiry?: string;
  contractExpiryStatus?: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  licenseNumber?: string;
  licenseExpiry?: string;
  medicalExamExpiry?: string;
  vacationStart?: string;
  vacationEnd?: string;
  assignedVehicleId?: number;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverWithVehicle extends Driver {
  assignedVehicle?: {
    id: number;
    registrationNumber: string;
    brand: string;
    model: string;
  };
}
