import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';

export default function HireService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/services/${id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: id,
          scheduledDate: scheduledDateTime.toISOString(),
          address: formData.address,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar agendamento');
      }

      navigate('/my-services?success=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
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
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(`/service/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contratar Serviço</h1>
            <p className="text-gray-600 mb-8">Preencha os dados para agendarmos seu serviço</p>

            <div className="mb-8 p-6 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-4">
                <img src={service.image} alt={service.title} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-yellow-600 font-medium">{service.price}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Data preferida
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Horário preferido
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Endereço completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                  placeholder="Detalhes adicionais sobre o serviço..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold hover:bg-yellow-500 transition-all hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}