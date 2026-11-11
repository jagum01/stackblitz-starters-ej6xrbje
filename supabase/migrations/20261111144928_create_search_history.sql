/*
# Crear historial de búsquedas de la Pokédex

1. Nuevas tablas
- `search_history`: guarda cada Pokémon consultado para mostrar un historial compartido.
- `id`: identificador único de la búsqueda.
- `pokemon_id`: número nacional del Pokémon consultado.
- `pokemon_name`: nombre normalizado usado en la búsqueda.
- `created_at`: fecha y hora de la consulta.

2. Seguridad
- Se activa RLS en `search_history`.
- Se concede únicamente el acceso CRUD necesario a los roles anon y authenticated.
- Las políticas permiten leer, crear, actualizar y borrar registros porque esta Pokédex no tiene pantalla de inicio de sesión y el historial es una función compartida del proyecto.

3. Notas importantes
- La tabla es independiente de la API externa y no duplica estadísticas del Pokémon.
- El historial se ordena por fecha desde la aplicación.
- La operación es idempotente: puede aplicarse de nuevo sin recrear ni borrar datos existentes.
*/

CREATE TABLE IF NOT EXISTS public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pokemon_id integer NOT NULL CHECK (pokemon_id > 0),
  pokemon_name text NOT NULL CHECK (char_length(pokemon_name) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS search_history_created_at_idx
  ON public.search_history (created_at DESC);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.search_history TO anon, authenticated;

DROP POLICY IF EXISTS "Lectura pública del historial" ON public.search_history;
CREATE POLICY "Lectura pública del historial"
  ON public.search_history FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Crear búsquedas del historial" ON public.search_history;
CREATE POLICY "Crear búsquedas del historial"
  ON public.search_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizar búsquedas del historial" ON public.search_history;
CREATE POLICY "Actualizar búsquedas del historial"
  ON public.search_history FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Borrar búsquedas del historial" ON public.search_history;
CREATE POLICY "Borrar búsquedas del historial"
  ON public.search_history FOR DELETE
  TO anon, authenticated
  USING (true);