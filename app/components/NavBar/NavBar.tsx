import { useAuth } from "../../context/AuthContext";
import Logo from "../../../public/adamas_logo.png";
import { Link, useLocation } from "react-router";

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Links da Esquerda */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-8" src={Logo} alt="Adamas Tudo Logo" />
            </Link>
            
            {/* Links de Navegação - Visíveis para todos */}
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink("/") 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/service" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink("/services") 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Serviços
              </Link>
              
              {/* Links específicos para admin */}
              {isAdmin && (
                <>
                  <Link 
                    to="/cronogram" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveLink("/cronogram") 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    Cronograma
                  </Link>
                  <Link 
                    to="/history" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveLink("/history") 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    Histórico
                  </Link>
                </>
              )}
              
              {/* Links específicos para usuários comuns logados */}
              {isAuthenticated && !isAdmin && (
                <Link 
                  to="/my-services" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveLink("/my-services") 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Meus Serviços
                </Link>
              )}
            </div>
          </div>

          {/* Lado Direito - Estado de Autenticação */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Usuário Logado
              <div className="flex items-center space-x-4">
                {/* Admin Badge */}
                {isAdmin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ADMIN
                  </span>
                )}
                
                {/* Nome do Usuário */}
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-gray-900">
                    Olá, {user?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isAdmin ? "Administrador" : "Cliente"}
                  </span>
                </div>
                
                {/* Dropdown Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border">
                    {isAdmin ? (
                      // Menu Admin
                      <>
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard Admin
                        </Link>
                        <Link 
                          to="/admin/users" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Gerenciar Usuários
                        </Link>
                        <Link 
                          to="/admin/reports" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Relatórios
                        </Link>
                        <div className="border-t my-1"></div>
                      </>
                    ) : (
                      // Menu Usuário Comum
                      <>
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Meu Perfil
                        </Link>
                        <Link 
                          to="/my-orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Meus Pedidos
                        </Link>
                        <div className="border-t my-1"></div>
                      </>
                    )}
                    
                    {/* Logout - comum para ambos */}
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Usuário Não Logado
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}