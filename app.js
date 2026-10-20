// app.js
const input = document.createElement('input');
input.placeholder = 'Nombre o ID';

const btn = document.createElement('button');
btn.textContent = 'Buscar';

const error = document.createElement('p');
error.style.color = 'red';

const out = document.createElement('div');

document.body.append(input, btn, error, out);

btn.addEventListener('click', buscar);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscar();
});

async function buscar() {
  const q = input.value.trim().toLowerCase();
  error.textContent = '';
  out.innerHTML = '';

  if (!q) {
    error.textContent = 'El campo no puede estar vacío.';
    return;
  }
  if (!/^[a-z0-9-]+$/.test(q)) {
    error.textContent = 'Formato no válido: usa solo letras, números o guiones.';
    return;
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`);
    if (!res.ok) throw new Error('No encontrado');
    const p = await res.json();

    const nombre = document.createElement('h2');
    nombre.textContent = p.name;

    const id = document.createElement('p');
    id.textContent = `ID: ${p.id}`;

    const img = document.createElement('img');
    img.src = p.sprites.front_default;
    img.alt = p.name;

    const altura = document.createElement('p');
    altura.textContent = `Altura: ${p.height / 10} m`;

    const peso = document.createElement('p');
    peso.textContent = `Peso: ${p.weight / 10} kg`;

    const tipos = document.createElement('p');
    tipos.textContent = `Tipo(s): ${p.types.map(t => t.type.name).join(', ')}`;

    const habilidades = document.createElement('p');
    habilidades.textContent = `Habilidad(es): ${p.abilities.map(a => a.ability.name).join(', ')}`;

    out.append(nombre, id, img, altura, peso, tipos, habilidades);
  } catch (e) {
    error.textContent = 'Pokémon no encontrado.';
  }
}
// Se agrega tecla enter para buscar