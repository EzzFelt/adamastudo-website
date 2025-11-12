import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import type { Service } from 'app/interfaces/Service';

export default function ServiceList() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleServices, setVisibleServices] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/services`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando serviços...</p>
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Soluções completas para sua casa com profissionais qualificados
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Que serviço você procura?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-full border-2 border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors text-lg shadow-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors">
                <Search className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate('/service/add')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Adicionar Serviço
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredServices.slice(0, visibleServices).map((service, index) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold mb-3">{service.title}</h3>
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors">
                    Ver mais
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleServices < filteredServices.length && (
            <div className="text-center">
              <button
                onClick={() => setVisibleServices(prev => prev + 3)}
                className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all font-medium"
              >
                Mostrar mais
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}