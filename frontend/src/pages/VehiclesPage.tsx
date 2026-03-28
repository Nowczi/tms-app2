import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  LinearProgress,
} from '@mui/material';
import { Add, Visibility, Edit, Warning } from '@mui/icons-material';
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

const getExpiryColor = (status: string) => {
  switch (status) {
    case 'CRITICAL':
    case 'EXPIRED':
      return 'error';
    case 'WARNING':
      return 'warning';
    default:
      return 'success';
  }
};

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles', statusFilter],
    queryFn: () => api.getVehicles(statusFilter ? { status: statusFilter } : undefined),
  });

  const filteredVehicles = vehicles?.filter((vehicle) => {
    const matchesSearch =
      !search ||
      vehicle.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const pageSize = 10;
  const totalPages = Math.ceil((filteredVehicles?.length || 0) / pageSize);
  const paginatedVehicles = filteredVehicles?.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Pojazdy</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/vehicles/new')}>
          Nowy pojazd
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Szukaj"
            placeholder="Rejestracja, marka, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="">Wszystkie</MenuItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => { setSearch(''); setStatusFilter(''); }}>
            Wyczyść
          </Button>
        </Box>
      </Paper>

      {/* Vehicles Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pojazd</TableCell>
              <TableCell>Marka i model</TableCell>
              <TableCell>Kierowca</TableCell>
              <TableCell>Ładowność (t)</TableCell>
              <TableCell>OC</TableCell>
              <TableCell>Przegląd</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVehicles?.map((vehicle) => (
              <TableRow key={vehicle.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {(vehicle.insuranceExpiryStatus === 'CRITICAL' || vehicle.insuranceExpiryStatus === 'EXPIRED') && (
                      <Warning color="error" sx={{ mr: 1 }} fontSize="small" />
                    )}
                    {vehicle.registrationNumber}
                  </Box>
                </TableCell>
                <TableCell>
                  {vehicle.brand} {vehicle.model}
                </TableCell>
                <TableCell>{vehicle.assignedDriverName || '-'}</TableCell>
                <TableCell>{vehicle.loadCapacity || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={vehicle.insuranceExpiry}
                    size="small"
                    color={getExpiryColor(vehicle.insuranceExpiryStatus) as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={vehicle.inspectionExpiry}
                    size="small"
                    color={getExpiryColor(vehicle.inspectionExpiryStatus) as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[vehicle.status]}
                    color={statusColors[vehicle.status] as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
