import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(username: string, password: string) {
    const response = await this.client.post('/auth/login', { username, password });
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  // Dashboard
  async getDashboard() {
    const response = await this.client.get('/dashboard');
    return response.data;
  }

  // Orders
  async getOrders(params?: { status?: string; driverId?: number; date?: string }) {
    const response = await this.client.get('/orders', { params });
    return response.data;
  }

  async getOrder(id: number) {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  async getRecentOrders(limit: number = 10) {
    const response = await this.client.get('/orders/recent', { params: { limit } });
    return response.data;
  }

  async getUnassignedOrders(date: string) {
    const response = await this.client.get('/orders/unassigned', { params: { date } });
    return response.data;
  }

  async createOrder(order: any) {
    const response = await this.client.post('/orders', order);
    return response.data;
  }

  async updateOrder(id: number, order: any) {
    const response = await this.client.put(`/orders/${id}`, order);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string, notes?: string) {
    const response = await this.client.patch(`/orders/${id}/status`, { status, notes });
    return response.data;
  }

  async assignDriver(orderId: number, driverId: number, vehicleId?: number) {
    const response = await this.client.post(`/orders/${orderId}/assign`, null, {
      params: { driverId, vehicleId },
    });
    return response.data;
  }

  async deleteOrder(id: number) {
    await this.client.delete(`/orders/${id}`);
  }

  // Drivers
  async getDrivers(params?: { status?: string; availableDate?: string }) {
    const response = await this.client.get('/drivers', { params });
    return response.data;
  }

  async getDriver(id: number) {
    const response = await this.client.get(`/drivers/${id}`);
    return response.data;
  }

  async getDriversWithExpiringDocuments() {
    const response = await this.client.get('/drivers/expiring-documents');
    return response.data;
  }

  async createDriver(driver: any) {
    const response = await this.client.post('/drivers', driver);
    return response.data;
  }

  async updateDriver(id: number, driver: any) {
    const response = await this.client.put(`/drivers/${id}`, driver);
    return response.data;
  }

  async deleteDriver(id: number) {
    await this.client.delete(`/drivers/${id}`);
  }

  // Vehicles
  async getVehicles(params?: { status?: string }) {
    const response = await this.client.get('/vehicles', { params });
    return response.data;
  }

  async getVehicle(id: number) {
    const response = await this.client.get(`/vehicles/${id}`);
    return response.data;
  }

  async getAvailableVehicles() {
    const response = await this.client.get('/vehicles/available');
    return response.data;
  }

  async getVehiclesWithExpiringDocuments() {
    const response = await this.client.get('/vehicles/expiring-documents');
    return response.data;
  }

  async createVehicle(vehicle: any) {
    const response = await this.client.post('/vehicles', vehicle);
    return response.data;
  }

  async updateVehicle(id: number, vehicle: any) {
    const response = await this.client.put(`/vehicles/${id}`, vehicle);
    return response.data;
  }

  async deleteVehicle(id: number) {
    await this.client.delete(`/vehicles/${id}`);
  }

  // Planning
  async getPlanning(date?: string) {
    const response = await this.client.get('/planning', { params: { date } });
    return response.data;
  }

  // GPS
  async getDriverLocations(driverId: number) {
    const response = await this.client.get(`/gps/drivers/${driverId}`);
    return response.data;
  }

  async getLatestLocation(driverId: number) {
    const response = await this.client.get(`/gps/drivers/${driverId}/latest`);
    return response.data;
  }

  async getRecentLocations() {
    const response = await this.client.get('/gps/recent');
    return response.data;
  }

  async saveLocation(driverId: number, latitude: number, longitude: number) {
    const response = await this.client.post(`/gps/drivers/${driverId}`, null, {
      params: { latitude, longitude },
    });
    return response.data;
  }
}

export const api = new ApiService();
