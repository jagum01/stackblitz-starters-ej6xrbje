const conSulta = document.createElement("input");
conSulta.type = "text";
conSulta.placeholder = "Escribe tu nombre aquí...";
conSulta.id = "miInput";
conSulta.name = "nombreUsuario";

document.appendChild(conSulta);




//Boton de buscar pokedex
const miBoton = document.createElement('button');
miBoton.innerText = "Buscar";

miBoton.id = 'mi-boton-unico';
miBoton.className = 'estilo-boton';

miBoton.addEventListener('click', () => {
    alert('¡Hola! Has presionado el botón creado con JavaScript.');
});

document.body.appendChild(miBoton);