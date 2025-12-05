// src/pages/DashboardAdmin.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "../App.css";

type User = {
  id: number;
  user_name: string;
  email: string;
  documento?: string;
};

type Policy = any;

export default function DashboardAdmin(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filterUserId, setFilterUserId] = useState<string>("");
  const [filterPolicyNumber, setFilterPolicyNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const loadPolicies = async (params: { user_id?: string; policy_number?: string } = {}) => {
    try {
      setLoading(true);
      const query: any = {};
      if (params.user_id) query.user_id = params.user_id;
      if (params.policy_number) query.policy_number = params.policy_number;
      const res = await API.get("/policies", { params: query });
      setPolicies(res.data || []);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar pólizas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadPolicies();
    // eslint-disable-next-line
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Eliminar usuario?")) return;
    try {
      await API.delete(`/users/${id}`);
      alert("Usuario eliminado");
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  const handleDeletePolicy = async (id: number) => {
    if (!confirm("Eliminar póliza?")) return;
    try {
      await API.delete(`/policies/${id}`);
      alert("Póliza eliminada");
      loadPolicies({ user_id: filterUserId || undefined, policy_number: filterPolicyNumber || undefined });
    } catch (err) {
      console.error(err);
      alert("Error al eliminar póliza");
    }
  };

  const handleSearch = () => {
    loadPolicies({ user_id: filterUserId || undefined, policy_number: filterPolicyNumber || undefined });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Panel Administrador</h2>
      </div>

      <div className="admin-actions">
        <button className="admin-btn" onClick={loadUsers}>Refrescar Usuarios</button>
        <button className="admin-btn" onClick={() => navigate("/admin/users/create")}>Crear Usuario</button>
        <button className="admin-btn" onClick={() => navigate("/admin/policies/create")}>Crear Póliza</button>
      </div>

      <section className="admin-section">
        <h3>Usuarios</h3>

        {loading ? (
          <p className="admin-empty">Cargando...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Documento</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.user_name}</td>
                  <td>{u.email}</td>
                  <td>{u.documento}</td>
                  <td className="row-actions">
                    <button className="edit" onClick={() => navigate(`/admin/users/edit/${u.id}`)}>Editar</button>
                    <button className="delete" onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                    <button className="view" onClick={() => loadPolicies({ user_id: String(u.id) })}>Ver pólizas</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="admin-section">
        <h3>Políticas (CRUD)</h3>

        <div className="admin-filters">
          <input className="admin-input" placeholder="Filtrar por user_id" value={filterUserId} onChange={e => setFilterUserId(e.target.value)} />
          <input className="admin-input" placeholder="Filtrar por policy_number" value={filterPolicyNumber} onChange={e => setFilterPolicyNumber(e.target.value)} />
          <button className="admin-btn" onClick={handleSearch}>Filtrar</button>
          <button className="admin-btn secondary" onClick={() => { setFilterUserId(""); setFilterPolicyNumber(""); loadPolicies(); }}>Quitar filtros</button>
        </div>

        {loading ? <p className="admin-empty">Cargando pólizas...</p> : (
          <table className="admin-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>ID</th><th>No. Póliza</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Valor</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p: any) => (
                <tr key={p.id_policy}>
                  <td>{p.id_policy}</td>
                  <td>{p.policy_number}</td>
                  <td>{p.tipo_poliza}</td>
                  <td>{p.inicio_vigencia ? new Date(p.inicio_vigencia).toLocaleDateString() : "-"}</td>
                  <td>{p.fin_vigencia ? new Date(p.fin_vigencia).toLocaleDateString() : "-"}</td>
                  <td>{p.valor_asegurado ?? "-"}</td>
                  <td className="row-actions">
                    <button className="edit" onClick={() => navigate(`/admin/policies/edit/${p.id_policy}`)}>Editar</button>
                    <button className="delete" onClick={() => handleDeletePolicy(p.id_policy)}>Eliminar</button>
                    <button className="view" onClick={() => navigate(`/policies/${p.id_policy}`)}>Ver</button>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && <tr><td colSpan={7} className="admin-empty">No hay pólizas</td></tr>}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
