// src/pages/CreatePolicy.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

export default function CreatePolicy(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    policy_number: "",
    tipo_poliza: "",
    inicio_vigencia: "",
    fin_vigencia: "",
    tipo_riesgo: "",
    compania_seguros: "",
    telefono_asistencia: "",
    valor_asegurado: "",
    user_id: "",
    // vehicle fields
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

  // productType decides which extra fields show: "productos" or "autos"
  const [productType, setProductType] = useState<"productos" | "autos">("productos");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s: any) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert numeric fields
      const payload = {
        ...form,
        valor_asegurado: form.valor_asegurado ? Number(form.valor_asegurado) : undefined,
        valor_comercial: form.valor_comercial ? Number(form.valor_comercial) : undefined,
        valor_accesorios: form.valor_accesorios ? Number(form.valor_accesorios) : undefined,
        valor_total_comercial: form.valor_total_comercial ? Number(form.valor_total_comercial) : undefined,
        inicio_vigencia: form.inicio_vigencia,
        fin_vigencia: form.fin_vigencia,
      };
      await API.post("/policies/create", payload);
      alert("Póliza creada");
      navigate("/dashboard-admin");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al crear póliza");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Crear Póliza</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 800 }}>
        <label>Tomador (user_id)</label>
        <input name="user_id" value={form.user_id} onChange={handleChange} required />

        <label>No. Póliza</label>
        <input name="policy_number" value={form.policy_number} onChange={handleChange} required />

        <label>Tipo de póliza</label>
        <input name="tipo_poliza" value={form.tipo_poliza} onChange={handleChange} required />

        <label>Inicio vigencia</label>
        <input name="inicio_vigencia" type="date" value={form.inicio_vigencia} onChange={handleChange} required />

        <label>Fin vigencia</label>
        <input name="fin_vigencia" type="date" value={form.fin_vigencia} onChange={handleChange} required />

        <label>Tipo de cliente</label>
        <select value={productType} onChange={(e) => setProductType(e.target.value as any)}>
          <option value="productos">CLIENTE PRODUCTOS</option>
          <option value="autos">CLIENTE AUTOS</option>
        </select>

        {/* campos comunes opcionales */}
        <label>Tipo riesgo</label>
        <input name="tipo_riesgo" value={form.tipo_riesgo} onChange={handleChange} />

        <label>Compañía seguros</label>
        <input name="compania_seguros" value={form.compania_seguros} onChange={handleChange} />

        <label>Teléfono asistencia</label>
        <input name="telefono_asistencia" value={form.telefono_asistencia} onChange={handleChange} />

        <label>Valor asegurado</label>
        <input name="valor_asegurado" type="number" value={form.valor_asegurado} onChange={handleChange} />

        {/* Si autos -> mostrar campos vehiculares */}
        {productType === "autos" && (
          <>
            <h4>Campos Vehículos</h4>
            <label>Cod Fasecolda</label>
            <input name="cod_fasecolda" value={form.cod_fasecolda} onChange={handleChange} />

            <label>Placa</label>
            <input name="placa" value={form.placa} onChange={handleChange} />

            <label>Tonelaje/Cilindraje/Pasajeros</label>
            <input name="tonelaje_cilindraje_pasajeros" value={form.tonelaje_cilindraje_pasajeros} onChange={handleChange} />

            <label>Departamento/Municipio</label>
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

            <label>No. Chasis</label>
            <input name="numero_chasis" value={form.numero_chasis} onChange={handleChange} />

            <label>Beneficiario</label>
            <input name="beneficiario" value={form.beneficiario} onChange={handleChange} />
          </>
        )}

        <button type="submit">Crear Póliza</button>
      </form>
    </div>
  );
}
