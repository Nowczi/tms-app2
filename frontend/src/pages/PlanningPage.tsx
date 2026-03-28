import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  Warning,
  Lock,
  Add,
  LocalShipping,
  MyLocation,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { api } from '../services/api';
import { PlanningData, Order } from '../types';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import L from 'leaflet';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const statusColors: Record<string, string> = {
  NEW: 'default',
  PLANNED: 'info',
  IN_PROGRESS: 'warning',
  DELIVERED: 'success',
  PROBLEM: 'error',
  CANCELLED: 'default',
};

const statusLabels: Record<string, string> = {
  NEW: 'Nowe',
  PLANNED: 'Zaplanowane',
  IN_PROGRESS: 'W trakcie',
  DELIVERED: 'Dostarczone',
  PROBLEM: 'Problem',
  CANCELLED: 'Anulowane',
};

export default function PlanningPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showUnassigned, setShowUnassigned] = useState(false);

  const { data: planning, isLoading, refetch } = useQuery<PlanningData>({
    queryKey: ['planning', selectedDate],
    queryFn: () => api.getPlanning(selectedDate),
  });

  const handleAssignOrder = async (orderId: number, driverId: number) => {
    await api.assignDriver(orderId, driverId);
    refetch();
  };

  if (isLoading || !planning) {
    return <LinearProgress />;
  }

  const { drivers, unassignedOrders, driverLocations, conflicts } = planning;

  // Default center (Kraków)
  const defaultCenter: [number, number] = [50.0619, 19.9369];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Planowanie tras
      </Typography>

      {/* Top Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              label="Data"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant={showUnassigned ? 'contained' : 'outlined'}
              onClick={() => setShowUnassigned(!showUnassigned)}
            >
              Zaplanuj zlecenia
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button fullWidth variant="outlined" disabled>
              Optymalizuj trasy
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {conflicts.map((conflict, index) => (
            <Alert key={index} severity={conflict.severity === 'ERROR' || conflict.severity === 'CRITICAL' ? 'error' : 'warning'} sx={{ mb: 1 }}>
              {conflict.message}
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Drivers List */}
        <Grid item xs={12} md={showUnassigned ? 4 : 4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Kierowcy
            </Typography>
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              {drivers.map((driver) => (
                <Accordion key={driver.driverId} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ flexGrow: 1 }}>
                        {driver.driverName}
                        {driver.locked && (
                          <Tooltip title={driver.lockReason}>
                            <Lock color="error" sx={{ ml: 1 }} fontSize="small" />
                          </Tooltip>
                        )}
                      </Typography>
                      <Chip
                        label={`${driver.orders.length} zleceń`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${(driver.weightPercentage ?? 0).toFixed(0)}%`}
                        size="small"
                        color={(driver.weightPercentage ?? 0) > 90 ? 'error' : (driver.weightPercentage ?? 0) > 70 ? 'warning' : 'success'}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Pojazd: {driver.vehicleRegistration || '-'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Godziny: {driver.workingHours}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Waga: {(driver.currentWeight ?? 0).toFixed(0)} / {(driver.maxWeight ?? 0).toFixed(0)} kg
                      </Typography>
                    </Box>
                    {driver.orders.length > 0 ? (
                      driver.orders.map((order, index) => (
                        <Card key={order.id} sx={{ mb: 1 }}>
                          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                                {index + 1}.
                              </Typography>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2">{order.orderNumber}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {order.deliveryAddress}
                                </Typography>
                              </Box>
                              <Chip
                                label={statusLabels[order.status]}
                                size="small"
                                color={statusColors[order.status] as any}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Brak przypisanych zleceń
                      </Typography>
                    )}
                    {showUnassigned && !driver.locked && (
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => {}}
                        sx={{ mt: 1 }}
                      >
                        Dodaj zlecenie
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Middle Column - Unassigned Orders */}
        {showUnassigned && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Nieprzypisane zlecenia
              </Typography>
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {unassignedOrders.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Brak nieprzypisanych zleceń
                  </Typography>
                ) : (
                  unassignedOrders.map((order) => (
                    <Card key={order.id} sx={{ mb: 1 }}>
                      <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="body2">{order.orderNumber}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {order.deliveryAddress}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption">
                            {order.deliveryTimeFrom} - {order.deliveryTimeTo}
                          </Typography>
                          <Typography variant="caption">
                            {order.weight?.toFixed(0)} kg
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          {drivers
                            .filter((d) => !d.locked)
                            .map((driver) => (
                              <Button
                                key={driver.driverId}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                                onClick={() => handleAssignOrder(order.id, driver.driverId)}
                              >
                                {driver.driverName.split(' ')[0]}
                              </Button>
                            ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Right Column - Map */}
        <Grid item xs={12} md={showUnassigned ? 5 : 8}>
          <Paper sx={{ p: 2, height: 600 }}>
            <Typography variant="h6" gutterBottom>
              Mapa tras
            </Typography>
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ height: 'calc(100% - 40px)', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Driver locations */}
              {driverLocations.map((location) => (
                <Marker key={location.id} position={[location.latitude, location.longitude]}>
                  <Popup>
                    <Typography variant="body2">{location.driverName}</Typography>
                    <Typography variant="caption">
                      {location.recordedAt ? format(new Date(location.recordedAt), 'HH:mm', { locale: pl }) : '-'}
                    </Typography>
                  </Popup>
                </Marker>
              ))}
              {/* Delivery points */}
              {drivers.flatMap((driver) =>
                driver.orders.map((order) =>
                  order.deliveryLatitude && order.deliveryLongitude ? (
                    <Marker
                      key={order.id}
                      position={[order.deliveryLatitude, order.deliveryLongitude]}
                      icon={L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background-color: ${order.status === 'NEW' ? '#9e9e9e' : '#ffeb3b'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                      })}
                    >
                      <Popup>
                        <Typography variant="body2">{order.orderNumber}</Typography>
                        <Typography variant="caption">{order.deliveryAddress}</Typography>
                      </Popup>
                    </Marker>
                  ) : null
                )
              )}
            </MapContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
