    import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegistrarVacanteForm from './RegistrarVacanteForm'
import vacantesService from '../services/vacantesService'

vi.mock('../services/vacantesService')

beforeEach(() => {
  vacantesService.create.mockResolvedValue({ success: true })
})

describe('<RegistrarVacanteForm />', () => {

  test('renderiza los campos obligatorios', () => {
    render(<RegistrarVacanteForm onActualizar={vi.fn()} />)
    expect(screen.getByLabelText(/título del cargo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/departamento/i)).toBeInTheDocument()
    expect(screen.getByText(/guardar vacante/i)).toBeInTheDocument()
  })

  test('muestra alerta si se envía sin campos obligatorios', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<RegistrarVacanteForm onActualizar={vi.fn()} />)

    await userEvent.click(screen.getByText(/guardar vacante/i))

    expect(alertMock).toHaveBeenCalledWith(
      'Por favor completa los campos obligatorios (*).'
    )
    alertMock.mockRestore()
  })

  test('llama a vacantesService.create con los datos correctos', async () => {
    render(<RegistrarVacanteForm onActualizar={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/título del cargo/i), 'Desarrollador')
    await userEvent.type(screen.getByLabelText(/departamento/i), 'TI')
    await userEvent.click(screen.getByText(/guardar vacante/i))

    await waitFor(() => {
      expect(vacantesService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: 'Desarrollador',
          departamento: 'TI',
        })
      )
    })
  })

  test('limpia el formulario tras guardar exitosamente', async () => {
    render(<RegistrarVacanteForm onActualizar={vi.fn()} />)

    const inputTitulo = screen.getByLabelText(/título del cargo/i)
    await userEvent.type(inputTitulo, 'Analista')
    await userEvent.type(screen.getByLabelText(/departamento/i), 'RRHH')
    await userEvent.click(screen.getByText(/guardar vacante/i))

    await waitFor(() => {
      expect(inputTitulo.value).toBe('')
    })
  })

  test('llama a onActualizar tras guardar exitosamente', async () => {
    const onActualizar = vi.fn()
    render(<RegistrarVacanteForm onActualizar={onActualizar} />)

    await userEvent.type(screen.getByLabelText(/título del cargo/i), 'Contador')
    await userEvent.type(screen.getByLabelText(/departamento/i), 'Finanzas')
    await userEvent.click(screen.getByText(/guardar vacante/i))

    await waitFor(() => {
      expect(onActualizar).toHaveBeenCalledTimes(1)
    })
  })
})