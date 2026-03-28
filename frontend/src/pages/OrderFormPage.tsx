import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { api } from '../services/api';
import { OrderRequest, Driver, Vehicle } from '../types';

const steps = ['Dane podstawowe', 'Trasa', 'Ładunek', 'Przypisanie'];

export default function OrderFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const duplicateOrder = (location.state as any)?.duplicate;

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<OrderRequest>({
    clientName: '',
    clientPhone: '',
    clientReference: '',
    orderNumberInternal: '',
    pickupAddress: '',
    deliveryAddress: '',
    deliveryTimeFrom: '',
    deliveryTimeTo: '',
    weight: undefined,
    notes: '',
    assignedDriverId: undefined,
    assignedVehicleId: undefined,
    plannedDate: new Date().toISOString().split('T')[0],
    sequenceNumber: undefined,
  });

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrder(Number(id)),
    enabled: isEdit,
  });

  const { data: drivers } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: () => api.getDrivers(),
  });

  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(),
  });

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        clientPhone: order.clientPhone,
        clientReference: order.clientReference,
        orderNumberInternal: order.orderNumberInternal,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        deliveryTimeFrom: order.deliveryTimeFrom,
        deliveryTimeTo: order.deliveryTimeTo,
        weight: order.weight,
        notes: order.notes,
        assignedDriverId: order.assignedDriverId,
        assignedVehicleId: order.assignedVehicleId,
        plannedDate: order.plannedDate,
        sequenceNumber: order.sequenceNumber,
      });
    } else if (duplicateOrder) {
      setFormData({
        clientName: duplicateOrder.clientName,
        clientPhone: duplicateOrder.clientPhone,
        clientReference: duplicateOrder.clientReference,
        pickupAddress: duplicateOrder.pickupAddress,
        deliveryAddress: duplicateOrder.deliveryAddress,
        deliveryTimeFrom: duplicateOrder.deliveryTimeFrom,
        deliveryTimeTo: duplicateOrder.deliveryTimeTo,
        weight: duplicateOrder.weight,
        notes: duplicateOrder.notes,
        plannedDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [order, duplicateOrder]);

  const createMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => navigate('/orders'),
    onError: (err: any) => setError(err.response?.data?.message || 'Błąd podczas zapisywania'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: OrderRequest) => api.updateOrder(Number(id), data),
    onSuccess: () => navigate('/orders'),
    onError: (err: any) => setError(err.response?.data?.message || 'Błąd podczas zapisywania'),
  });

  const handleSubmit = () => {
    setError('');
    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof OrderRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numer referencyjny klienta"
                value={formData.clientReference || ''}
                onChange={(e) => handleChange('clientReference', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numer zamówienia"
                value={formData.orderNumberInternal || ''}
                onChange={(e) => handleChange('orderNumberInternal', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Nazwa klienta"
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefon kontaktowy"
                value={formData.clientPhone || ''}
                onChange={(e) => handleChange('clientPhone', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adres odbioru"
                value={formData.pickupAddress || ''}
                onChange={(e) => handleChange('pickupAddress', e.target.value)}
                placeholder="Wprowadź adres odbioru"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Adres dostawy"
                value={formData.deliveryAddress}
                onChange={(e) => handleChange('deliveryAddress', e.target.value)}
                placeholder="Wprowadź adres dostawy"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Godzina od"
                type="time"
                value={formData.deliveryTimeFrom || ''}
                onChange={(e) => handleChange('deliveryTimeFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Godzina do"
                type="time"
                value={formData.deliveryTimeTo || ''}
                onChange={(e) => handleChange('deliveryTimeTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Waga (kg)"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Uwagi do zlecenia"
                multiline
                rows={4}
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data planowana"
                type="date"
                value={formData.plannedDate || ''}
                onChange={(e) => handleChange('plannedDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kierowca</InputLabel>
                <Select
                  value={formData.assignedDriverId || ''}
                  onChange={(e) => handleChange('assignedDriverId', e.target.value || undefined)}
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Pojazd</InputLabel>
                <Select
                  value={formData.assignedVehicleId || ''}
                  onChange={(e) => handleChange('assignedVehicleId', e.target.value || undefined)}
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
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
          Powrót
        </Button>
        <Typography variant="h4">
          {isEdit ? 'Edycja zlecenia' : 'Nowe zlecenie'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>{renderStepContent()}</Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Wstecz
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Zapisz
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Dalej
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
