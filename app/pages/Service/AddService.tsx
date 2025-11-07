import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { Navbar } from '../../components/NavBar/NavBar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';

export default function AddService() {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    warranty: '',
    includes: [''],
    image: '',
  });

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addIncludeField = () => {
    setFormData({ ...formData, includes: [...formData.includes, ''] });
  };

  const removeIncludeField = (index: number) => {
    const newIncludes = formData.includes.filter((_, i) => i !== index);
    setFormData({ ...formData, includes: newIncludes });
  };

  const updateIncludeField = (index: number, value: string) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    setFormData({ ...formData, includes: newIncludes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar serviço');
      }

      navigate('/service');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/service')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Adicionar Novo Serviço</h1>
            <p className="text-gray-600 mb-8">Preencha as informações do novo serviço</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Serviço</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({ ...formData, image: '' });
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-yellow-600 font-medium">Clique para fazer upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="Ex: Instalação (prateleira)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                  placeholder="Descreva o serviço em detalhes..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="R$ 150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duração (minutos)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Garantia</label>
                  <input
                    type="text"
                    required
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="30 dias"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">O que está incluso</label>
                  <button
                    type="button"
                    onClick={addIncludeField}
                    className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar item
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={item}
                        onChange={(e) => updateIncludeField(index, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                        placeholder="Ex: Ferramentas necessárias"
                      />
                      {formData.includes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIncludeField(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold hover:bg-yellow-500 transition-all hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Adicionando...' : 'Adicionar Serviço'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}