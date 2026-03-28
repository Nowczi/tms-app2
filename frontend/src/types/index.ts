// Export all types
export * from './driver';

// Order Status Type
export type OrderStatus = 'NEW' | 'PLANNED' | 'IN_PROGRESS' | 'DELIVERED' | 'PROBLEM' | 'CANCELLED';

// Vehicle Status Type
export type VehicleStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'SERVICE';

// Driver Status Type
export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'VACATION';

// User Role Type
export type UserRole = 'ADMIN' | 'DISPATCHER' | 'DRIVER';

// Expiry Status Type
export type ExpiryStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'CRITICAL' | 'WARNING';

// Alert Severity Type
export type AlertSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

// Conflict Type
export type ConflictType = 'TIME' | 'LOCATION' | 'CAPACITY';

// Order Interface (matching backend OrderDTO)
export interface Order {
  id: number;
  orderNumber: string;
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
  status: OrderStatus;
  statusColor?: string;
  assignedDriverId?: number;
  assignedDriverName?: string;
  assignedVehicleId?: number;
  assignedVehicleRegistration?: string;
  plannedDate?: string;
  sequenceNumber?: number;
  podPhotoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  history?: OrderHistoryEntry[];
  documents?: OrderDocument[];
  overdue?: boolean;
}

// Order History Entry
export interface OrderHistoryEntry {
  id?: number;
  orderId?: number;
  status: OrderStatus;
  comment?: string;
  createdBy?: string;
  createdAt?: string;
}

// Order Document
export interface OrderDocument {
  id?: number;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  fileUrl: string;
  uploadedBy?: string;
  createdAt?: string;
}

// Order Request (for creating/updating orders)
export interface OrderRequest {
  orderNumber?: string;
  orderNumberInternal?: string;
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
  assignedDriverId?: number;
  assignedVehicleId?: number;
  plannedDate?: string;
  sequenceNumber?: number;
}

// Vehicle Interface (matching backend VehicleDTO)
export interface Vehicle {
  id: number;
  registrationNumber: string;
  brand?: string;
  model?: string;
  yearOfProduction?: number;
  loadCapacity?: number;
  insuranceExpiry?: string;
  insuranceExpiryStatus?: ExpiryStatus;
  inspectionExpiry?: string;
  inspectionExpiryStatus?: ExpiryStatus;
  currentMileage?: number;
  serviceNotes?: string;
  status: VehicleStatus;
  assignedDriverId?: number;
  assignedDriverName?: string;
  createdAt?: string;
  updatedAt?: string;
  // Statistics
  totalKm?: number;
  totalServiceCost?: number;
}

// Vehicle Request
export interface VehicleRequest {
  registrationNumber: string;
  brand?: string;
  model?: string;
  yearOfProduction?: number;
  loadCapacity?: number;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  currentMileage?: number;
  serviceNotes?: string;
  status?: VehicleStatus;
  assignedDriverId?: number;
}

// Driver Interface (matching backend DriverDTO)
export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone?: string;
  email?: string;
  status: DriverStatus;
  hireDate?: string;
  contractExpiry?: string;
  contractExpiryStatus?: ExpiryStatus;
  licenseNumber?: string;
  licenseExpiry?: string;
  licenseExpiryStatus?: ExpiryStatus;
  medicalExamExpiry?: string;
  medicalExamExpiryStatus?: ExpiryStatus;
  vacationStart?: string;
  vacationEnd?: string;
  assignedVehicleId?: number;
  assignedVehicleRegistration?: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  onVacation?: boolean;
  hasVacationInNext7Days?: boolean;
  seniorityDays?: number;
  // Statistics
  totalOrders?: number;
  totalKm?: number;
  avgOrdersPerDay?: number;
  problemCount?: number;
}

// Driver Request
export interface DriverRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  status?: DriverStatus;
  hireDate?: string;
  contractExpiry?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  medicalExamExpiry?: string;
  vacationStart?: string;
  vacationEnd?: string;
  assignedVehicleId?: number;
  userId?: number;
}

// User Interface
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Response (matching backend AuthResponse)
export interface AuthResponse {
  token: string;
  type?: string;
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive?: boolean;
}

// Auth Request
export interface AuthRequest {
  username: string;
  password: string;
}

// KPI Data (extended for Dashboard)
export interface KpiData {
  totalOrders: number;
  inProgressOrders: number;
  problemOrders: number;
  availableDrivers: number;
  // Extended fields used by DashboardPage
  ordersTodayCompleted?: number;
  ordersTodayTotal?: number;
  ordersInProgress?: number;
  ordersWithProblem?: number;
}

// Alert (extended for Dashboard)
export interface Alert {
  id?: number;
  type: AlertSeverity;
  severity?: AlertSeverity; // Alias for type, used by some components
  title: string;
  message: string;
  link?: string;
  entityType?: 'DRIVER' | 'VEHICLE' | 'ORDER';
  entityId?: number;
  createdAt?: string;
}

// Driver Workload (extended for Dashboard)
export interface DriverWorkload {
  driverId: number;
  driverName: string;
  orderCount: number;
  maxCapacity?: number;
  // Extended fields
  locked?: boolean;
  lockReason?: string;
  completedOrders?: number;
  totalOrders?: number;
  weightPercentage?: number;
  totalWeight?: number;
  maxWeight?: number;
}

// Daily Statistics
export interface DailyStatistics {
  totalOrders: number;
  deliveredOrders: number;
  problemOrders: number;
  averageDeliveryTime?: number;
}

// Weekly Statistics
export interface WeeklyStatistics {
  totalOrders: number;
  deliveredOrders: number;
  problemOrders: number;
}

// Monthly Statistics
export interface MonthlyStatistics {
  totalOrders: number;
  deliveredOrders: number;
  problemOrders: number;
}

// Statistics (extended for Dashboard)
export interface Statistics {
  daily?: DailyStatistics;
  weekly?: WeeklyStatistics;
  monthly?: MonthlyStatistics;
  // Extended fields used directly
  dailyStats?: DailyStatistics;
  totalOrders?: number;
  onTimePercentage?: number;
  problemCount?: number;
}

// Dashboard Data (matching backend DashboardDTO)
export interface DashboardData {
  kpi: KpiData;
  alerts: Alert[];
  driverWorkloads: DriverWorkload[];
  recentOrders: Order[];
  statistics: Statistics;
}

// Planned Order (extended for Planning)
export interface PlannedOrder {
  orderId: number;
  id?: number; // Alias for orderId
  orderNumber: string;
  clientName: string;
  deliveryAddress: string;
  sequenceNumber?: number;
  status: OrderStatus;
  // Extended fields for map display
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

// Driver Planning (extended for Planning)
export interface DriverPlanning {
  driverId: number;
  driverName: string;
  orders: PlannedOrder[];
  // Extended fields
  locked?: boolean;
  lockReason?: string;
  weightPercentage?: number;
  vehicleRegistration?: string;
  workingHours?: string;
  currentWeight?: number;
  maxWeight?: number;
}

// GPS Location (extended for Planning)
export interface GpsLocation {
  id?: number;
  driverId: number;
  driverName?: string;
  latitude: number;
  longitude: number;
  recordedAt?: string;
}

// Planning Conflict (extended for Planning)
export interface PlanningConflict {
  id?: number;
  type: ConflictType;
  severity?: AlertSeverity;
  message?: string;
  description: string;
  orderId?: number;
  driverId?: number;
}

// Planning Data (matching backend PlanningDTO)
export interface PlanningData {
  drivers: DriverPlanning[];
  unassignedOrders: Order[];
  driverLocations: GpsLocation[];
  conflicts: PlanningConflict[];
}

// Status Update Request
export interface StatusUpdateRequest {
  status: OrderStatus;
  comment?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Filter Params
export interface OrderFilterParams {
  status?: OrderStatus;
  driverId?: number;
  vehicleId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface DriverFilterParams {
  status?: DriverStatus;
  search?: string;
  page?: number;
  size?: number;
}

export interface VehicleFilterParams {
  status?: VehicleStatus;
  search?: string;
  page?: number;
  size?: number;
}
