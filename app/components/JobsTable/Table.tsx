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
  // Add more jobs as needed...
];

export const Table = () => {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px #0002", background: "#fff" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#23223A", color: "#fff" }}>
          <tr>
            <th style={{ padding: "12px" }}>Horário</th>
            <th>Nome</th>
            <th>Serviço</th>
            <th>Preço</th>
            <th>Endereço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} style={{ background: job.status === "Concluído" ? "#FFFBE6" : "#F5F5F5" }}>
              <td>
                <div><strong>Horário</strong></div>
                <div>{job.time}</div>
              </td>
              <td>
                <div><strong>Nome</strong></div>
                <div>{job.name}</div>
              </td>
              <td>
                <div><strong>Serviço</strong></div>
                <div>{job.description}</div>
              </td>
              <td>
                <div><strong>Preço</strong></div>
                <div>{job.price}</div>
              </td>
              <td>
                <div><strong>Endereço</strong></div>
                <div>{job.address}</div>
              </td>
              <td>
                <button
                  style={{
                    background: job.status === "Concluído" ? "#FFE600" : "#23223A",
                    color: job.status === "Concluído" ? "#23223A" : "#fff",
                    border: "none",
                    borderRadius: 16,
                    padding: "4px 16px",
                    fontWeight: "bold",
                  }}
                >
                  {job.status}
                </button>
              </td>
              <td>
                <button style={{ marginRight: 8, background: "#23223A", color: "#fff", border: "none", borderRadius: 8, padding: "4px 12px" }}>
                  Concluir
                </button>
                <button style={{ background: "#FFE600", color: "#23223A", border: "none", borderRadius: 8, padding: "4px 12px" }}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}