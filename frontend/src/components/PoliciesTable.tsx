import React, { useEffect, useState } from "react";
import API from "../api/axios.config";

const PoliciesTable = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const id_user = localStorage.getItem("id_user");
    if (!id_user) return;

    API.get(`/policies/user/${id_user}`)
      .then(res => setPolicies(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container">
      <h2>Mis Pólizas</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(p => (
            <tr key={p.id_policy}>
             <td>{p.tipo_poliza}</td>
             <td>{p.inicio_vigencia}</td>
             <td>{p.fin_vigencia}</td>
             <td>{ new Date(p.fin_vigencia) > new Date() ? "Activa" : "Vencida" }</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoliciesTable;
