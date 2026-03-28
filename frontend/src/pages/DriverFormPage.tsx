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
import { Vehicle } from '../types';

export default function DriverFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    status: 'ACTIVE',
    hireDate: '',
    contractExpiry: '',
    licenseNumber: '',
    licenseExpiry: '',
    medicalExamExpiry: '',
    vacationStart: '',
    vacationEnd: '',
    assignedVehicleId: '',
  });

  const { data: driver } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => api.getDriver(Number(id)),
    enabled: isEdit,
  });

  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(),
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.phone || '',
        email: driver.email || '',
        status: driver.status,
        hireDate: driver.hireDate || '',
        contractExpiry: driver.contractExpiry || '',
        licenseNumber: driver.licenseNumber || '',
        licenseExpiry: driver.licenseExpiry || '',
        medicalExamExpiry: driver.medicalExamExpiry || '',
        vacationStart: driver.vacationStart || '',
        vacationEnd: driver.vacationEnd || '',
        assignedVehicleId: driver.assignedVehicleId?.toString() || '',
      });
    }
  }, [driver]);

  const createMutation = useMutation({
    mutationFn: api.createDriver,
    onSuccess: () => navigate('/drivers'),
    onError: (err: any) => setError(err.response?.data?.message || 'Błąd podczas zapisywania'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateDriver(Number(id), data),
    onSuccess: () => navigate('/drivers'),
    onError: (err: any) => setError(err.response?.data?.message || 'Błąd podczas zapisywania'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data = {
      ...formData,
      assignedVehicleId: formData.assignedVehicleId ? Number(formData.assignedVehicleId) : null,
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
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/drivers')} sx={{ mr: 2 }}>
          Powrót
        </Button>
        <Typography variant="h4">{isEdit ? 'Edycja kierowcy' : 'Nowy kierowca'}</Typography>
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
                label="Imię"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nazwisko"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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
                  <MenuItem value="ACTIVE">Aktywny</MenuItem>
                  <MenuItem value="INACTIVE">Nieaktywny</MenuItem>
                  <MenuItem value="VACATION">Urlop</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data zatrudnienia"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleChange('hireDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Dokumenty i uprawnienia
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numer prawa jazdy"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data ważności prawa jazdy"
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => handleChange('licenseExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data ważności badań lekarskich"
                type="date"
                value={formData.medicalExamExpiry}
                onChange={(e) => handleChange('medicalExamExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data wygaśnięcia umowy"
                type="date"
                value={formData.contractExpiry}
                onChange={(e) => handleChange('contractExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Urlop
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Urlop od"
                type="date"
                value={formData.vacationStart}
                onChange={(e) => handleChange('vacationStart', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Urlop do"
                type="date"
                value={formData.vacationEnd}
                onChange={(e) => handleChange('vacationEnd', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Przypisanie pojazdu
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Pojazd</InputLabel>
                <Select
                  value={formData.assignedVehicleId}
                  onChange={(e) => handleChange('assignedVehicleId', e.target.value)}
                  label="Pojazd"
                >
                  <MenuItem value="">-- Brak --</MenuItem>
                  {vehicles?.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/drivers')}>
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
