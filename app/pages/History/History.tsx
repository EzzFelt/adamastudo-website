import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Filter } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../interfaces/Booking';
import { Navigate } from 'react-router';

export default function History() {
  const { token, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/bookings/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
      COMPLETED: 'bg-green-100 text-green-800 border-green-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando histórico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Histórico de Serviços</h1>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'ALL' ? 'Todos' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Serviço</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Telefone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Endereço</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(booking.scheduledDate).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-gray-500">
                                {new Date(booking.scheduledDate).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{booking.service?.title}</p>
                          <p className="text-sm text-gray-500">{booking.service?.price}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900">{booking.user?.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{booking.user?.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600 max-w-xs truncate">
                              {booking.address}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
