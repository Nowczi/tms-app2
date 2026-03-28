import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalShipping,
  People,
  Warning,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardData, OrderStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const statusColors: Record<OrderStatus, string> = {
  NEW: 'default',
  PLANNED: 'info',
  IN_PROGRESS: 'warning',
  DELIVERED: 'success',
  PROBLEM: 'error',
  CANCELLED: 'default',
};

const statusLabels: Record<OrderStatus, string> = {
  NEW: 'Nowe',
  PLANNED: 'Zaplanowane',
  IN_PROGRESS: 'W trakcie',
  DELIVERED: 'Dostarczone',
  PROBLEM: 'Problem',
  CANCELLED: 'Anulowane',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
    refetchInterval: 30000,
  });

  if (isLoading || !dashboard) {
    return <LinearProgress />;
  }

  const { kpi, alerts, driverWorkloads, recentOrders, statistics } = dashboard;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="text.secondary" variant="body2">
                  Zlecenia dziś
                </Typography>
              </Box>
              <Typography variant="h4">
                {kpi.ordersTodayCompleted} / {kpi.ordersTodayTotal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                zrealizowanych
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ mr: 1, color: 'warning.main' }} />
                <Typography color="text.secondary" variant="body2">
                  W trakcie
                </Typography>
              </Box>
              <Typography variant="h4">{kpi.ordersInProgress}</Typography>
              <Typography variant="body2" color="text.secondary">
                aktywnych tras
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning sx={{ mr: 1, color: kpi.ordersWithProblem > 0 ? 'error.main' : 'success.main' }} />
                <Typography color="text.secondary" variant="body2">
                  Problemy
                </Typography>
              </Box>
              <Typography variant="h4" color={kpi.ordersWithProblem > 0 ? 'error' : 'inherit'}>
                {kpi.ordersWithProblem}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                zleceń z problemem
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1, color: kpi.availableDrivers > 2 ? 'warning.main' : 'success.main' }} />
                <Typography color="text.secondary" variant="body2">
                  Dostępni kierowcy
                </Typography>
              </Box>
              <Typography variant="h4" color={kpi.availableDrivers > 2 ? 'warning.main' : 'inherit'}>
                {kpi.availableDrivers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                bez zleceń
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts and Driver Workloads */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Alerty i ostrzeżenia
            </Typography>
            {alerts.length === 0 ? (
              <Alert severity="success">
                <AlertTitle>Brak alertów</AlertTitle>
                Wszystko w porządku!
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {alerts.map((alert, index) => (
                  <Alert
                    key={index}
                    severity={alert.severity === 'HIGH' ? 'error' : alert.severity === 'MEDIUM' ? 'warning' : 'info'}
                    sx={{ mb: 1, cursor: alert.link ? 'pointer' : 'default' }}
                    onClick={() => alert.link && navigate(alert.link)}
                  >
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                  </Alert>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Obciążenie kierowców
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {driverWorkloads.map((workload) => (
                <Box key={workload.driverId} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {workload.driverName}
                      {workload.locked && (
                        <Tooltip title={workload.lockReason}>
                          <Warning fontSize="small" color="error" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                        </Tooltip>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workload.completedOrders}/{workload.totalOrders}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={workload.weightPercentage}
                    color={workload.weightPercentage > 90 ? 'error' : workload.weightPercentage > 70 ? 'warning' : 'primary'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {workload.totalWeight.toFixed(0)} kg / {workload.maxWeight.toFixed(0)} kg
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ostatnie zlecenia
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Numer</TableCell>
              <TableCell>Klient</TableCell>
              <TableCell>Adres dostawy</TableCell>
              <TableCell>Kierowca</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{order.deliveryAddress}</TableCell>
                <TableCell>{order.assignedDriverName || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[order.status]}
                    color={statusColors[order.status] as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/orders/${order.id}`)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Statistics Chart */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Statystyki tygodniowe
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statistics.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="orders" fill="#1976d2" name="Zlecenia" />
              <Bar dataKey="problems" fill="#d32f2f" name="Problemy" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Typography variant="body2">
            <strong>Łącznie zleceń:</strong> {statistics.totalOrders}
          </Typography>
          <Typography variant="body2">
            <strong>% na czas:</strong> {statistics.onTimePercentage}%
          </Typography>
          <Typography variant="body2">
            <strong>Problemy:</strong> {statistics.problemCount}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
