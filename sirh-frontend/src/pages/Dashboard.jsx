import { useState, useEffect } from 'react';
import {
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Button } from '../components/common/Button';

const stats = [
  { name: 'Total Employees', icon: UsersIcon, value: 0 },
  { name: 'Total Leave Requests', icon: CalendarIcon, value: 0 },
  { name: 'Pending Requests', icon: ClockIcon, value: 0 },
  { name: 'Approved Requests', icon: CheckCircleIcon, value: 0 },
  { name: 'Rejected Requests', icon: XCircleIcon, value: 0 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    total_employees: 0,
    total_conges: 0,
    en_attente: 0,
    approuvé: 0,
    rejeté: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const response = await api.get('/dashboard');
        if (response.data.status === 200) {
          setData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error.message || 'Failed to load dashboard data. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome to your dashboard. Here's an overview of your HR system.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.name === 'Total Employees' && data.total_employees}
                {stat.name === 'Total Leave Requests' && data.total_conges}
                {stat.name === 'Pending Requests' && data.en_attente}
                {stat.name === 'Approved Requests' && data.approuvé}
                {stat.name === 'Rejected Requests' && data.rejeté}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Leave Request Statistics</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Pending Requests</h3>
                <p className="mt-2 text-3xl font-semibold text-yellow-600">{data.en_attente}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Approved Requests</h3>
                <p className="mt-2 text-3xl font-semibold text-green-600">{data.approuvé}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-800">Rejected Requests</h3>
                <p className="mt-2 text-3xl font-semibold text-red-600">{data.rejeté}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
