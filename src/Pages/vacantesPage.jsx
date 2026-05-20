import React, { useState, useEffect } from 'react'
import RegistrarVacanteForm from '../Components/RegistrarVacanteForm'
import TableVacantesRegistrada from '../Components/TableVacantesRegistrada'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import vacantesService from '../services/vacantesService'

export default function VacantesPage({ user, onLogout }) {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarVacantes();
    }, []);

    const cargarVacantes = async () => {
        try {
            setLoading(true);
            const response = await vacantesService.getAll();
            if (response.success) {
                setVacantes(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Error al cargar vacantes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar user={user} onLogout={onLogout} />

            {error && (
                <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <main className="contenedor-principal">
                <div className="seccion">
                    <RegistrarVacanteForm onActualizar={cargarVacantes} />
                </div>

                <div className="seccion">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando vacantes...</p>
                    ) : (
                        <TableVacantesRegistrada vacantes={vacantes} setVacantes={setVacantes} onVacantesChange={cargarVacantes} />
                    )}
                </div>
            </main>

            <Footer />
        </>
    )
}