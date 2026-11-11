const CLAVE_HISTORIAL = "pokedex_historial";
const LIMITE_HISTORIAL = 12;

export function cargarHistorial() {
  const guardado = sessionStorage.getItem(CLAVE_HISTORIAL);
  if (!guardado) return [];

  try {
    const historial = JSON.parse(guardado);
    return Array.isArray(historial) ? historial : [];
  } catch {
    sessionStorage.removeItem(CLAVE_HISTORIAL);
    return [];
  }
}

export function guardarBusqueda(pokemon) {
  const historial = cargarHistorial();
  const nuevaBusqueda = {
    id: `${pokemon.id}-${Date.now()}`,
    pokemon_id: pokemon.id,
    pokemon_name: pokemon.name,
  };

  const actualizado = [nuevaBusqueda, ...historial].slice(0, LIMITE_HISTORIAL);
  sessionStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(actualizado));
  return actualizado;
}
