/**
 * Normaliza un número de WhatsApp para uso en wa.me
 * Quita: espacios, +, guiones, paréntesis, puntos
 * Ejemplo: "+593 99 786 7727" → "593997867727"
 */
export const normalizeWhatsAppNumber = (raw: string): string => {
  if (!raw) return '';
  return raw.replace(/[\s+\-().]/g, '');
};

/**
 * Valida si un número tiene formato válido para WhatsApp Ecuador
 * Debe empezar con 593 y tener 12 dígitos total (código país + 9 dígitos)
 */
export const isValidWhatsAppNumber = (raw: string): boolean => {
  const normalized = normalizeWhatsAppNumber(raw);
  return /^593\d{9}$/.test(normalized);
};

/**
 * Formatea un número para mostrar legible (ej: +593 99 786 7727)
 */
export const formatWhatsAppNumber = (raw: string): string => {
  const normalized = normalizeWhatsAppNumber(raw);
  if (!/^593\d{9}$/.test(normalized)) return raw;
  // 593 99 786 7727
  return `+${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 8)} ${normalized.slice(8)}`;
};

/**
 * Asegura que una URL tenga protocolo
 * Si es wa.me/... le agrega https://
 * Si no tiene protocolo, agrega https://
 */
export const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  if (/^wa\.me\//.test(url)) return `https://${url}`;
  return `https://${url}`;
};