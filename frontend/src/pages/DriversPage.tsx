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
import { Driver } from '../types';

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

export default function DriversPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: drivers, isLoading } = useQuery<Driver[]>({
    queryKey: ['drivers', statusFilter],
    queryFn: () => api.getDrivers(statusFilter ? { status: statusFilter } : undefined),
  });

  const filteredDrivers = drivers?.filter((driver) => {
    const matchesSearch =
      !search ||
      driver.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      driver.phone?.includes(search);
    return matchesSearch;
  });

  const pageSize = 10;
  const totalPages = Math.ceil((filteredDrivers?.length || 0) / pageSize);
  const paginatedDrivers = filteredDrivers?.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Kierowcy</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/drivers/new')}>
          Nowy kierowca
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Szukaj"
            placeholder="Imię, nazwisko, telefon..."
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

      {/* Drivers Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kierowca</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Przypisany pojazd</TableCell>
              <TableCell>Prawo jazdy</TableCell>
              <TableCell>Badania lekarskie</TableCell>
              <TableCell>Wygaśnięcie umowy</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDrivers?.map((driver) => (
              <TableRow key={driver.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {driver.licenseExpiryStatus === 'CRITICAL' || driver.licenseExpiryStatus === 'EXPIRED' ? (
                      <Warning color="error" sx={{ mr: 1 }} fontSize="small" />
                    ) : null}
                    {driver.fullName || `${driver.firstName} ${driver.lastName}`}
                  </Box>
                </TableCell>
                <TableCell>{driver.phone || '-'}</TableCell>
                <TableCell>{driver.assignedVehicleRegistration || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={driver.licenseExpiry || '-'}
                    size="small"
                    color={getExpiryColor(driver.licenseExpiryStatus || 'VALID') as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={driver.medicalExamExpiry || '-'}
                    size="small"
                    color={getExpiryColor(driver.medicalExamExpiryStatus || 'VALID') as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={driver.contractExpiry || '-'}
                    size="small"
                    color={getExpiryColor(driver.contractExpiryStatus || 'VALID') as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[driver.status]}
                    color={statusColors[driver.status] as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/drivers/${driver.id}`)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/drivers/${driver.id}/edit`)}>
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
