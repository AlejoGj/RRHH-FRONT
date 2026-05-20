import React, { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import html2pdf from 'html2pdf.js'
import vacantesService from '../services/vacantesService'
import aspirantesService from '../services/aspirantesService'
import procesosService from '../services/procesosService'
import './Dashboard.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function Dashboard() {
  const [stats, setStats] = useState({
    vacantesActivas: 0,
    vacanteCerradas: 0,
    totalAspirantes: 0,
    procesosActivos: 0,
    procesosCompletados: 0,
    aspirantesPorProceso: 0,
  })

  const [vacantes, setVacantes] = useState([])
  const [aspirantes, setAspirantes] = useState([])
  const [procesos, setProcesos] = useState([])
  const [vacantePorCargo, setVacantePorCargo] = useState({})
  const [cargando, setCargando] = useState(true)
  const dashboardRef = useRef(null)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setCargando(true)
      const [resVacantes, resAspirantes, resProcesos] = await Promise.all([
        vacantesService.getAll(),
        aspirantesService.getAll(),
        procesosService.getAll()
      ])

      const vacantesData = resVacantes.success ? resVacantes.data : []
      const aspirantesData = resAspirantes.success ? resAspirantes.data : []
      const procesosData = resProcesos.success ? resProcesos.data : []

      const vacantesActivas = vacantesData.filter(
        (v) => v.estado === 'activa'
      ).length
      const vacanteCerradas = vacantesData.filter(
        (v) => v.estado === 'cerrada'
      ).length

      // Corregido: usar 'etapa' en lugar de 'estado' para procesos
      const procesosActivos = procesosData.filter(
        (p) => ['convocatoria', 'preseleccion', 'entrevista', 'prueba'].includes(p.etapa)
      ).length

      const procesosCompletados = procesosData.filter(
        (p) => p.etapa === 'seleccionado'
      ).length

      const cargoCounts = {}
      vacantesData.forEach((v) => {
        cargoCounts[v.titulo] = (cargoCounts[v.titulo] || 0) + 1
      })

      const aspirantesPorProceso = procesosData.length

      setStats({
        vacantesActivas,
        vacanteCerradas,
        totalAspirantes: aspirantesData.length,
        procesosActivos,
        procesosCompletados,
        aspirantesPorProceso,
      })

      setVacantes(vacantesData)
      setAspirantes(aspirantesData)
      setProcesos(procesosData)
      setVacantePorCargo(cargoCounts)
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    } finally {
      setCargando(false)
    }
  }

  const tasaConversion =
    stats.totalAspirantes > 0
      ? Math.round((stats.procesosCompletados / stats.totalAspirantes) * 100)
      : 0

  // Exportar a PDF
  const exportarPDF = () => {
    const element = dashboardRef.current
    const opt = {
      margin: 10,
      filename: `Dashboard_RRHH_${new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
    }
    html2pdf().set(opt).from(element).save()
  }

  // Datos para gráfico de vacantes por cargo
  const cargosLabels = Object.keys(vacantePorCargo)
  const cargosData = Object.values(vacantePorCargo)

  const chartCargos = {
    labels: cargosLabels.length > 0 ? cargosLabels : ['Sin datos'],
    datasets: [
      {
        label: 'Vacantes por Cargo',
        data: cargosData.length > 0 ? cargosData : [0],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#ff6b6b',
          '#feca57',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  // Datos para gráfico de procesos (corregido: usar 'etapa')
  const estadoProcesos = {
    activos: 0,
    seleccionados: 0,
    rechazados: 0,
  }

  procesos.forEach((p) => {
    const etapa = p.etapa || 'convocatoria'
    if (['convocatoria', 'preseleccion', 'entrevista', 'prueba'].includes(etapa)) {
      estadoProcesos.activos++
    } else if (etapa === 'seleccionado') {
      estadoProcesos.seleccionados++
    } else if (etapa === 'rechazado') {
      estadoProcesos.rechazados++
    }
  })

  const chartProcesos = {
    labels: ['Activos', 'Seleccionados', 'Rechazados'],
    datasets: [
      {
        label: 'Procesos por Estado',
        data: [
          estadoProcesos.activos,
          estadoProcesos.seleccionados,
          estadoProcesos.rechazados,
        ],
        backgroundColor: ['#f39c12', '#27ae60', '#e74c3c'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  // Datos para gráfico de aspirantes vs vacantes
  const chartComparacion = {
    labels: ['Vacantes', 'Aspirantes'],
    datasets: [
      {
        label: 'Cantidad',
        data: [vacantes.length, aspirantes.length],
        backgroundColor: ['#667eea', '#e74c3c'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 20,
        },
      },
    },
  }

  const barOptions = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  if (cargando) {
    return (
      <div className="dashboard-container">
        <p style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
          ⏳ Cargando estadísticas...
        </p>
      </div>
    )
  }

  return (
    <div ref={dashboardRef} className="dashboard-container">
      {/* Header con botón de exportar */}
      <div className="dashboard-header-top">
        <div className="dashboard-header">
          <h1>📊 Panel de Control - Estadísticas RRHH</h1>
          <p>Resumen en tiempo real de tu proceso de selección</p>
        </div>
        <button className="btn-exportar" onClick={exportarPDF}>
          📥 Exportar PDF
        </button>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card activas">
          <div className="kpi-icon">📋</div>
          <div className="kpi-content">
            <p className="kpi-label">Vacantes Activas</p>
            <p className="kpi-value">{stats.vacantesActivas}</p>
            <p className="kpi-sublabel">{stats.vacanteCerradas} cerradas</p>
          </div>
        </div>

        <div className="kpi-card aspirantes">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <p className="kpi-label">Total Aspirantes</p>
            <p className="kpi-value">{stats.totalAspirantes}</p>
            <p className="kpi-sublabel">{stats.aspirantesPorProceso} en procesos</p>
          </div>
        </div>

        <div className="kpi-card procesos">
          <div className="kpi-icon">⚙️</div>
          <div className="kpi-content">
            <p className="kpi-label">Procesos Activos</p>
            <p className="kpi-value">{stats.procesosActivos}</p>
            <p className="kpi-sublabel">{stats.procesosCompletados} completados</p>
          </div>
        </div>

        <div className="kpi-card tasa">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <p className="kpi-label">Tasa Conversión</p>
            <p className="kpi-value">{tasaConversion}%</p>
            <p className="kpi-sublabel">Aspirantes → Contratados</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dashboard-content">
        {/* Gráfico Pastel - Vacantes por Cargo */}
        <section className="dashboard-section">
          <h2>🎯 Vacantes por Cargo</h2>
          <div className="chart-container pie-chart">
            {cargosLabels.length > 0 ? (
              <Pie data={chartCargos} options={chartOptions} />
            ) : (
              <p className="empty-state">No hay vacantes registradas</p>
            )}
          </div>
        </section>

        {/* Gráfico Pastel - Estado de Procesos */}
        <section className="dashboard-section">
          <h2>📊 Estado de Procesos</h2>
          <div className="chart-container pie-chart">
            {procesos.length > 0 ? (
              <Pie data={chartProcesos} options={chartOptions} />
            ) : (
              <p className="empty-state">No hay procesos registrados</p>
            )}
          </div>
        </section>

        {/* Gráfico Barras - Comparación */}
        <section className="dashboard-section">
          <h2>📊 Comparación: Vacantes vs Aspirantes</h2>
          <div className="chart-container bar-chart">
            <Bar data={chartComparacion} options={barOptions} />
          </div>
        </section>

        {/* Tabla Vacantes */}
        <section className="dashboard-section full-width">
          <h2>📋 Últimas Vacantes Registradas</h2>
          <div className="table-responsive">
            {vacantes.length > 0 ? (
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Cargo</th>
                    <th>Departamento</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {vacantes.slice(0, 8).map((v) => (
                    <tr key={v.id}>
                      <td>
                        <strong>{v.titulo}</strong>
                      </td>
                      <td>{v.departamento}</td>
                      <td>
                        <span className={`badge badge-${v.estado}`}>
                          {v.estado}
                        </span>
                      </td>
                      <td>{v.fecha}</td>
                      <td className="desc-cell">
                        {v.descripcion
                          ? v.descripcion.substring(0, 30) + '...'
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No hay vacantes registradas aún</p>
            )}
          </div>
        </section>

        {/* Tabla Aspirantes */}
        <section className="dashboard-section full-width">
          <h2>👤 Últimos Aspirantes Registrados</h2>
          <div className="table-responsive">
            {aspirantes.length > 0 ? (
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Perfil</th>
                  </tr>
                </thead>
                <tbody>
                  {aspirantes.slice(0, 8).map((a) => (
                    <tr key={a.id || a.email}>
                      <td>
                        <strong>
                          {a.nombre} {a.apellido}
                        </strong>
                      </td>
                      <td>{a.email}</td>
                      <td>{a.telefono || '-'}</td>
                      <td className="desc-cell">
                        {a.perfil ? a.perfil.substring(0, 30) + '...' : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No hay aspirantes registrados aún</p>
            )}
          </div>
        </section>

        {/* Tabla Procesos */}
        <section className="dashboard-section full-width">
          <h2>⚙️ Procesos Activos de Selección</h2>
          <div className="table-responsive">
            {procesos.length > 0 ? (
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Puntuación</th>
                  </tr>
                </thead>
                <tbody>
                  {procesos.slice(0, 8).map((p, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <span className={`badge badge-${p.estado || 'pendiente'}`}>
                          {p.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td>{p.fecha || new Date().toLocaleDateString()}</td>
                      <td>{p.puntuacion ? `${p.puntuacion}/100` : 'Sin calificar'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No hay procesos registrados aún</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
