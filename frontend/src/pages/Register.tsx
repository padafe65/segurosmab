  // src/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlipFormCard from "../components/FlipFormCard";
import API from "../api/axiosConfig";

export default function Register(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_name: "",
    documento: "",
    email: "",
    user_password: "",
    direccion: "",
    ciudad: "",
    fecha_nacimiento: "",
    telefono: "",
    actividad_empresa: "",
    representante_legal: "",
    // hidden fields:
    isactive: true,
    roles: ["user"],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // backend expects fecha_nacimiento Date or iso string
      const payload = { ...form, fecha_nacimiento: form.fecha_nacimiento || null };
      await API.post("/auth/register", payload);
      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
   

    <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>

           {/* 🔙 BOTÓN PARA VOLVER AL HOME */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginBottom: "20px",
            padding: "10px 20px",
            background: "#636e72",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Volver al Inicio
        </button>


      <FlipFormCard frontImage="/img/registro1.jpg" title="Crear nueva cuenta">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <h2>Registro</h2>

          <label>Nombre</label>
          <input name="user_name" type="text" value={form.user_name} onChange={handleChange} required />

          <label>Documento</label>
          <input name="documento" type="text" value={form.documento} onChange={handleChange} required />

          <label>Correo</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />

          <label>Contraseña</label>
          <input name="user_password" type="password" value={form.user_password} onChange={handleChange} required />

          <label>Dirección</label>
          <input name="direccion" type="text" value={form.direccion} onChange={handleChange} required />

          <label>Ciudad</label>
          <input name="ciudad" type="text" value={form.ciudad} onChange={handleChange} required />

          <label>Fecha de nacimiento</label>
          <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} />

          <label>Teléfono</label>
          <input name="telefono" type="text" value={form.telefono} onChange={handleChange} />

          <label>Actividad Empresa (opcional)</label>
          <input name="actividad_empresa" type="text" value={form.actividad_empresa} onChange={handleChange} />

          <label>Representante legal (opcional)</label>
          <input name="representante_legal" type="text" value={form.representante_legal} onChange={handleChange} />

          {/* hidden enforced */}
          <input type="hidden" name="isactive" value="true" />
          <input type="hidden" name="roles" value={JSON.stringify(["user"])} />

          <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</button>
        </form>
      </FlipFormCard>
    </div>
  );
}
