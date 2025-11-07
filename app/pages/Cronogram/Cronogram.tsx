import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Phone, User, Edit, CheckCircle, X } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../interfaces/Booking';
import type { EditBookingModalProps } from '../../interfaces/EditBookingModalProps';
import { Navigate } from 'react-router';

export default function Cronogram() {
  const { token, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchWeeklySchedule();
  }, [selectedWeek]);

  const fetchWeeklySchedule = async () => {
    try {
      setLoading(true);
      const startOfWeek = getStartOfWeek(selectedWeek);
      
      const response = await fetch(
        `http://localhost:3001/api/bookings/schedule/weekly?startDate=${startOfWeek.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Erro ao buscar cronograma:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para segunda-feira
    return new Date(d.setDate(diff));
  };

  const getWeekDays = () => {
    const start = getStartOfWeek(selectedWeek);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getBookingsForDay = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduledDate);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };

  const calculateDailyHours = (date: Date) => {
    const dayBookings = getBookingsForDay(date);
    const totalMinutes = dayBookings.reduce((acc, booking) => {
      return acc + (booking.service?.duration || 0) + 40; // duração + intervalo
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const maxHours = isWeekend ? 4 : 11;
    
    return { hours, minutes, maxHours, totalMinutes };
  };

  const nextWeek = () => {
    const next = new Date(selectedWeek);
    next.setDate(next.getDate() + 7);
    setSelectedWeek(next);
  };

  const prevWeek = () => {
    const prev = new Date(selectedWeek);
    prev.setDate(prev.getDate() - 7);
    setSelectedWeek(prev);
  };

  const currentWeek = () => {
    setSelectedWeek(new Date());
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

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
            <p className="mt-4 text-gray-600">Carregando cronograma...</p>
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
            <h1 className="text-4xl font-bold text-gray-900">Cronograma Semanal</h1>
            
            <div className="flex items-center gap-3">
              <button
                onClick={prevWeek}
                className="px-4 py-2 border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                ← Anterior
              </button>
              
              <button
                onClick={currentWeek}
                className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-full font-medium hover:bg-yellow-500 transition-colors"
              >
                Esta Semana
              </button>
              
              <button
                onClick={nextWeek}
                className="px-4 py-2 border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                Próxima →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {getWeekDays().map((day, index) => {
              const dayBookings = getBookingsForDay(day);
              const { hours, minutes, maxHours, totalMinutes } = calculateDailyHours(day);
              const percentage = (totalMinutes / (maxHours * 60)) * 100;
              const isOverLimit = percentage > 100;
              const isToday = 
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${
                    isToday ? 'border-yellow-400' : 'border-transparent'
                  }`}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {getDayName(day)}
                      </h3>
                      {isToday && (
                        <span className="px-2 py-1 bg-yellow-400 text-xs font-medium rounded-full">
                          Hoje
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {day.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Horas trabalhadas</span>
                      <span className={`font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-900'}`}>
                        {hours}h{minutes > 0 && ` ${minutes}min`} / {maxHours}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOverLimit ? 'bg-red-500' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dayBookings.length === 0 ? (
                      <p className="text-center text-sm text-gray-400 py-4">Sem agendamentos</p>
                    ) : (
                      dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setEditingBooking(booking)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900 line-clamp-1">
                                {booking.service?.title}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {new Date(booking.scheduledDate).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                            <User className="w-3 h-3" />
                            <span className="line-clamp-1">{booking.user?.name}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal de Edição */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdate={fetchWeeklySchedule}
          token={token!}
        />
      )}
    </div>
  );
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, onClose, onUpdate, token }) => {
  const [formData, setFormData] = useState({
    scheduledDate: new Date(booking.scheduledDate).toISOString().slice(0, 16),
    address: booking.address,
    notes: booking.notes || '',
    status: booking.status,
    modificationNote: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar agendamento');
      }

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar Agendamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">{booking.service?.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {booking.user?.name}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {booking.user?.phone}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data e Hora
            </label>
            <input
              type="datetime-local"
              required
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
            >
              <option value="PENDING">Pendente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo da Alteração (será notificado ao cliente)
            </label>
            <textarea
              value={formData.modificationNote}
              onChange={(e) => setFormData({ ...formData, modificationNote: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
              placeholder="Ex: Condições climáticas desfavoráveis, necessidade de reagendamento..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações do Cliente
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-yellow-400 text-gray-900 rounded-full font-semibold hover:bg-yellow-500 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};