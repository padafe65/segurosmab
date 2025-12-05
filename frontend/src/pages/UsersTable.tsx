// src/components/UsersTable.tsx
import React from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function UsersTable({ users, refresh }: { users: any[]; refresh: () => void }) {
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar usuario?")) return;
    try {
      await API.delete(`/users/${id}`);
      alert("Eliminado");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  return (
    <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Documento</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.user_name}</td>
            <td>{u.email}</td>
            <td>{u.documento}</td>
            <td>
              <button onClick={() => navigate(`/admin/users/edit/${u.id}`)}>Editar</button>
              <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 8 }}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
