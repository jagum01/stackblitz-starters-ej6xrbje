import { supabase } from "./supabaseClient.js";

const limiteHistorial = 12;

export async function cargarHistorial() {
  const { data, error } = await supabase
    .from("search_history")
    .select("id, pokemon_id, pokemon_name, created_at")
    .order("created_at", { ascending: false })
    .limit(limiteHistorial);

  if (error) throw error;
  return data ?? [];
}

export async function guardarBusqueda(pokemon) {
  const { error } = await supabase.from("search_history").insert({
    pokemon_id: pokemon.id,
    pokemon_name: pokemon.name,
  });

  if (error) throw error;
}
