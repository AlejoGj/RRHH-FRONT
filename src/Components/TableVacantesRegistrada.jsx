import React, { useState } from 'react'
import vacantesService from '../services/vacantesService';

export default function TableVacantesRegistrada({ vacantes, setVacantes, onVacantesChange }) {
    const [eliminando, setEliminando] = useState(null);

    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta vacante?")) {
            try {
                setEliminando(id);
                const response = await vacantesService.delete(id);

                if (response.success) {
                    const listaFiltrada = vacantes.filter(v => v.id !== id);
                    setVacantes(listaFiltrada);
                    if (onVacantesChange) onVacantesChange();
                } else {
                    alert('Error al eliminar la vacante: ' + response.message);
                }
            } catch (error) {
                alert('Error al eliminar la vacante: ' + error.message);
            } finally {
                setEliminando(null);
            }
        }
    };

    return (
        <>
        <div className="seccion">
            <h2>Vacantes Registradas</h2>
            <div className="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>Cargo</th>
                            <th>Departamento</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vacantes.length === 0 ? (
                            <tr><td colSpan="5" className="sin-datos">No hay vacantes registradas.</td></tr>
                        ) : (
                            vacantes.map(v => (
                                <tr key={v.id}>
                                    <td>{v.titulo}</td>
                                    <td>{v.departamento}</td>
                                    <td><span className={`badge-${v.estado}`}>{v.estado}</span></td>
                                    <td>{v.fecha}</td>
                                    <td>
                                        <button className="btn-peligro" onClick={() => eliminar(v.id)} disabled={eliminando === v.id}>
                                            {eliminando === v.id ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
  )
}
