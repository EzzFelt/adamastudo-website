import React from "react";

type Job = {
  id: number;
  time: string;
  name: string;
  description: string;
  price: string;
  address: string;
  status: "Concluído" | "Pendente";
};

const jobs: Job[] = [
  {
    id: 1,
    time: "9h",
    name: "Maria Aparecida",
    description: "Instalação (prateleira)",
    price: "R$90,00",
    address: "Rua Cristina Caetano Machado 1143",
    status: "Concluído",
  },
  {
    id: 2,
    time: "14h",
    name: "João Silva",
    description: "Reparo elétrico",
    price: "R$150,00",
    address: "Av. Brasil 456",
    status: "Pendente",
  },
  // Add more jobs as needed...
];

export const Table = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Horário</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nome</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Serviço</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Preço</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Endereço</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <tr 
                key={job.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-6 py-5 text-sm text-gray-900 font-medium">
                  {job.time}
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-gray-900">{job.name}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-gray-900">{job.description}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-semibold text-green-600">{job.price}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-gray-600 max-w-xs truncate" title={job.address}>
                    {job.address}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "Concluído" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                      Concluir
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum serviço agendado</h3>
                  <p className="text-sm text-gray-500">Não há serviços programados para este dia.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}