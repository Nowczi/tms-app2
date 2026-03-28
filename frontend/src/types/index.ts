export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DISPATCHER' | 'DRIVER';
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'VACATION';
  hireDate: string;
  contractExpiry: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseExpiryStatus: string;
  medicalExamExpiry: string;
  medicalExamExpiryStatus: string;
  vacationStart: string;
  vacationEnd: string;
  assignedVehicleId: number;
  assignedVehicleRegistration: string;
  onVacation: boolean;
  hasVacationInNext7Days: boolean;
  seniorityDays: number;
  totalOrders: number;
  totalKm: number;
  avgOrdersPerDay: number;
  problemCount: number;
}

export interface Vehicle {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  yearOfProduction: number;
  loadCapacity: number;
  insuranceExpiry: string;
  insuranceExpiryStatus: string;
  inspectionExpiry: string;
  inspectionExpiryStatus: string;
  currentMileage: number;
  serviceNotes: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'SERVICE';
  assignedDriverId: number;
  assignedDriverName: string;
  totalKm: number;
  totalServiceCost: number;
}

export type OrderStatus = 'NEW' | 'PLANNED' | 'IN_PROGRESS' | 'DELIVERED' | 'PROBLEM' | 'CANCELLED';

export interface Order {
  id: number;
  orderNumber: string;
  clientReference: string;
  orderNumberInternal: string;
  clientName: string;
  clientPhone: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  deliveryTimeFrom: string;
  deliveryTimeTo: string;
  weight: number;
  notes: string;
  status: OrderStatus;
  statusColor: string;
  assignedDriverId: number;
  assignedDriverName: string;
  assignedVehicleId: number;
  assignedVehicleRegistration: string;
  plannedDate: string;
  sequenceNumber: number;
  podPhotoUrl: string;
  createdAt: string;
  updatedAt: string;
  overdue: boolean;
  history?: OrderHistory[];
  documents?: OrderDocument[];
}

export interface OrderHistory {
  id: number;
  status: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface OrderDocument {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface OrderRequest {
  orderNumber?: string;
  clientReference?: string;
  orderNumberInternal?: string;
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
  assignedDriverId?: number;
  assignedVehicleId?: number;
  plannedDate?: string;
  sequenceNumber?: number;
}

export interface Kpi {
  ordersTodayTotal: number;
  ordersTodayCompleted: number;
  ordersInProgress: number;
  ordersWithProblem: number;
  availableDrivers: number;
}

export interface Alert {
  id: number;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  entityId: number;
  entityType: string;
  link: string;
  createdAt: string;
}

export interface DriverWorkload {
  driverId: number;
  driverName: string;
  vehicleRegistration: string;
  workingHours: string;
  totalOrders: number;
  completedOrders: number;
  totalWeight: number;
  maxWeight: number;
  weightPercentage: number;
  locked: boolean;
  lockReason: string;
}

export interface DailyStatistics {
  date: string;
  label: string;
  orders: number;
  km: number;
  problems: number;
}

export interface Statistics {
  dailyStats: DailyStatistics[];
  totalOrders: number;
  onTimePercentage: number;
  problemCount: number;
}

export interface DashboardData {
  kpi: Kpi;
  alerts: Alert[];
  driverWorkloads: DriverWorkload[];
  recentOrders: Order[];
  statistics: Statistics;
}

export interface GpsLocation {
  id: number;
  driverId: number;
  driverName: string;
  latitude: number;
  longitude: number;
  recordedAt: string;
}

export interface DriverPlanning {
  driverId: number;
  driverName: string;
  vehicleRegistration: string;
  workingHours: string;
  currentWeight: number;
  maxWeight: number;
  weightPercentage: number;
  locked: boolean;
  lockReason: string;
  orders: Order[];
}

export interface Conflict {
  id: number;
  type: string;
  severity: string;
  message: string;
  entityId: number;
  entityType: string;
}

export interface PlanningData {
  drivers: DriverPlanning[];
  unassignedOrders: Order[];
  driverLocations: GpsLocation[];
  conflicts: Conflict[];
}
