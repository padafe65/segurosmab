import { useState } from "react";
import API from "../api/axiosConfig";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [nueva, setNueva] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Enviando:", { correo, nueva });

       await API.patch("/usuarios/reset-password", {
        correo,
        nueva,
      });

      setMensaje("✅ Contraseña actualizada. Ya puedes ingresar.");
    } catch (error) {
      setMensaje("❌ Error: " + (error.response?.data?.message || "Intenta nuevamente"));
    }
  };

  return (
    <div className="container-registro">
      <h2>Restablecer contraseña</h2>

      <form onSubmit={handleSubmit} className="form-registro">
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          required
        />

        <button type="submit">Cambiar contraseña</button>
      </form>

      <p>{mensaje}</p>
    </div>
  );
}
