# Guía sencilla de la Pokédex

## 1. ¿Qué hace esta aplicación?

Imagina que la aplicación es una pequeña biblioteca de Pokémon.

- La caja de búsqueda es como una pregunta: «¿Quién es este Pokémon?».
- PokeAPI es como una enorme enciclopedia que responde.
- La tarjeta es como una ficha con foto y datos.
- El historial es una cajita temporal donde guardamos las últimas preguntas.
- Las tarjetas del historial son como cartas que se pueden mover hacia delante y hacia atrás.

La aplicación no tiene una lista completa guardada dentro del proyecto. Cuando escribes un nombre o número, pide la información a PokeAPI y construye la tarjeta en ese momento.

## 2. ¿Por qué ahora aparece en español?

PokeAPI entrega algunos datos en inglés en la respuesta principal. Por ejemplo, puede entregar `fire`, `water` o `blaze`.

La aplicación hace tres cosas para traducir:

1. Pide la información principal del Pokémon.
2. Pide la información de su especie, donde existe el nombre en español y la descripción en español.
3. Pide los recursos individuales de cada tipo y habilidad, y busca dentro de ellos el nombre cuyo idioma sea `es`.

Por eso ahora se transforman, cuando PokeAPI tiene la traducción disponible:

- El nombre del Pokémon.
- Los tipos.
- Las habilidades.
- La descripción.
- Las etiquetas de la tarjeta, como altura, peso y descripción, que ya estaban escritas en español.

Si una traducción no existe o una petición falla, se conserva el nombre original. Esto es mejor que dejar una parte vacía: el usuario sigue viendo un dato útil.

## 3. ¿Qué ocurre cuando se pulsa «Buscar»?

### Paso 1: leer la caja

El programa mira qué escribió la persona, quita espacios de los extremos y convierte el texto a minúsculas. Así, ` Pikachu ` y `pikachu` se tratan igual.

### Paso 2: revisar la pregunta

Antes de salir a Internet, se comprueba que:

- No esté vacía.
- Solo tenga letras, números o guiones.

Esta revisión evita enviar preguntas que PokeAPI no entiende y permite mostrar mensajes claros.

### Paso 3: pedir el Pokémon

Se usa una petición web con el nombre o número introducido. La aplicación espera la respuesta antes de dibujar la tarjeta.

Mientras espera, aparece «Cargando...». Esto es importante porque Internet no responde siempre a la misma velocidad.

### Paso 4: pedir traducciones

Cuando llega el Pokémon, también se solicita su especie, sus tipos y sus habilidades. Las traducciones de tipos y habilidades se piden a la vez usando `Promise.all`, como si tres niños fueran a buscar tres libros al mismo tiempo en lugar de hacerlo uno detrás de otro.

### Paso 5: construir la tarjeta

La aplicación crea elementos visuales seguros usando `textContent`. La tarjeta recibe:

- Imagen oficial.
- Nombre en español cuando existe.
- Número nacional.
- Tipos en español.
- Altura convertida de decímetros a metros.
- Peso convertido de hectogramos a kilogramos.
- Habilidades en español.
- Descripción en español.
- Fondo de color basado en el color de la especie.

### Paso 6: actualizar el historial

Cuando el Pokémon se encontró correctamente, se guarda su número y nombre en el historial temporal. La tarjeta principal aparece aunque guardar el historial no tenga ninguna relación con la consulta a PokeAPI.

## 4. Las partes principales del programa

### `index.html`: el esqueleto

Este archivo contiene los espacios que se ven en pantalla:

- El título «Pokédex».
- La caja de búsqueda.
- El botón.
- El lugar donde aparece un error.
- El lugar donde aparece la tarjeta grande.
- El lugar donde aparece el historial.
- Los botones para ir atrás y adelante.

Es parecido al esqueleto de una casa: todavía no pinta las paredes ni hace que las puertas funcionen, pero dice dónde va cada cosa.

### `style.css`: los colores y movimientos

Este archivo controla cómo se ve todo:

- Colores.
- Espacios.
- Bordes redondeados.
- Sombras.
- Tamaños.
- Adaptación a pantallas pequeñas.
- Animación de entrada.
- Giro y profundidad de las tarjetas del historial.

La tarjeta central se ve más cerca. Las tarjetas alejadas se hacen más pequeñas, transparentes y giran un poco. Así parece una baraja.

### `app.js`: el director

Este archivo coordina la aplicación:

- Escucha el clic del botón.
- Escucha la tecla Enter.
- Comprueba la búsqueda.
- Consulta PokeAPI.
- Obtiene las traducciones.
- Construye la tarjeta.
- Pinta el historial.
- Responde a las flechas.
- Responde al arrastre del mouse o del dedo.

`crear`, `estadistica` y `seccion` son pequeñas ayudas para construir partes repetidas sin escribir la misma receta muchas veces.

### `historial.js`: la cajita temporal

Este archivo se encarga solamente del historial.

Usa `sessionStorage`, que es una memoria temporal del navegador:

- Guarda los datos mientras la pestaña está abierta.
- Permite mantenerlos al recargar.
- Se borra al cerrar la pestaña o ventana.
- Guarda como máximo 12 búsquedas.

Se separó del archivo principal para que el historial tenga una responsabilidad clara. Es como guardar los lápices en una caja diferente a los libros.

## 5. ¿Cómo funciona el idioma español?

PokeAPI tiene recursos relacionados. Un recurso puede tener una lista parecida a esta:

```text
names:
  - language: en, name: Fire
  - language: es, name: Fuego
```

La aplicación busca el elemento cuyo idioma es `es`.

Para el nombre del Pokémon se usa la información de especie. Para tipos y habilidades se consulta la dirección que PokeAPI entrega dentro de cada objeto. No se traducen datos inventando palabras en el navegador; se aprovechan las traducciones proporcionadas por la propia fuente.

## 6. ¿Por qué no se guardan todas las traducciones en un diccionario?

Podríamos escribir manualmente una lista enorme con todos los tipos y habilidades, pero sería una solución peor:

- Habría que mantener cientos de nombres.
- Podría haber errores de escritura.
- PokeAPI podría cambiar una traducción.
- El código se volvería más grande.
- No se aprovecharía la información oficial de la API.

Consultar el recurso en español mantiene los datos más cerca de la fuente original. La aplicación conserva el nombre original como respaldo si la traducción no está disponible.

## 7. ¿Por qué el historial no usa una base de datos?

Esta versión necesita olvidar las búsquedas al cerrar la pestaña. Una base de datos guarda datos durante mucho tiempo, por lo que no coincide con ese comportamiento.

Además, una página web no puede crear libremente un archivo dentro de la carpeta del proyecto por razones de seguridad. `sessionStorage` es la herramienta del navegador que mejor coincide con la petición: es local, temporal y no necesita una cuenta ni una conexión adicional.

## 8. ¿Cómo se mueven las tarjetas?

Cuando se pulsa una flecha, cambia el número de la tarjeta que está al frente.

Cuando se arrastra:

1. Se recuerda dónde empezó el mouse.
2. Se recuerda dónde terminó.
3. Se calcula la distancia recorrida.
4. Si la distancia supera un pequeño límite, se cambia de tarjeta.
5. El navegador anima la nueva posición.

El mismo sistema funciona con el dedo porque usa eventos de puntero, que sirven para mouse, pantalla táctil y lápiz digital.

## 9. ¿Por qué este código es una buena solución?

No existe un código que sea perfecto para absolutamente todas las situaciones. Esta solución es adecuada para una Pokédex pequeña porque:

- Tiene cada responsabilidad en un lugar comprensible.
- No guarda secretos en el navegador.
- No inserta directamente texto recibido de Internet como HTML.
- Comprueba los errores de las peticiones.
- Muestra un estado de carga.
- Tiene un respaldo si falta una traducción.
- Funciona sin crear una cuenta.
- Se adapta a móvil y escritorio.
- No guarda historial permanente si el usuario no lo pidió.

Podría mejorarse para una aplicación mucho más grande con traducciones precargadas, caché, paginación, pruebas automáticas y una pantalla de accesibilidad más completa. No se añadieron esas piezas porque aumentarían el tamaño y la complejidad de una aplicación que solo necesita buscar y mostrar Pokémon.

## 10. Resumen para una persona que empieza

1. HTML prepara los huecos de la página.
2. CSS hace que esos huecos se vean bonitos.
3. JavaScript escucha lo que hace la persona.
4. PokeAPI responde con información.
5. La aplicación busca los nombres en español.
6. La tarjeta se construye con esos datos.
7. El historial se guarda temporalmente en el navegador.
8. Las tarjetas del historial se pueden girar y seleccionar.

La aplicación funciona como una conversación: la persona pregunta, PokeAPI responde, el programa traduce lo que puede, y después dibuja una ficha fácil de leer.
