import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import authService from '../services/authService'

vi.mock('../services/authService')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

const renderLogin = (onLogin = vi.fn()) => {
  render(
    <MemoryRouter>
      <LoginPage onLogin={onLogin} user={null} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('<LoginPage />', () => {

  test('renderiza el formulario correctamente', () => {
    renderLogin()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar al sistema/i })).toBeInTheDocument()
  })

  test('muestra error si el correo es inválido', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'correo-invalido')
    await userEvent.tab()
    expect(await screen.findByText(/ingresa un correo electrónico válido/i)).toBeInTheDocument()
  })

  test('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123')
    await userEvent.tab()
    expect(await screen.findByText(/al menos 8 caracteres/i)).toBeInTheDocument()
  })

  test('muestra error si se envía el formulario vacío', async () => {
    renderLogin()
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))
    expect(await screen.findByText(/el correo electrónico es obligatorio/i)).toBeInTheDocument()
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument()
  })

  test('llama a authService.login con los datos correctos', async () => {
    authService.login.mockResolvedValue({
      success: true,
      data: { token: 'abc123', user: { nombre: 'Juan' } }
    })
    renderLogin()

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('juan@test.com', 'password123')
    })
  })

  test('muestra mensaje de bienvenida tras login exitoso', async () => {
    authService.login.mockResolvedValue({
      success: true,
      data: { token: 'abc123', user: { nombre: 'Juan' } }
    })
    renderLogin()

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))

    expect(await screen.findByText(/bienvenido, juan/i)).toBeInTheDocument()
  })

  test('llama a onLogin con el nombre del usuario', async () => {
    authService.login.mockResolvedValue({
      success: true,
      data: { token: 'abc123', user: { nombre: 'Juan' } }
    })
    const onLogin = vi.fn()
    renderLogin(onLogin)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('Juan')
    })
  })

  test('muestra error del servidor cuando el login falla', async () => {
    authService.login.mockResolvedValue({
      success: false,
      message: 'Credenciales incorrectas'
    })
    renderLogin()

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))

    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument()
  })

  test('muestra error cuando el servicio lanza una excepción', async () => {
    authService.login.mockRejectedValue(new Error('Error de conexión'))
    renderLogin()

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))

    expect(await screen.findByText(/error de conexión/i)).toBeInTheDocument()
  })

  test('el botón muestra "Verificando..." mientras procesa', async () => {
    authService.login.mockImplementation(() => new Promise(resolve =>
      setTimeout(() => resolve({
        success: true,
        data: { token: 'abc', user: { nombre: 'Juan' } }
      }), 500)
    ))
    renderLogin()

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }))

    expect(await screen.findByText(/verificando/i)).toBeInTheDocument()
  })
})  