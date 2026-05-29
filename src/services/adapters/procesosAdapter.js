export const normalizeProceso = (p = {}) => ({
  id: p.id ?? p.ID ?? null,
  id_vacante: p.id_vacante ?? p.idVacante ?? p.vacanteId ?? null,
  id_aspirante: p.id_aspirante ?? p.idAspirante ?? p.aspiranteId ?? null,
  nombreVacante: p.nombre_vacante ?? p.nombreVacante ?? p.title ?? null,
  nombreAspirante: p.nombre_aspirante ?? p.nombreAspirante ?? `${p.nombre ?? ''} ${p.apellido ?? ''}`.trim(),
  etapa: p.etapa ?? p.stage ?? 'convocatoria',
  observaciones: p.observaciones ?? p.notes ?? null,
  fecha_creacion: p.fecha_creacion ?? p.fecha ?? p.created_at ?? null,
});

export const normalizeProcesosList = (arr = []) => arr.map(normalizeProceso);
