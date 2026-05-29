export const normalizeAspirante = (a = {}) => ({
  id: a.id ?? a.ID ?? null,
  nombre: a.nombre ?? a.firstName ?? a.nombre_completo ?? '',
  apellido: a.apellido ?? a.lastName ?? '',
  email: a.email ?? a.mail ?? '',
  telefono: a.telefono ?? a.phone ?? null,
  perfil: a.perfil ?? a.profile ?? null,
  fecha: a.fecha ?? a.fecha_creacion ?? a.created_at ?? null,
  estado: a.estado ?? a.status ?? 'pendiente',
});

export const normalizeAspirantesList = (arr = []) => arr.map(normalizeAspirante);
