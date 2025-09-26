import { useState } from "react";
import Logo from "../../../public/adamas_logo.png"
import { Eye, EyeOff } from "lucide-react";
import { Footer } from "~/components/Footer/Footer";
import { FormInput } from "~/components/Form/FormInput";


export const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        'confirm-password': '',
        fullName: '',
        phone: ''
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return(
       <div className="min-h-screen">
            <nav className="p-6">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Adamas Logo" className="h-6 w-auto"/>
                </div>
            </nav>
            
            <main className="flex justify-center items-center px-6 border-t-1 border-gray-800 ml-5 mr-5" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <div className="w-full max-w-md bg-white rounded-2xl p-8 mt-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-start">Crie sua conta</h1>
                    </div>

                    <form className="space-y-5">
                        <div>
                           <FormInput
                                label="Nome"
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Ex: João da Silva"
                                required
                            />
                        </div>

                        <div>
                            <FormInput
                                label="Telefone"
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Ex: (99) 99999-9999"
                                required
                            />
                        </div>     

                        <div>
                            <FormInput
                                label="Email"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Ex: (99) 99999-9999"
                                required
                            />
                        </div> 

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <FormInput
                                    label=""
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Digite sua senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <FormInput
                                    label="Confirmar senha"
                                    type={showPassword ? "text" : "password"}
                                    id="confirm-password"
                                    name="confirm-password"
                                    value={formData["confirm-password"]}
                                    onChange={handleInputChange}
                                    placeholder="Digite sua senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-950 hover:bg-blue-800 text-white font-medium py-3 mt-5 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Criar conta
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Já possui uma conta?{' '}
                        <a 
                            href="#" 
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                            Entre na sua conta →
                        </a>
                    </p>
                </div>
            </main>
          <Footer/>
        </div>
    )
}