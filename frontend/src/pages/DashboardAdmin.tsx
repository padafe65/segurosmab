import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function DashboardAdmin(): JSX.Element {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const res = await API.get("/users"); // asegúrate de exponer /users en backend
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Panel Administrador</h2>
      <button onClick={loadUsers}>Refrescar</button>

      <table style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Documento</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.user_name}</td>
              <td>{u.email}</td>
              <td>{u.documento}</td>
              <td>
                <button onClick={() => alert("Implementar editar")}>Editar</button>
                <button onClick={() => alert("Implementar eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
