import { cargarHistorial, guardarBusqueda } from "./historial.js";

const input = document.getElementById("input");
input.placeholder = "Nombre o ID";

const btn = document.getElementById("boton");
const error = document.getElementById("texto");
const out = document.getElementById("respuestaApi");
const carrusel = document.getElementById("historialCarrusel");
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");

const COLORES = {
  black: "#4a4a55", blue: "#4a86d9", brown: "#b07d4f", gray: "#9aa0a6",
  green: "#4caf6a", pink: "#f28bb5", purple: "#a777c9", red: "#e5484d",
  white: "#dfe3e8", yellow: "#f5c93a",
};

let historial = [];
let indiceHistorial = 0;
let posicionInicial = 0;
let arrastreActivo = false;

btn.addEventListener("click", () => buscar(input.value));
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscar(input.value);
});
anterior.addEventListener("click", () => moverHistorial(-1));
siguiente.addEventListener("click", () => moverHistorial(1));

iniciarHistorial();

async function iniciarHistorial() {
  try {
    historial = await cargarHistorial();
    pintarHistorial();
  } catch {
    pintarHistorial("El historial no está disponible ahora.");
  }
}

async function buscar(valor) {
  const q = valor.trim().toLowerCase();
  error.textContent = "";
  out.replaceChildren();

  if (!q) {
    error.textContent = "El campo no puede estar vacío.";
    return;
  }
  if (!/^[a-z0-9-]+$/.test(q)) {
    error.textContent = "Formato no válido: usa solo letras, números o guiones.";
    return;
  }

  out.append(crear("p", "cargando", "Cargando..."));

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`);
    if (!res.ok) throw new Error("No encontrado");
    const pokemon = await res.json();
    const especie = await obtenerEspecie(pokemon.species.url);
    out.replaceChildren(crearTarjeta(pokemon, especie));
    input.value = pokemon.name;
    await guardarEnHistorial(pokemon);
  } catch (e) {
    out.replaceChildren();
    error.textContent = e.message === "No encontrado" ? "Pokémon no encontrado." : "No se pudo completar la búsqueda.";
  }
}

async function guardarEnHistorial(pokemon) {
  try {
    await guardarBusqueda(pokemon);
    historial = await cargarHistorial();
    indiceHistorial = 0;
    pintarHistorial();
  } catch {
    error.textContent = "Pokémon encontrado, pero no se pudo guardar en el historial.";
  }
}

async function obtenerEspecie(url) {
  try {
    const res = await fetch(url);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function estadistica(etiqueta, valor) {
  const caja = crear("div", "estadistica");
  caja.append(crear("span", "etiqueta", etiqueta), crear("span", "valor", valor));
  return caja;
}

function seccion(titulo, contenido) {
  const s = crear("section", "seccion");
  s.append(crear("h3", "", titulo), contenido);
  return s;
}

function crearTarjeta(p, especie) {
  const color = COLORES[especie?.color?.name] ?? COLORES.gray;
  const descripcion = especie?.flavor_text_entries
    ?.find((e) => e.language.name === "es")?.flavor_text.replace(/\s+/g, " ") ?? "Sin descripción disponible.";
  const imagenUrl = p.sprites.other?.["official-artwork"]?.front_default ?? p.sprites.front_default;
  const tarjeta = crear("article", "tarjeta");
  tarjeta.style.setProperty("--color", color);

  const imagen = crear("div", "tarjeta-imagen");
  const img = crear("img");
  img.src = imagenUrl;
  img.alt = p.name;
  imagen.append(img);

  const cabecera = crear("div", "tarjeta-cabecera");
  cabecera.append(crear("h2", "nombre", p.name), crear("span", "numero", `#${String(p.id).padStart(3, "0")}`));

  const tipos = crear("div", "tipos");
  tipos.append(...p.types.map((t) => crear("span", "tipo", t.type.name)));

  const estadisticas = crear("div", "estadisticas");
  estadisticas.append(estadistica("Altura", `${p.height / 10} m`), estadistica("Peso", `${p.weight / 10} kg`));

  const habilidades = crear("ul", "habilidades");
  habilidades.append(...p.abilities.map((a) => crear("li", "", a.ability.name)));

  const cuerpo = crear("div", "tarjeta-cuerpo");
  cuerpo.append(cabecera, tipos, estadisticas, seccion("Habilidades", habilidades), seccion("Descripción", crear("p", "descripcion", descripcion)));
  tarjeta.append(imagen, cuerpo);
  return tarjeta;
}

function pintarHistorial(mensaje) {
  carrusel.replaceChildren();
  if (mensaje || historial.length === 0) {
    carrusel.append(crear("p", "historial-vacio", mensaje ?? "Tus búsquedas aparecerán aquí."));
    anterior.disabled = true;
    siguiente.disabled = true;
    return;
  }

  historial.forEach((item, posicion) => {
    const tarjeta = crear("button", "tarjeta-historial");
    tarjeta.type = "button";
    tarjeta.style.setProperty("--orden", posicion - indiceHistorial);
    tarjeta.style.setProperty("--giro", `${Math.max(-12, Math.min(12, (posicion - indiceHistorial) * 5))}deg`);
    tarjeta.setAttribute("aria-label", `Buscar ${item.pokemon_name}`);
    tarjeta.append(crear("span", "mini-numero", `#${String(item.pokemon_id).padStart(3, "0")}`), crear("strong", "mini-nombre", item.pokemon_name));
    tarjeta.addEventListener("click", () => buscar(item.pokemon_name));
    carrusel.append(tarjeta);
  });
  anterior.disabled = false;
  siguiente.disabled = false;
  prepararArrastre();
}

function moverHistorial(direccion) {
  if (!historial.length) return;
  indiceHistorial = (indiceHistorial + direccion + historial.length) % historial.length;
  pintarHistorial();
}

function prepararArrastre() {
  carrusel.onpointerdown = (e) => {
    arrastreActivo = true;
    posicionInicial = e.clientX;
    carrusel.setPointerCapture(e.pointerId);
  };
  carrusel.onpointerup = (e) => {
    if (!arrastreActivo) return;
    arrastreActivo = false;
    const desplazamiento = e.clientX - posicionInicial;
    if (Math.abs(desplazamiento) > 35) moverHistorial(desplazamiento < 0 ? 1 : -1);
  };
  carrusel.onpointercancel = () => { arrastreActivo = false; };
}
