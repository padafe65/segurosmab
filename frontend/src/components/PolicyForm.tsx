import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

/**
 Props:
  - mode: "create" | "edit"
  - if edit, url has param id
*/
export default function PolicyForm({ mode = "create" }: { mode?: "create" | "edit" }) {
  const navigate = useNavigate();
  const params = useParams();
  const editId = params.id ? Number(params.id) : null;

  const [form, setForm] = useState<any>({
    policy_number: "",
    tipo_poliza: "productos", // opciones: productos | autos
    inicio_vigencia: "",
    fin_vigencia: "",
    tipo_riesgo: "",
    compania_seguros: "",
    telefono_asistencia: "",
    valor_asegurado: "",
    user_id: "",
    // vehicular fields
    cod_fasecolda: "",
    placa: "",
    tonelaje_cilindraje_pasajeros: "",
    departamento_municipio: "",
    valor_comercial: "",
    valor_accesorios: "",
    valor_total_comercial: "",
    modelo: "",
    servicio: "",
    tipo_vehiculo: "",
    numero_motor: "",
    numero_chasis: "",
    beneficiario: "",
  });

  useEffect(() => {
    if (mode === "edit" && editId) loadPolicy(editId);
    // eslint-disable-next-line
  }, [editId]);

  const loadPolicy = async (id: number) => {
    try {
      const res = await API.get(`/policies/${id}`);
      // API returns object with fields, adapt date format to input yyyy-mm-dd
      const data = res.data;
      setForm({
        ...data,
        inicio_vigencia: data.inicio_vigencia ? data.inicio_vigencia.substring(0,10) : "",
        fin_vigencia: data.fin_vigencia ? data.fin_vigencia.substring(0,10) : "",
        user_id: data.user?.id ?? data.user_id ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Error al cargar póliza");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((s: any) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      // cast numeric fields
      if (payload.valor_asegurado === "") delete payload.valor_asegurado;
      if (mode === "create") {
        await API.post("/policies", payload);
        alert("Póliza creada");
      } else {
        await API.patch(`/policies/${editId}`, payload);
        alert("Póliza actualizada");
      }
      navigate("/dashboard-admin");
    } catch (err) {
      console.error(err);
      alert("Error creando/actualizando póliza");
    }
  };

  const isVehiculo = form.tipo_poliza === "autos";

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode === "create" ? "Crear Póliza" : "Editar Póliza"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 800 }}>
        <label>No. Póliza</label>
        <input name="policy_number" value={form.policy_number} onChange={handleChange} required />

        <label>Tipo póliza</label>
        <select name="tipo_poliza" value={form.tipo_poliza} onChange={handleChange}>
          <option value="productos">CLIENTES PRODUCTOS</option>
          <option value="autos">CLIENTES AUTOS</option>
        </select>

        <label>Usuario (id)</label>
        <input name="user_id" value={form.user_id} onChange={handleChange} required />

        <label>Inicio vigencia</label>
        <input name="inicio_vigencia" type="date" value={form.inicio_vigencia} onChange={handleChange} required />

        <label>Fin vigencia</label>
        <input name="fin_vigencia" type="date" value={form.fin_vigencia} onChange={handleChange} required />

        <label>Tipo riesgo</label>
        <input name="tipo_riesgo" value={form.tipo_riesgo} onChange={handleChange} />

        <label>Compañía seguros</label>
        <input name="compania_seguros" value={form.compania_seguros} onChange={handleChange} />

        <label>Teléfono asistencia</label>
        <input name="telefono_asistencia" value={form.telefono_asistencia} onChange={handleChange} />

        <label>Valor asegurado</label>
        <input name="valor_asegurado" type="number" value={form.valor_asegurado} onChange={handleChange} />

        {/* Campos vehiculares solo si tipo_poliza === 'autos' */}
        {isVehiculo && (
          <>
            <h4>Datos Vehículo</h4>

            <label>Cod Fasecolda</label>
            <input name="cod_fasecolda" value={form.cod_fasecolda} onChange={handleChange} />

            <label>Placa</label>
            <input name="placa" value={form.placa} onChange={handleChange} />

            <label>Tonelaje / Cilindraje / Pasajeros</label>
            <input name="tonelaje_cilindraje_pasajeros" value={form.tonelaje_cilindraje_pasajeros} onChange={handleChange} />

            <label>Departamento / Municipio</label>
            <input name="departamento_municipio" value={form.departamento_municipio} onChange={handleChange} />

            <label>Valor comercial</label>
            <input name="valor_comercial" type="number" value={form.valor_comercial} onChange={handleChange} />

            <label>Valor accesorios</label>
            <input name="valor_accesorios" type="number" value={form.valor_accesorios} onChange={handleChange} />

            <label>Valor total comercial</label>
            <input name="valor_total_comercial" type="number" value={form.valor_total_comercial} onChange={handleChange} />

            <label>Modelo</label>
            <input name="modelo" value={form.modelo} onChange={handleChange} />

            <label>Servicio</label>
            <input name="servicio" value={form.servicio} onChange={handleChange} />

            <label>Tipo vehículo</label>
            <input name="tipo_vehiculo" value={form.tipo_vehiculo} onChange={handleChange} />

            <label>No. Motor</label>
            <input name="numero_motor" value={form.numero_motor} onChange={handleChange} />

            <label>No. Chasis / Serie</label>
            <input name="numero_chasis" value={form.numero_chasis} onChange={handleChange} />

            <label>Beneficiario</label>
            <input name="beneficiario" value={form.beneficiario} onChange={handleChange} />
          </>
        )}

        <button type="submit">{mode === "create" ? "Crear" : "Actualizar"}</button>
      </form>
    </div>
  );
}

