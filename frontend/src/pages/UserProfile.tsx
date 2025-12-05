// src/pages/UserProfile.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function UserProfile(): JSX.Element {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id_user;
    (async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setUser(res.data);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [navigate]);

  const handleChange = (e: any) => setForm((s: any) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.patch(`/users/${user.id}`, form);
      alert("Perfil actualizado");
      setEditing(false);
      const res = await API.get(`/users/${user.id}`);
      setUser(res.data);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mi Perfil</h2>
      {!editing && (
        <div>
          <p><b>Nombre:</b> {user.user_name}</p>
          <p><b>Documento:</b> {user.documento}</p>
          <p><b>Email:</b> {user.email}</p>
          <button onClick={() => setEditing(true)}>Editar</button>
        </div>
      )}
      {editing && (
        <form onSubmit={handleSave} style={{ display: "grid", gap: 8, maxWidth: 500 }}>
          <label>Nombre</label>
          <input name="user_name" value={form.user_name} onChange={handleChange} />
          <label>Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} />
          <label>Ciudad</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange} />
          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
        </form>
      )}
    </div>
  );
}
