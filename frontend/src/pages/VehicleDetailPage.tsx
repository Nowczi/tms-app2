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
  LinearProgress,
} from '@mui/material';
import { Edit, ArrowBack, Person, Speed } from '@mui/icons-material';
import { api } from '../services/api';
import { Vehicle } from '../types';

const statusColors: Record<string, string> = {
  AVAILABLE: 'success',
  IN_TRANSIT: 'warning',
  SERVICE: 'error',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Dostępny',
  IN_TRANSIT: 'W trasie',
  SERVICE: 'Serwis',
};

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading } = useQuery<Vehicle>({
    queryKey: ['vehicle', id],
    queryFn: () => api.getVehicle(Number(id)),
  });

  if (isLoading || !vehicle) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/vehicles')} sx={{ mr: 2 }}>
            Powrót
          </Button>
          <Typography variant="h4">{vehicle.registrationNumber}</Typography>
          <Chip
            label={statusLabels[vehicle.status]}
            color={statusColors[vehicle.status] as any}
            sx={{ ml: 2 }}
          />
        </Box>
        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/vehicles/${id}/edit`)}>
          Edytuj
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Vehicle Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dane podstawowe
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Marka
                </Typography>
                <Typography variant="body1">{vehicle.brand || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="body1">{vehicle.model || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Rok produkcji
                </Typography>
                <Typography variant="body1">{vehicle.yearOfProduction || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Ładowność
                </Typography>
                <Typography variant="body1">{vehicle.loadCapacity ? `${vehicle.loadCapacity} t` : '-'}</Typography>
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
                  OC
                </Typography>
                <Typography variant="body1">
                  {vehicle.insuranceExpiry ? (
                    <Chip
                      label={vehicle.insuranceExpiry}
                      size="small"
                      color={
                        vehicle.insuranceExpiryStatus === 'CRITICAL' || vehicle.insuranceExpiryStatus === 'EXPIRED'
                          ? 'error'
                          : vehicle.insuranceExpiryStatus === 'WARNING'
                          ? 'warning'
                          : 'success'
                      }
                    />
                  ) : (
                    '-'
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Przegląd techniczny
                </Typography>
                <Typography variant="body1">
                  {vehicle.inspectionExpiry ? (
                    <Chip
                      label={vehicle.inspectionExpiry}
                      size="small"
                      color={
                        vehicle.inspectionExpiryStatus === 'CRITICAL' || vehicle.inspectionExpiryStatus === 'EXPIRED'
                          ? 'error'
                          : vehicle.inspectionExpiryStatus === 'WARNING'
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

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Serwis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Aktualny przebieg
                </Typography>
                <Typography variant="body1">
                  {vehicle.currentMileage ? `${vehicle.currentMileage.toLocaleString()} km` : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Uwagi serwisowe
                </Typography>
                <Typography variant="body1">{vehicle.serviceNotes || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Przypisany kierowca
            </Typography>
            {vehicle.assignedDriverId ? (
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/drivers/${vehicle.assignedDriverId}`)}
              >
                <Typography variant="body1" color="primary">
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {vehicle.assignedDriverName}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Brak przypisanego kierowcy
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statystyki
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Łącznie km przejechanych
                    </Typography>
                    <Typography variant="h4">
                      <Speed sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {(vehicle.totalKm || 0).toLocaleString()} km
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Łącznie kosztów serwisu
                    </Typography>
                    <Typography variant="h4">
                      {(vehicle.totalServiceCost || 0).toLocaleString()} PLN
                    </Typography>
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
