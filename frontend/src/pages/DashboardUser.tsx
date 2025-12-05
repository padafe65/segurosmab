// src/pages/DashboardUser.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FlipFormCard from "../components/FlipFormCard";
import API from "../api/axiosConfig";

type User = {
  id: number;
  user_name: string;
  documento?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  actividad_empresa?: string;
  representante_legal?: string;
  fecha_nacimiento?: string | null;
};

type Policy = {
  id_policy: number;
  policy_number: string;
  tipo_poliza: string;
  inicio_vigencia?: string | null;
  fin_vigencia?: string | null;
  valor_asegurado?: number | null;
};

export default function DashboardUser(): JSX.Element {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showCard, setShowCard] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  // obtiene id desde token (soporta payload.id_user o payload.id)
  const getUserIdFromToken = useCallback((): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // devuelve número o null
      const id = payload.id_user ?? payload.id ?? null;
      return typeof id === "number" ? id : Number(id) || null;
    } catch {
      return null;
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/auth/getUserExpress", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(data);
      return data;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      // si error crítico, limpiar sesión y redirigir
      // localStorage.clear();
      // navigate("/", { replace: true });
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadPolicies = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      const res = await API.get(`/policies/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPolicies(res.data || []);
    } catch (err) {
      console.error("loadPolicies error", err);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificación inicial de token/rol e initial load (NO renderiza contenido hasta que el usuario pida)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("rol");

    if (!token || role !== "user") {
      navigate("/", { replace: true });
      return;
    }

    const id = getUserIdFromToken();
    if (!id) {
      localStorage.clear();
      navigate("/", { replace: true });
      return;
    }

    // carga básica: traigo usuario (sin mostrar nada aún)
    loadUser().then((data) => {
      // opcional: si quieres cargar pólizas al entrar comenta la línea siguiente
      // if (data?.id) loadPolicies(data.id);
    });
  }, [navigate, getUserIdFromToken, loadUser, loadPolicies]);

  const openProfileCard = async () => {
    // aseguro tener el usuario actualizado
    const latest = await loadUser();
    const u = latest || user;
    if (u) {
      setForm({
        user_name: u.user_name,
        documento: u.documento,
        email: u.email,
        direccion: u.direccion,
        ciudad: u.ciudad,
        telefono: u.telefono,
        actividad_empresa: u.actividad_empresa,
        representante_legal: u.representante_legal,
        fecha_nacimiento: u.fecha_nacimiento
          ? String(u.fecha_nacimiento).substring(0, 10)
          : "",
      });
      setShowPolicies(false);
      setShowCard(true);
    } else {
      alert("No se pudo cargar el perfil.");
    }
  };

  const openPolicies = async () => {
    const id = getUserIdFromToken();
    if (!id) {
      alert("ID de usuario no válido.");
      return;
    }
    await loadPolicies(id);
    setShowCard(false);
    setShowPolicies(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await API.patch(
        "/auth/update",
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Datos actualizados");
      setShowCard(false);
      // recargo usuario
      loadUser();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    }
  };

  return (
    <div className="dashboard" style={{ padding: 20 }}>
      <aside>
        <h2>Panel Usuario</h2>
        <button onClick={openProfileCard}>📄 Mis Datos</button>
        
        <button onClick={openPolicies}>📑 Mis Pólizas</button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          🚪 Salir
        </button>
      </aside>

      <main>
        <header>
          <h4>{user ? `Bienvenido ${user.user_name}` : "Bienvenido"}</h4>
        </header>

        <section style={{ marginTop: 16 }}>
          {/* FlipFormCard */}
          {showCard && (
            <FlipFormCard
              frontImage="/img/pizarra.gif"
              title="Mis Datos / Editar"
              onClose={() => setShowCard(false)}
            >
              <form onSubmit={handleUpdate} style={{ display: "grid", gap: 8 }}>
                <h2>Editar Perfil</h2>

                <label>Nombre</label>
                <input
                  name="user_name"
                  value={form.user_name || ""}
                  onChange={handleChange}
                  required
                />

                <label>Documento</label>
                <input
                  name="documento"
                  value={form.documento || ""}
                  onChange={handleChange}
                />

                <label>Correo</label>
                <input
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  type="email"
                />

                <label>Dirección</label>
                <input
                  name="direccion"
                  value={form.direccion || ""}
                  onChange={handleChange}
                />

                <label>Ciudad</label>
                <input
                  name="ciudad"
                  value={form.ciudad || ""}
                  onChange={handleChange}
                />

                <label>Teléfono</label>
                <input
                  name="telefono"
                  value={form.telefono || ""}
                  onChange={handleChange}
                />

                <label>Actividad Empresa</label>
                <input
                  name="actividad_empresa"
                  value={form.actividad_empresa || ""}
                  onChange={handleChange}
                />

                <label>Representante Legal</label>
                <input
                  name="representante_legal"
                  value={form.representante_legal || ""}
                  onChange={handleChange}
                />

                <label>Fecha Nacimiento</label>
                <input
                  name="fecha_nacimiento"
                  type="date"
                  value={
                    form.fecha_nacimiento
                      ? String(form.fecha_nacimiento).substring(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                />

                <button type="submit">Guardar cambios</button>
              </form>
            </FlipFormCard>
          )}

          {/* Mis Pólizas: se muestra solo cuando se pulsa el botón */}
          {showPolicies && (
            <div style={{ marginTop: 20 }}>
              <h3>Mis Pólizas</h3>
              <table
                border={1}
                cellPadding={8}
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>No. Póliza</th>
                    <th>Tipo</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((p) => (
                    <tr key={p.id_policy}>
                      <td>{p.policy_number}</td>
                      <td>{p.tipo_poliza}</td>
                      <td>
                        {p.inicio_vigencia
                          ? new Date(p.inicio_vigencia).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {p.fin_vigencia
                          ? new Date(p.fin_vigencia).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{p.valor_asegurado ?? "-"}</td>
                      <td>
                        <button onClick={() => navigate(`/policies/${p.id_policy}`)}>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                  {policies.length === 0 && (
                    <tr>
                      <td colSpan={6}>No hay pólizas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
