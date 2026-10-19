const lis = document.querySelectorAll("li");
const a = document.querySelectorAll("li a");

for (let i = 0; i < lis.length; i++) {
  lis[i].addEventListener("click", function() {
    for (let i = 0; i < lis.length; i++) {
      lis[i].classList.remove("active");
      a[i].classList.remove("active-text");
    }
    this.classList.add("active");
    a[i].classList.add("active-text");
  });
}

//barra de busqueda
const contenedor = document.getElementById("contenedor");

const inputTexto = document.createElement("input");

inputTexto.type = "search";
inputTexto.id = "nombreUsuario";
inputTexto.name = "usuario";
inputTexto.placeholder = "Escribe tu nombre aquí...";
inputTexto.className = "clase-input-estilo"; // Para aplicar CSS opcional
contenedor.appendChild(inputTexto);
//Boton
const btn = document.createElement("button")

 btn.textContent = "Buscar";

 btn.addEventListener( "click", () => {
    alert("Se esta buscando un pokemón!") 
 })


document.body.appendChild(btn)


