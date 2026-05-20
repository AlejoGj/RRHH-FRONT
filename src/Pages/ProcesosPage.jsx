import React, { useState, useEffect } from 'react'
import ProcesosForm from '../Components/ProcesosForm'
import ProcesosTable from '../Components/ProcesosTable'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import procesosService from '../services/procesosService'

export default function ProcesosPage({ user, onLogout }) {
    const [procesos, setProcesos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarProcesos();
    }, []);

    const cargarProcesos = async () => {
        try {
            setLoading(true);
            const response = await procesosService.getAll();
            if (response.success) {
                setProcesos(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Error al cargar procesos');
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
                    <ProcesosForm onActualizar={cargarProcesos} />
                </div>

                <div className="seccion">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando procesos...</p>
                    ) : (
                        <ProcesosTable procesos={procesos} setProcesos={setProcesos} onProcesosChange={cargarProcesos} />
                    )}
                </div>
            </main>

            <Footer />
        </>
    )
}
