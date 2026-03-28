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
  Grid,
  Pagination,
  Menu,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  MoreVert,
  FileCopy,
  Print,
  Delete,
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

export default function OrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['orders', statusFilter],
    queryFn: () => api.getOrders(statusFilter ? { status: statusFilter } : undefined),
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      if (confirm('Czy na pewno chcesz usunąć to zlecenie?')) {
        await api.deleteOrder(selectedOrder.id);
        refetch();
      }
    }
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedOrder) {
      navigate('/orders/new', { state: { duplicate: selectedOrder } });
    }
    handleMenuClose();
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      !search ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.clientName.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(search.toLowerCase()) ||
      (order.clientReference && order.clientReference.toLowerCase().includes(search.toLowerCase()));

    const matchesDate = !dateFilter || order.plannedDate === dateFilter;

    return matchesSearch && matchesDate;
  });

  const pageSize = 10;
  const totalPages = Math.ceil((filteredOrders?.length || 0) / pageSize);
  const paginatedOrders = filteredOrders?.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Zlecenia</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/orders/new')}
        >
          Nowe zlecenie
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Szukaj"
              placeholder="Numer, klient, adres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
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
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Data"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button fullWidth variant="outlined" onClick={() => { setSearch(''); setStatusFilter(''); setDateFilter(''); }}>
              Wyczyść
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numer zlecenia</TableCell>
              <TableCell>Klient</TableCell>
              <TableCell>Adres dostawy</TableCell>
              <TableCell>Kierowca</TableCell>
              <TableCell>Okno czasowe</TableCell>
              <TableCell>Waga (kg)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders?.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{order.deliveryAddress}</TableCell>
                <TableCell>{order.assignedDriverName || '-'}</TableCell>
                <TableCell>
                  {order.deliveryTimeFrom && order.deliveryTimeTo
                    ? `${order.deliveryTimeFrom} - ${order.deliveryTimeTo}`
                    : '-'}
                </TableCell>
                <TableCell>{order.weight?.toLocaleString() || '-'}</TableCell>
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
                  <IconButton size="small" onClick={() => navigate(`/orders/${order.id}/edit`)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, order)}>
                    <MoreVert fontSize="small" />
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

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDuplicate}>
          <FileCopy fontSize="small" sx={{ mr: 1 }} />
          Duplikuj
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); window.print(); }}>
          <Print fontSize="small" sx={{ mr: 1 }} />
          Drukuj
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Usuń
        </MenuItem>
      </Menu>
    </Box>
  );
}
