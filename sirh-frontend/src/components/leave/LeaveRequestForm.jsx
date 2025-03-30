import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const LeaveRequestForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    reason: '',
  });
  
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch leave balance
        const balanceResponse = await leaveAPI.getLeaveBalance();
        if (balanceResponse?.data?.data) {
          setLeaveBalances(balanceResponse.data.data);
        } else {
          console.warn('Leave balance response structure:', balanceResponse);
          toast.error('Erreur lors de la récupération du solde de congés');
        }

        // Fetch leave types
        const typesResponse = await leaveAPI.getLeaveTypes();
        if (typesResponse?.data?.data) {
          setLeaveTypes(typesResponse.data.data);
        } else {
          console.warn('Leave types response structure:', typesResponse);
          toast.error('Erreur lors de la récupération des types de congés');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const requestData = {
        type: formData.type,
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
        reason: formData.reason
      };

      const response = await leaveAPI.createLeaveRequest(requestData);
      if (response?.data?.status === 200) {
        toast.success('Demande de congé soumise avec succès');
        // Reset form
        setFormData({
          type: '',
          reason: '',
        });
        setDateRange([
          {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
          }
        ]);
      } else {
        throw new Error(response?.data?.message || 'Erreur lors de la soumission de la demande');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error(error.message || 'Erreur lors de la soumission de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demande de Congé</CardTitle>
      </CardHeader>
      <CardContent className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Solde de Congés</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveBalances.map((balance) => (
              <div 
                key={balance.type_conge}
                className="bg-muted p-4 rounded-lg"
                style={{ borderLeft: `4px solid ${balance.couleur || '#666'}` }}
              >
                <p className="text-sm text-muted-foreground">{balance.type_conge}</p>
                <p className="text-2xl font-bold">{balance.jours_restants} jours</p>
                <p className="text-sm text-muted-foreground">
                  Utilisés: {balance.jours_pris} / {balance.total_jours}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de Congé</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de congé" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Période</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white border-gray-200"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span>
                    {format(dateRange[0].startDate, 'dd MMM yyyy', { locale: fr })} - {format(dateRange[0].endDate, 'dd MMM yyyy', { locale: fr })}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="center"
                sideOffset={4}
              >
                <DateRange
                  onChange={item => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  months={2}
                  direction={isMobile ? "vertical" : "horizontal"}
                  locale={fr}
                  minDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Décrivez brièvement la raison de votre demande"
              required
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Soumission en cours...
              </>
            ) : (
              'Soumettre la demande'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm; 