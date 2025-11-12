import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Calendar, Clock, MapPin, X, CheckCircle } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from 'app/interfaces/Booking';


export default function MyServices() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // Filtrar apenas agendamentos ativos (não concluídos nem cancelados)
      const activeBookings = data.filter((b: Booking) => 
        b.status === 'PENDING' || b.status === 'CONFIRMED'
      );
      setBookings(activeBookings);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cancelReason: 'Cancelado pelo cliente',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Erro ao cancelar agendamento');
        return;
      }

      fetchMyBookings();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Erro ao cancelar agendamento');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const canCancel = (scheduledDate: string) => {
    const bookingDate = new Date(scheduledDate);
    const now = new Date();
    const hoursDifference = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Meus Agendamentos</h1>
            <button
              onClick={() => navigate('/service')}
              className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-full font-semibold hover:bg-yellow-500 transition-all"
            >
              Contratar Novo Serviço
            </button>
          </div>

          {showSuccess && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">Agendamento criado com sucesso! Aguarde a confirmação.</p>
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Nenhum agendamento ativo</h3>
              <p className="text-gray-600 mb-6">Você ainda não contratou nenhum serviço</p>
              <button
                onClick={() => navigate('/service')}
                className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-full font-semibold hover:bg-yellow-500 transition-all"
              >
                Ver Serviços Disponíveis
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    {booking.service ? (
                      <img
                        src={booking.service.image}
                        alt={booking.service.title}
                        className="w-full md:w-48 h-48 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-full md:w-48 h-48 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
                        Serviço indisponível
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            {booking.service?.title}
                          </h3>
                          <p className="text-yellow-600 font-medium text-lg">{booking.service?.price}</p>
                        </div>
                        <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-5 h-5" />
                          <span>
                            {new Date(booking.scheduledDate).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <span>
                            {new Date(booking.scheduledDate).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-start gap-3 text-gray-600">
                          <MapPin className="w-5 h-5 mt-0.5" />
                          <span>{booking.address}</span>
                        </div>

                        {booking.notes && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Observações:</p>
                            <p className="text-gray-600">{booking.notes}</p>
                          </div>
                        )}
                      </div>

                      {canCancel(booking.scheduledDate) && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? (
                            <>Cancelando...</>
                          ) : (
                            <>
                              <X className="w-5 h-5" />
                              Cancelar Agendamento
                            </>
                          )}
                        </button>
                      )}

                      {!canCancel(booking.scheduledDate) && (
                        <p className="text-sm text-gray-500">
                           Cancelamento disponível apenas com 24h de antecedência
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}