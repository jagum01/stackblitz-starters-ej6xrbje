const conteNedor = document.createElement("div")
conteNedor.id = "contenedor"

const contenedor = document.getElementById("contenedor");

const inputTexto = document.createElement("input");

inputTexto.type = "text";
inputTexto.id = "nombreUsuario";
inputTexto.name = "usuario";
inputTexto.placeholder = "Escribe tu nombre aquí...";
inputTexto.className = "clase-input-estilo"; // Para aplicar CSS opcional


contenedor.appendChild(inputTexto);
