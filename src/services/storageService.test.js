import { describe, test, expect, beforeEach } from 'vitest'
import {
  generarId,
  obtenerAspirantes,
  crearAspirante,
  eliminarAspirante,
  actualizarAspirante,
  obtenerVacantes,
  guardarVacantes,
} from './storageService'

beforeEach(() => {
  localStorage.clear()
})

describe('generarId', () => {
  test('retorna un número', () => {
    expect(typeof generarId()).toBe('number')
  })

  test('cada id generado es único', () => {
    const id1 = generarId()
    const id2 = generarId()
    expect(id1).not.toBe(id2)
  })
})

describe('aspirantes', () => {
  test('retorna lista vacía si no hay datos', () => {
    expect(obtenerAspirantes()).toEqual([])
  })

  test('crea un aspirante correctamente', () => {
    const aspirante = crearAspirante({ nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com' })
    expect(aspirante.nombre).toBe('Juan')
    expect(aspirante.id).toBeDefined()
    expect(aspirante.estado).toBe('pendiente')
  })

  test('el aspirante creado aparece en la lista', () => {
    crearAspirante({ nombre: 'Ana', apellido: 'López', email: 'ana@test.com' })
    const lista = obtenerAspirantes()
    expect(lista).toHaveLength(1)
    expect(lista[0].nombre).toBe('Ana')
  })

  test('elimina un aspirante por id', () => {
    const aspirante = crearAspirante({ nombre: 'Carlos', apellido: 'Gómez', email: 'carlos@test.com' })
    eliminarAspirante(aspirante.id)
    expect(obtenerAspirantes()).toHaveLength(0)
  })

  test('actualiza los datos de un aspirante', () => {
    const aspirante = crearAspirante({ nombre: 'Luis', apellido: 'Torres', email: 'luis@test.com' })
    const actualizado = actualizarAspirante(aspirante.id, { nombre: 'Luis Actualizado' })
    expect(actualizado.nombre).toBe('Luis Actualizado')
  })

  test('retorna null si el aspirante no existe', () => {
    const resultado = actualizarAspirante(9999, { nombre: 'Nadie' })
    expect(resultado).toBeNull()
  })
})

describe('vacantes', () => {
  test('retorna lista vacía si no hay datos', () => {
    expect(obtenerVacantes()).toEqual([])
  })

  test('guarda y recupera vacantes correctamente', () => {
    guardarVacantes([{ id: 1, titulo: 'Desarrollador', departamento: 'TI' }])
    expect(obtenerVacantes()).toHaveLength(1)
    expect(obtenerVacantes()[0].titulo).toBe('Desarrollador')
  })
})