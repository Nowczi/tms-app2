// Export all types
export * from './driver';

// Re-export other types if they exist
export interface Order {
  id: number;
  orderNumber: string;
  clientReference?: string;
  clientName: string;
  clientPhone?: string;
  pickupAddress?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryTimeFrom?: string;
  deliveryTimeTo?: string;
  weight?: number;
  notes?: string;
  status: 'NEW' | 'PLANNED' | 'IN_PROGRESS' | 'DELIVERED' | 'PROBLEM' | 'CANCELLED';
  assignedDriverId?: number;
  assignedVehicleId?: number;
  plannedDate?: string;
  sequenceNumber?: number;
  podPhotoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: number;
  registrationNumber: string;
  brand?: string;
  model?: string;
  yearOfProduction?: number;
  loadCapacity?: number;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  currentMileage?: number;
  serviceNotes?: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'SERVICE';
  assignedDriverId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'DISPATCHER' | 'DRIVER';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
