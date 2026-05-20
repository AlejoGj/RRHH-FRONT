import React, { useState, useEffect } from 'react'
import vacantesService from '../services/vacantesService'
import aspirantesService from '../services/aspirantesService'
import procesosService from '../services/procesosService'

export default function ProcesosForm({ onActualizar }) {
    const [form, setForm] = useState({
        id_vacante: '',
        id_aspirante: '',
        etapa: 'convocatoria',
        observaciones: ''
    });

    const [vacantes, setVacantes] = useState([]);
    const [aspirantes, setAspirantes] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [resVacantes, resAspirantes] = await Promise.all([
                vacantesService.getAll(),
                aspirantesService.getAll()
            ]);

            if (resVacantes.success) setVacantes(resVacantes.data);
            if (resAspirantes.success) setAspirantes(resAspirantes.data);
        } catch (error) {
            mostrarMensaje("Error al cargar los datos", "error");
        } finally {
            setCargando(false);
        }
    };

    const manejarCambio = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const mostrarMensaje = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje(''), 3000);
    };

    const registrar = async () => {
        if (!form.id_vacante || !form.id_aspirante) {
            mostrarMensaje("Por favor selecciona una vacante y un aspirante.", "error");
            return;
        }

        try {
            setLoading(true);

            const vacanteEncontrada = vacantes.find(v => v.id === parseInt(form.id_vacante));
            const aspiranteEncontrado = aspirantes.find(a => a.id === parseInt(form.id_aspirante));

            const nombreVacante = vacanteEncontrada ? vacanteEncontrada.titulo : "Vacante eliminada";
            const nombreAspirante = aspiranteEncontrado ? `${aspiranteEncontrado.nombre} ${aspiranteEncontrado.apellido}` : "Aspirante eliminado";

            const response = await procesosService.create({
                id_vacante: parseInt(form.id_vacante),
                id_aspirante: parseInt(form.id_aspirante),
                nombreVacante,
                nombreAspirante,
                etapa: form.etapa,
                observaciones: form.observaciones.trim() || null
            });

            if (response.success) {
                setForm({ id_vacante: '', id_aspirante: '', etapa: 'convocatoria', observaciones: '' });
                mostrarMensaje("Proceso registrado exitosamente.", "exito");
                if (onActualizar) onActualizar();
            } else {
                mostrarMensaje(response.message, "error");
            }
        } catch (error) {
            mostrarMensaje(error.message || "Error al registrar el proceso.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="seccion">
            <h2>📋 Crear Proceso de Selección</h2>
            {mensaje && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

            <div className="formulario">
                {cargando ? (
                    <p>⏳ Cargando datos...</p>
                ) : (
                    <>
                        <div className="campo">
                            <label htmlFor="id_vacante">Vacante *</label>
                            <select
                                id="id_vacante"
                                value={form.id_vacante}
                                onChange={manejarCambio}
                                disabled={loading}
                            >
                                <option value="">-- Selecciona una vacante --</option>
                                {vacantes.map(v => (
                                    <option key={v.id} value={v.id}>{v.titulo} ({v.departamento})</option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="id_aspirante">Aspirante *</label>
                            <select
                                id="id_aspirante"
                                value={form.id_aspirante}
                                onChange={manejarCambio}
                                disabled={loading}
                            >
                                <option value="">-- Selecciona un aspirante --</option>
                                {aspirantes.map(a => (
                                    <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="etapa">Etapa Inicial</label>
                            <select
                                id="etapa"
                                value={form.etapa}
                                onChange={manejarCambio}
                                disabled={loading}
                            >
                                <option value="convocatoria">Convocatoria</option>
                                <option value="preseleccion">Preselección</option>
                                <option value="entrevista">Entrevista</option>
                                <option value="prueba">Prueba</option>
                                <option value="seleccionado">Seleccionado</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </div>

                        <div className="campo completo">
                            <label htmlFor="observaciones">Observaciones</label>
                            <textarea
                                id="observaciones"
                                value={form.observaciones}
                                onChange={manejarCambio}
                                placeholder="Notas sobre el proceso..."
                                disabled={loading}
                            ></textarea>
                        </div>

                        <div className="acciones-formulario">
                            <button type="button" onClick={registrar} className="btn-crear" disabled={loading}>
                                {loading ? 'Creando...' : 'Crear Proceso'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ id_vacante: '', id_aspirante: '', etapa: 'convocatoria', observaciones: '' });
                                }}
                                className="btn-limpiar"
                                disabled={loading}
                            >
                                Limpiar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
