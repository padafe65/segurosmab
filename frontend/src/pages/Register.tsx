import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlipFormCard from "../components/FlipFormCard";

import API from "../api/axiosConfig";


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_name: "",
    isactive: true,
    email: "",
    user_password: "",
    direccion: "",
    ciudad: "",
    fecha_nacimiento: "",
    roles: ["user"]
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/register", form);

    console.log("Respuesta del backend:", response.data);

    alert("Usuario registrado correctamente");

    navigate("/");
  } catch (error: any) {
    console.error("Error al registrar:", error);

    alert(
      error.response?.data?.message ||
      "Error al registrar usuario"
    );
  }
};


  return (
    <>

      <div
        style={{
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
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

        {/* 🃏 TARJETA GIRABLE */}
        <FlipFormCard frontImage="/img/registro1.jpg" title="Crear nueva cuenta">
          <form onSubmit={handleSubmit}>
            <h2>Registro</h2>

            <label>Nombre</label>
            <input name="user_name" type="text" value={form.user_name} onChange={handleChange} required />

            <label>Correo</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />

            <label>Contraseña</label>
            <input name="user_password" type="password" value={form.user_password} onChange={handleChange} required />

            <label>Dirección</label>
            <input name="direccion" type="text" value={form.direccion} onChange={handleChange} required />

            <label>Ciudad</label>
            <input name="ciudad" type="text" value={form.ciudad} onChange={handleChange} required />

            <label>Fecha de nacimiento</label>
            <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} required />

            {/* rol fijo */}
            <input type="hidden" name="roles" value="user" />

            <button type="submit">Registrarse</button>
          </form>
        </FlipFormCard>
      </div>

    </>
  );
}
