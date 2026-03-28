import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { api } from '../services/api';
import { Driver } from '../types';

export default function VehicleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    yearOfProduction: '',
    loadCapacity: '',
    insuranceExpiry: '',
    inspectionExpiry: '',
    currentMileage: '',
    serviceNotes: '',
    status: 'AVAILABLE',
    assignedDriverId: '',
  });

  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => api.getVehicle(Number(id)),
    enabled: isEdit,
  });

  const { data: drivers } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: () => api.getDrivers(),
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        yearOfProduction: vehicle.yearOfProduction?.toString() || '',
        loadCapacity: vehicle.loadCapacity?.toString() || '',
        insuranceExpiry: vehicle.insuranceExpiry || '',
        inspectionExpiry: vehicle.inspectionExpiry || '',
        currentMileage: vehicle.currentMileage?.toString() || '',
        serviceNotes: vehicle.serviceNotes || '',
        status: vehicle.status,
        assignedDriverId: vehicle.assignedDriverId?.toString() || '',
      });
    }
  }, [vehicle]);

  const createMutation = useMutation({
    mutationFn: api.createVehicle,
    onSuccess: () => navigate('/vehicles'),
    onError: (err: any) => setError(err.response?.data?.message || 'Błąd podczas zapisywania'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateVehicle(Number(id), data),
    onSuccess: () => navigate('/vehicles'),
    onError: (err: any) => setError(err.response?.data?.message || 'Błąd podczas zapisywania'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data = {
      ...formData,
      yearOfProduction: formData.yearOfProduction ? Number(formData.yearOfProduction) : null,
      loadCapacity: formData.loadCapacity ? Number(formData.loadCapacity) : null,
      currentMileage: formData.currentMileage ? Number(formData.currentMileage) : null,
      assignedDriverId: formData.assignedDriverId ? Number(formData.assignedDriverId) : null,
    };

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/vehicles')} sx={{ mr: 2 }}>
          Powrót
        </Button>
        <Typography variant="h4">{isEdit ? 'Edycja pojazdu' : 'Nowy pojazd'}</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Dane podstawowe
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Numer rejestracyjny"
                value={formData.registrationNumber}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="AVAILABLE">Dostępny</MenuItem>
                  <MenuItem value="IN_TRANSIT">W trasie</MenuItem>
                  <MenuItem value="SERVICE">Serwis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Marka"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rok produkcji"
                type="number"
                value={formData.yearOfProduction}
                onChange={(e) => handleChange('yearOfProduction', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ładowność (t)"
                type="number"
                value={formData.loadCapacity}
                onChange={(e) => handleChange('loadCapacity', e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Dokumenty
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data ważności OC"
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => handleChange('insuranceExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data ważności przeglądu"
                type="date"
                value={formData.inspectionExpiry}
                onChange={(e) => handleChange('inspectionExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Serwis
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aktualny przebieg (km)"
                type="number"
                value={formData.currentMileage}
                onChange={(e) => handleChange('currentMileage', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Uwagi serwisowe"
                multiline
                rows={3}
                value={formData.serviceNotes}
                onChange={(e) => handleChange('serviceNotes', e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Przypisanie kierowcy
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kierowca</InputLabel>
                <Select
                  value={formData.assignedDriverId}
                  onChange={(e) => handleChange('assignedDriverId', e.target.value)}
                  label="Kierowca"
                >
                  <MenuItem value="">-- Brak --</MenuItem>
                  {drivers?.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/vehicles')}>
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Zapisz
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
