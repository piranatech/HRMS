import { useState, useEffect } from 'react';
import { leaveAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function LeaveRequestsList() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await leaveAPI.getMyLeaveRequests();
      if (response?.data?.data) {
        setRequests(response.data.data);
      } else {
        console.warn('Leave requests response structure:', response);
        toast.error('Erreur lors de la récupération des demandes de congés');
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Erreur lors de la récupération des demandes de congés');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'en attente': 'warning',
      'approuvé': 'success',
      'refusé': 'destructive',
      'annulé': 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Historique des Demandes de Congés</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Motif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="capitalize">{request.type_conge}</TableCell>
                <TableCell>{formatDate(request.date_debut)}</TableCell>
                <TableCell>{formatDate(request.date_fin)}</TableCell>
                <TableCell>{request.nombre_jours}</TableCell>
                <TableCell>{getStatusBadge(request.statut)}</TableCell>
                <TableCell className="max-w-xs truncate">{request.motif}</TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune demande de congé trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 