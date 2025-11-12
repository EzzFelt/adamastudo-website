import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import type { Service } from 'app/interfaces/Service';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/services/${id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHire = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/service/${id}/hire`);
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

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Serviço não encontrado</h2>
            <button
              onClick={() => navigate('/service')}
              className="text-yellow-600 hover:text-yellow-700"
            >
              Voltar para serviços
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/service')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar aos serviços
          </button>

          <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
            <div className="h-96 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{service.title}</h1>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Preço</p>
                    <p className="font-semibold text-gray-900">{service.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="font-semibold text-gray-900">
                      {Math.floor(service.duration / 60)}h {service.duration % 60 > 0 && `${service.duration % 60}min`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Garantia</p>
                    <p className="font-semibold text-gray-900">{service.warranty}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">O que está incluso</h2>
                <ul className="space-y-3">
                  {service.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleHire}
                className="w-full py-4 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold hover:bg-yellow-500 transition-all hover:shadow-lg"
              >
                Contratar Serviço
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}