import React, { useState } from 'react'
import procesosService from '../services/procesosService'

export default function ProcesosTable({ procesos, setProcesos, onProcesosChange }) {
    const [busqueda, setBusqueda] = useState('');
    const [filtroEtapa, setFiltroEtapa] = useState('');
    const [detalleVisible, setDetalleVisible] = useState(null);
    const [actualizando, setActualizando] = useState(null);
    const [eliminando, setEliminando] = useState(null);

    const etapas = ["convocatoria", "preseleccion", "entrevista", "prueba", "seleccionado", "rechazado"];

    const procesosFiltrados = procesos.filter(p => {
        const coincideBusqueda =
            p.nombre_vacante.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.nombre_aspirante.toLowerCase().includes(busqueda.toLowerCase());

        const coincideEtapa = !filtroEtapa || p.etapa === filtroEtapa;

        return coincideBusqueda && coincideEtapa;
    });

    const cambiarEtapa = async (idProceso, nuevaEtapa) => {
        try {
            setActualizando(idProceso);
            const response = await procesosService.update(idProceso, { etapa: nuevaEtapa });

            if (response.success) {
                const listaActualizada = procesos.map(p =>
                    p.id === idProceso ? { ...p, etapa: nuevaEtapa } : p
                );
                setProcesos(listaActualizada);
                if (onProcesosChange) onProcesosChange();
            }
        } catch (error) {
            alert('Error al actualizar la etapa: ' + error.message);
        } finally {
            setActualizando(null);
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este proceso?")) {
            try {
                setEliminando(id);
                const response = await procesosService.delete(id);

                if (response.success) {
                    const listaFiltrada = procesos.filter(p => p.id !== id);
                    setProcesos(listaFiltrada);
                    if (onProcesosChange) onProcesosChange();
                }
            } catch (error) {
                alert('Error al eliminar el proceso: ' + error.message);
            } finally {
                setEliminando(null);
            }
        }
    };

    const obtenerClaseBadge = (etapa) => {
        const colores = {
            'convocatoria': 'badge-convocatoria',
            'preseleccion': 'badge-preseleccion',
            'entrevista': 'badge-entrevista',
            'prueba': 'badge-prueba',
            'seleccionado': 'badge-seleccionado',
            'rechazado': 'badge-rechazado'
        };
        return colores[etapa] || 'badge-default';
    };

    return (
        <div className="seccion">
            <h2>Procesos Registrados</h2>

            <div className="filtros-tabla">
                <div className="filtro-busqueda">
                    <input
                        type="text"
                        placeholder="Buscar por vacante o aspirante..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="input-filtro"
                    />
                </div>

                <div className="filtro-etapa">
                    <select
                        value={filtroEtapa}
                        onChange={(e) => setFiltroEtapa(e.target.value)}
                        className="select-filtro"
                    >
                        <option value="">Todas las etapas</option>
                        {etapas.map(etapa => (
                            <option key={etapa} value={etapa}>
                                {etapa.charAt(0).toUpperCase() + etapa.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="contador-resultados">
                    {procesosFiltrados.length} de {procesos.length} procesos
                </div>
            </div>

            <div className="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>VACANTE</th>
                            <th>ASPIRANTE</th>
                            <th>ETAPA ACTUAL</th>
                            <th>CAMBIAR ETAPA</th>
                            <th>FECHA</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {procesosFiltrados.length === 0 ? (
                            <tr><td colSpan="6" className="sin-datos">
                                {procesos.length === 0 ? 'No hay procesos registrados aún.' : 'No hay procesos que coincidan con los filtros.'}
                            </td></tr>
                        ) : (
                            procesosFiltrados.map(p => (
                                <tr key={p.id}>
                                    <td>{p.nombre_vacante}</td>
                                    <td>{p.nombre_aspirante}</td>
                                    <td>
                                        <span className={`badge ${obtenerClaseBadge(p.etapa)}`}>
                                            {p.etapa}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={p.etapa}
                                            onChange={(e) => cambiarEtapa(p.id, e.target.value)}
                                            className="select-etapa"
                                            disabled={actualizando === p.id}
                                        >
                                            {etapas.map(etapa => (
                                                <option key={etapa} value={etapa}>
                                                    {etapa}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{p.fecha_creacion}</td>
                                    <td>
                                        <button
                                            className="btn-info"
                                            onClick={() => setDetalleVisible(detalleVisible === p.id ? null : p.id)}
                                            disabled={actualizando === p.id || eliminando === p.id}
                                        >
                                            Detalles
                                        </button>
                                        <button
                                            className="btn-peligro"
                                            onClick={() => eliminar(p.id)}
                                            disabled={eliminando === p.id}
                                        >
                                            {eliminando === p.id ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {detalleVisible && (
                <div className="detalle-proceso">
                    {procesosFiltrados.map(p =>
                        p.id === detalleVisible ? (
                            <div key={p.id} className="modal-detalle">
                                <div className="contenido-detalle">
                                    <button
                                        className="btn-cerrar"
                                        onClick={() => setDetalleVisible(null)}
                                    >
                                        ✕
                                    </button>
                                    <h3>Detalles del Proceso</h3>
                                    <div className="info-detalle">
                                        <p><strong>Vacante:</strong> {p.nombre_vacante}</p>
                                        <p><strong>Aspirante:</strong> {p.nombre_aspirante}</p>
                                        <p><strong>Etapa Actual:</strong> <span className={`badge ${obtenerClaseBadge(p.etapa)}`}>{p.etapa}</span></p>
                                        <p><strong>Fecha de Registro:</strong> {p.fecha_creacion}</p>
                                        <p><strong>Observaciones:</strong></p>
                                        <div className="observaciones-detalle">
                                            {p.observaciones || 'No hay observaciones registradas.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
}
