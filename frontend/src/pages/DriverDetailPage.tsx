import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import { Edit, ArrowBack, LocalShipping, CalendarToday, Assignment } from '@mui/icons-material';
import { api } from '../services/api';
import { Driver } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

const statusColors: Record<string, string> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  VACATION: 'info',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Aktywny',
  INACTIVE: 'Nieaktywny',
  VACATION: 'Urlop',
};

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: driver, isLoading } = useQuery<Driver>({
    queryKey: ['driver', id],
    queryFn: () => api.getDriver(Number(id)),
  });

  if (isLoading || !driver) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/drivers')} sx={{ mr: 2 }}>
            Powrót
          </Button>
          <Typography variant="h4">{driver.fullName || `${driver.firstName} ${driver.lastName}`}</Typography>
          <Chip
            label={statusLabels[driver.status]}
            color={statusColors[driver.status] as any}
            sx={{ ml: 2 }}
          />
        </Box>
        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/drivers/${id}/edit`)}>
          Edytuj
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Driver Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dane podstawowe
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Telefon
                </Typography>
                <Typography variant="body1">{driver.phone || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{driver.email || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Zatrudnienie
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Pracuje od
                </Typography>
                <Typography variant="body1">
                  {driver.hireDate
                    ? `${driver.hireDate} (${formatDistanceToNow(new Date(driver.hireDate), {
                        locale: pl,
                        addSuffix: false,
                      })}`
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Umowa do
                </Typography>
                <Typography variant="body1">
                  {driver.contractExpiry ? (
                    <Chip
                      label={driver.contractExpiry}
                      size="small"
                      color={
                        driver.contractExpiryStatus === 'CRITICAL' || driver.contractExpiryStatus === 'EXPIRED'
                          ? 'error'
                          : driver.contractExpiryStatus === 'WARNING'
                          ? 'warning'
                          : 'success'
                      }
                    />
                  ) : (
                    '-'
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dokumenty
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Prawo jazdy
                </Typography>
                <Typography variant="body1">
                  {driver.licenseNumber || '-'} (
                  <Chip
                    label={driver.licenseExpiry}
                    size="small"
                    color={
                      driver.licenseExpiryStatus === 'CRITICAL' || driver.licenseExpiryStatus === 'EXPIRED'
                        ? 'error'
                        : driver.licenseExpiryStatus === 'WARNING'
                        ? 'warning'
                        : 'success'
                    }
                  />
                  )
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Badania lekarskie
                </Typography>
                <Typography variant="body1">
                  {driver.medicalExamExpiry ? (
                    <Chip
                      label={driver.medicalExamExpiry}
                      size="small"
                      color={
                        driver.medicalExamExpiryStatus === 'CRITICAL' || driver.medicalExamExpiryStatus === 'EXPIRED'
                          ? 'error'
                          : driver.medicalExamExpiryStatus === 'WARNING'
                          ? 'warning'
                          : 'success'
                      }
                    />
                  ) : (
                    '-'
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {driver.vacationStart && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Urlop
              </Typography>
              <Typography variant="body1">
                {driver.vacationStart} - {driver.vacationEnd}
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Przypisany pojazd
            </Typography>
            {driver.assignedVehicleId ? (
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/vehicles/${driver.assignedVehicleId}`)}
              >
                <Typography variant="body1" color="primary">
                  <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {driver.assignedVehicleRegistration}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Brak przypisanego pojazdu
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statystyki
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Łącznie zleceń
                    </Typography>
                    <Typography variant="h4">{driver.totalOrders || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Problemy
                    </Typography>
                    <Typography variant="h4" color={(driver.problemCount ?? 0) > 0 ? 'error' : 'inherit'}>
                      {driver.problemCount ?? 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Średnio dziennie
                    </Typography>
                    <Typography variant="h4">{(driver.avgOrdersPerDay || 0).toFixed(1)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Staż (dni)
                    </Typography>
                    <Typography variant="h4">{driver.seniorityDays || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
