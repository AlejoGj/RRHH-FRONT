import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProcesosTable from './ProcesosTable'
import procesosService from '../services/procesosService'

vi.mock('../services/procesosService')

const procesosMock = [
  { id: 1, nombre_vacante: 'Desarrollador', nombre_aspirante: 'Juan Pérez', etapa: 'convocatoria', fecha_creacion: '2024-01-01', observaciones: '' },
  { id: 2, nombre_vacante: 'Analista', nombre_aspirante: 'Ana López', etapa: 'entrevista', fecha_creacion: '2024-01-02', observaciones: 'Buena candidata' },
  { id: 3, nombre_vacante: 'Contador', nombre_aspirante: 'Carlos Gómez', etapa: 'seleccionado', fecha_creacion: '2024-01-03', observaciones: '' },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('<ProcesosTable />', () => {

  test('renderiza todos los procesos', () => {
    render(<ProcesosTable procesos={procesosMock} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)
    expect(screen.getByText('Desarrollador')).toBeInTheDocument()
    expect(screen.getByText('Ana López')).toBeInTheDocument()
    expect(screen.getByText('Contador')).toBeInTheDocument()
  })

  test('muestra mensaje cuando no hay procesos', () => {
    render(<ProcesosTable procesos={[]} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)
    expect(screen.getByText(/no hay procesos registrados/i)).toBeInTheDocument()
  })

  test('filtra por texto de búsqueda', async () => {
    render(<ProcesosTable procesos={procesosMock} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText(/buscar por vacante/i), 'Juan')

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.queryByText('Ana López')).not.toBeInTheDocument()
  })

  test('filtra por etapa', async () => {
    render(<ProcesosTable procesos={procesosMock} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)

    // Apuntamos específicamente al select de filtro por su clase
    const selectFiltro = document.querySelector('.select-filtro')
    await userEvent.selectOptions(selectFiltro, 'entrevista')

    expect(screen.getByText('Ana López')).toBeInTheDocument()
    expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument()
  })

  test('elimina un proceso al confirmar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    procesosService.delete.mockResolvedValue({ success: true })

    render(<ProcesosTable procesos={procesosMock} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)

    await userEvent.click(screen.getAllByText(/eliminar/i)[0])

    await waitFor(() => {
      expect(procesosService.delete).toHaveBeenCalledWith(1)
    })
  })

  test('no elimina si el usuario cancela el confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<ProcesosTable procesos={procesosMock} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)

    await userEvent.click(screen.getAllByText(/eliminar/i)[0])

    expect(procesosService.delete).not.toHaveBeenCalled()
  })

  test('muestra el contador de resultados', () => {
    render(<ProcesosTable procesos={procesosMock} setProcesos={vi.fn()} onProcesosChange={vi.fn()} />)
    expect(screen.getByText(/3 de 3 procesos/i)).toBeInTheDocument()
  })
})