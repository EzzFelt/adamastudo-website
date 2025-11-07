import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Booking } from '../../interfaces/Booking';
import { useAuth } from '../../context/AuthContext';

export const NotificationModal: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const [modifiedBookings, setModifiedBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token || isAdmin) return;

    const checkModifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/bookings/modified', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.length > 0) {
          setModifiedBookings(data);
          setShowModal(true);
        }
      } catch (error) {
        console.error('Erro ao verificar modificações:', error);
      }
    };

    checkModifications();
    const interval = setInterval(checkModifications, 60000); // Verificar a cada 1 minuto

    return () => clearInterval(interval);
  }, [token, isAdmin]);

  const handleMarkAsRead = async (bookingId: string) => {
    try {
      await fetch(`http://localhost:3001/api/bookings/${bookingId}/notified`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setModifiedBookings(prev => prev.filter(b => b.id !== bookingId));
      
      if (modifiedBookings.length === 1) {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  if (!showModal || modifiedBookings.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Alterações nos seus serviços</h2>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {modifiedBookings.map((booking) => (
            <div key={booking.id} className="p-6 border-2 border-yellow-200 rounded-xl bg-yellow-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{booking.service?.title}</h3>
                  <p className="text-sm text-gray-600">
                    Nova data: {new Date(booking.scheduledDate).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm font-medium rounded-full">
                  Modificado
                </span>
              </div>

              {booking.modificationNote && (
                <div className="mb-4 p-4 bg-white rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Motivo da alteração:</p>
                  <p className="text-gray-600">{booking.modificationNote}</p>
                </div>
              )}

              <button
                onClick={() => handleMarkAsRead(booking.id)}
                className="w-full py-2 bg-yellow-400 text-gray-900 rounded-full font-medium hover:bg-yellow-500 transition-colors"
              >
                Marcar como lido
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};