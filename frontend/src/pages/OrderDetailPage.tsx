import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  ArrowBack,
  LocalShipping,
  LocationOn,
  Schedule,
  Scale,
  Notes,
} from '@mui/icons-material';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

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

const availableStatuses: OrderStatus[] = ['NEW', 'PLANNED', 'IN_PROGRESS', 'DELIVERED', 'PROBLEM', 'CANCELLED'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('NEW');
  const [statusNotes, setStatusNotes] = useState('');

  const { data: order, isLoading, refetch } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => api.getOrder(Number(id)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, notes }: { status: string; notes: string }) =>
      api.updateOrderStatus(Number(id), status, notes),
    onSuccess: () => {
      setStatusDialogOpen(false);
      refetch();
    },
  });

  const handleStatusChange = () => {
    statusMutation.mutate({ status: newStatus, notes: statusNotes });
  };

  const openStatusDialog = () => {
    if (order) {
      setNewStatus(order.status);
      setStatusNotes('');
      setStatusDialogOpen(true);
    }
  };

  if (isLoading || !order) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
            Powrót
          </Button>
          <Typography variant="h4">{order.orderNumber}</Typography>
          <Chip
            label={statusLabels[order.status]}
            color={statusColors[order.status] as any}
            sx={{ ml: 2 }}
          />
        </Box>
        <Box>
          <Button variant="outlined" onClick={openStatusDialog} sx={{ mr: 1 }}>
            Zmień status
          </Button>
          <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/orders/${id}/edit`)}>
            Edytuj
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Order Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dane podstawowe
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Klient
                </Typography>
                <Typography variant="body1">{order.clientName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Telefon
                </Typography>
                <Typography variant="body1">{order.clientPhone || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Numer referencyjny
                </Typography>
                <Typography variant="body1">{order.clientReference || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Numer zamówienia
                </Typography>
                <Typography variant="body1">{order.orderNumberInternal || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trasa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOn sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Adres odbioru
                    </Typography>
                    <Typography variant="body1">{order.pickupAddress || '-'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOn sx={{ mr: 1, mt: 0.5, color: 'error.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Adres dostawy
                    </Typography>
                    <Typography variant="body1">{order.deliveryAddress}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Okno czasowe
                    </Typography>
                    <Typography variant="body1">
                      {order.deliveryTimeFrom && order.deliveryTimeTo
                        ? `${order.deliveryTimeFrom} - ${order.deliveryTimeTo}`
                        : '-'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ładunek
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Scale sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Waga
                    </Typography>
                    <Typography variant="body1">{order.weight ? `${order.weight.toLocaleString()} kg` : '-'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Notes sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Uwagi
                    </Typography>
                    <Typography variant="body1">{order.notes || '-'}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - History and Documents */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Przypisanie
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Kierowca
              </Typography>
              <Typography variant="body1">{order.assignedDriverName || 'Nieprzypisany'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pojazd
              </Typography>
              <Typography variant="body1">{order.assignedVehicleRegistration || 'Nieprzypisany'}</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Historia zdarzeń
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.history?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Chip
                        label={statusLabels[entry.status as OrderStatus] || entry.status}
                        size="small"
                        color={statusColors[entry.status as OrderStatus] as any}
                      />
                    </TableCell>
                    <TableCell>{format(new Date(entry.createdAt), 'dd.MM.yyyy HH:mm', { locale: pl })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {order.podPhotoUrl && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                POD (Proof of Delivery)
              </Typography>
              <img
                src={order.podPhotoUrl}
                alt="POD"
                style={{ width: '100%', borderRadius: 4 }}
              />
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Zmień status zlecenia</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nowy status</InputLabel>
            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} label="Nowy status">
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {statusLabels[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Notatki (opcjonalne)"
            multiline
            rows={3}
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Anuluj</Button>
          <Button variant="contained" onClick={handleStatusChange} disabled={statusMutation.isPending}>
            Zmień status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
