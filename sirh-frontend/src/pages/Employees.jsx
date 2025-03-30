import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { employeeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/common/Table';
import { Badge } from '../components/common/Badge';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    date_embauche: '',
    statut: 'actif'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeAPI.create(newEmployee);
      toast.success('Employee added successfully');
      setIsModalOpen(false);
      setNewEmployee({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        poste: '',
        date_embauche: '',
        statut: 'actif'
      });
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to add employee');
      console.error('Error adding employee:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all employees in your organization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {`${employee.prenom} ${employee.nom}`}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.telephone}</TableCell>
                      <TableCell>{employee.poste}</TableCell>
                      <TableCell>
                        <Badge variant={employee.statut === 'actif' ? 'success' : 'destructive'}>
                          {employee.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="prenom"
              value={newEmployee.prenom}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="nom"
              value={newEmployee.nom}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={newEmployee.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Phone"
            type="tel"
            name="telephone"
            value={newEmployee.telephone}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Position"
            name="poste"
            value={newEmployee.poste}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Hire Date"
            type="date"
            name="date_embauche"
            value={newEmployee.date_embauche}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Status"
            name="statut"
            value={newEmployee.statut}
            onChange={handleInputChange}
            required
          >
            <option value="actif">Active</option>
            <option value="inactif">Inactive</option>
          </Select>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 