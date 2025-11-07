import { Navbar } from "app/components/NavBar/NavBar"  
import { useState } from "react";
import { Footer } from "~/components/Footer/Footer";
import { Search } from "lucide-react";
import { ServiceCard } from "app/components/Card/JobCard";

export const Service = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const services = [
    { title: 'Montagem (guarda-roupa)', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80' },
    { title: 'Instalação (prateleira)', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80' },
    { title: 'Instalação (vara de cortina)', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80' },
    { title: 'Reparos (portão)', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80' },
    { title: 'Pintura (porta)', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80' },
    { title: 'Reparo (piso)', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80' },
     ];

  const [visibleServices, setVisibleServices] = useState(6);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
    return(
        <div className="min-h-screen flex flex-col">
            <Navbar />
        <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Soluções completas para sua casa com profissionais qualificados
            </p>
          </div>

          {/* Search Bar */}
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredServices.slice(0, visibleServices).map((service, index) => (
              <ServiceCard 
                key={index}
                title={service.title}
                image={service.image}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Load More Button */}
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
    )
}