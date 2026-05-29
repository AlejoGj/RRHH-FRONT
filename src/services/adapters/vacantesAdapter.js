export const normalizeVacante = (v = {}) => ({
  id: v.id ?? v.ID ?? v.id_vacante ?? v.idVacante ?? null,
  titulo: v.titulo ?? v.title ?? v.nombre ?? '',
  departamento: v.departamento ?? v.department ?? v.area ?? '',
  descripcion: v.descripcion ?? v.description ?? null,
  salario: v.salario ?? v.salary ?? null,
  estado: v.estado ?? v.status ?? 'activa',
  fecha: v.fecha ?? v.fecha_creacion ?? v.created_at ?? null,
});

export const normalizeVacantesList = (arr = []) => arr.map(normalizeVacante);
