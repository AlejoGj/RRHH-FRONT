import React, { useState } from 'react'
import vacantesService from '../services/vacantesService'

export default function RegistrarVacanteForm({ onActualizar }) {
    const [form, setForm] = useState({ titulo: '', departamento: '', descripcion: '', estado: 'activa', salario: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const manejarCambio = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const registrar = async () => {
        if (!form.titulo.trim() || !form.departamento.trim()) {
            alert("Por favor completa los campos obligatorios (*).");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const datos = {
                titulo: form.titulo,
                departamento: form.departamento,
                descripcion: form.descripcion || null,
                salario: form.salario ? parseFloat(form.salario) : null,
                estado: form.estado
            };

            const response = await vacantesService.create(datos);

            if (response.success) {
                setForm({ titulo: '', departamento: '', descripcion: '', estado: 'activa', salario: '' });
                if (onActualizar) onActualizar();
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message || 'Error al guardar la vacante');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="seccion">
                <h2>Registrar Nueva Vacante</h2>

                {error && (
                    <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}

                <div className="formulario">
                    <div className="campo">
                        <label htmlFor="titulo">Título del Cargo *</label>
                        <input type="text" id="titulo" value={form.titulo} onChange={manejarCambio} placeholder="Ej: Analista" disabled={loading} />
                    </div>
                    <div className="campo">
                        <label htmlFor="departamento">Departamento *</label>
                        <input type="text" id="departamento" value={form.departamento} onChange={manejarCambio} placeholder="Ej: Tecnología" disabled={loading} />
                    </div>
                    <div className="campo">
                        <label htmlFor="salario">Salario</label>
                        <input type="number" id="salario" value={form.salario} onChange={manejarCambio} placeholder="Ej: 2000000" disabled={loading} />
                    </div>
                    <div className="campo completo">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea id="descripcion" value={form.descripcion} onChange={manejarCambio} disabled={loading}></textarea>
                    </div>
                    <div className="campo">
                        <label htmlFor="estado">Estado</label>
                        <select id="estado" value={form.estado} onChange={manejarCambio} disabled={loading}>
                            <option value="activa">Activa</option>
                            <option value="cerrada">Cerrada</option>
                        </select>
                    </div>
                    <div className="acciones-formulario">
                        <button type="button" onClick={registrar} disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Vacante'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}