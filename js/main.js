"use strict"

var formJugador = document.getElementById("formJugador");
var juegoSection = document.getElementById("juego");
var tableroElem = document.getElementById("tablero"); 
var reiniciarBtn = document.getElementById("reiniciarBtn");
var minasRestantesElem = document.getElementById("minasRestantes");
var temporizadorElem = document.getElementById("temporizador");

//Modal - arreglarlo
var modal = document.getElementById("modal");
var modalMensaje = document.getElementById("modalMensaje");
var modalCerrar = document.getElementById("modalCerrar");

// Variables Juego
var nombreJugador = "";
var columnas = 8;
var filas = 8;
var minas = 10;
var tablero = []; // Array para el tablero
var minasRestantes = minas;
var reveladas = 0;
var juegoActivo = false;


document.addEventListener("DOMContentLoaded", function() {
    formJugador.addEventListener("submit", iniciarJuego);
    reiniciarBtn.addEventListener("click", reiniciarJuego);
    modalCerrar.addEventListener("click", function() { //Al click en el boton de cerrar del modal se oculta
     modal.classList.add("oculto");
    });
});

function iniciarJuego(evento) {
    evento.preventDefault();
    var input = document.getElementById("nombreJugador");
    var nombre = input.value.trim();
    if (nombre.length <3 ){
        alert("El nombre debe tener al menos 3 caracteres.");
        return;
    }
    nombreJugador = nombre;
    formJugador.classList.add("oculto");
    juegoSection.classList.remove("oculto");
    iniciarPartida();
}
//---------- Inicia o reinicia una partida-----------
function iniciarPartida(){
    tablero = [];
    minasRestantes = minas;
    reveladas = 0;
    juegoActivo = true; // estado del juego
    minasRestantesElem.textContent = "Minas: " + minasRestantes;
    temporizadorElem.textContent = "Tiempo: 00:00";
    tableroElem.innerHTML = ""; // Limpiar el tablero


     // -----------Crear matriz del tablero con celdas vacías -----------
    for (var f = 0; f < filas; f++) {           // Recorre cada fila
        tablero[f] = [];                        // Inicializa la fila como un array
        for (var c = 0; c < columnas; c++) {    // Recorre cada columna
            tablero[f][c] = {                   // Crea un objeto para cada celda!!!
                mina: false,                    // no tiene mina
                revelada: false,                // no fue revelada
                bandera: false,                 // no tiene bandera
                numero: 0,                      // Numero de minas alrededor (se calcula luego)
                elem: null                      // Referencia al elemento HTML (se asigna después)
            };
        }
    }
   //----------- Colocar minas aleatoriamente en el tablero-----------
    var totalCeldas = filas * columnas;         
    var minasColocadas = 0;                     
    while (minasColocadas < minas) {            // Hasta colocar todas las minas
        var random = Math.floor(Math.random() * totalCeldas);  // Índice aleatorio
        var f = Math.floor(random / columnas);  // Fila correspondiente
        var c = random % columnas;              // Columna correspondiente
        if (!tablero[f][c].mina) {              // Si esa celda no tiene mina
            tablero[f][c].mina = true;          // Coloca una mina
            minasColocadas++;                  
        }
    }

    // -----------Calcular cuántas minas hay alrededor de cada celda-----------
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            if (!tablero[f][c].mina) { // Si la celda no es una mina
                // Se calcula el número de minas alrededor
                tablero[f][c].numero = contarMinasAlrededor(f, c);
            }
        }
    }
    // ----------- Crear elementos HTML para cada celda del tablero -----------
    for (var f = 0; f < filas; f++) { // Recorre cada fila
        for (var c = 0; c < columnas; c++) { // y cada columna
            var celdaDiv = document.createElement("div"); // Crea el elemento div para la celda
            celdaDiv.className = "celda"; // Asigna la clase CSS "celda"
            celdaDiv.dataset.fila = f; // Guarda el numero de fila en el dataset
            celdaDiv.dataset.col = c; // Guarda el num de columna en el dataset
            celdaDiv.addEventListener("click", clickCelda); // Asocia el evento click para mostrar celda
            celdaDiv.addEventListener("contextmenu", clickBandera); // Asocia el evento click derecho para bandera
            tablero[f][c].elem = celdaDiv; // Guarda la referencia al elemento en el objeto celda
            tableroElem.appendChild(celdaDiv); // Agrega el div de la celda al tablero en el DOM
        }
    }

}

// ----------- Función que cuenta cuántas minas hay alrededor de una celda específica -----------
function contarMinasAlrededor(fila, columna) {
    var total = 0;  // Contador de minas
    for (var df = -1; df <= 1; df++) {          // Desplazamiento de filas (-1, 0, 1)
        for (var dc = -1; dc <= 1; dc++) {      // Desplazamiento de columnas (-1, 0, 1)
            if (df === 0 && dc === 0) continue; // Salta la celda actual
            var nf = fila + df;                 // Nueva fila
            var nc = columna + dc;              // Nueva columna
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) { // Verifica que esté dentro del tablero
                if (tablero[nf][nc].mina) {     // Si hay mina en la celda vecina
                    total++;                    // Incrementa el contador
                }
            }
        }
    }
    return total; // Devuelve el total de minas alrededor
}


function clickCelda(e){
    if (!juegoActivo) return; // Si el juego no está activo, no hacer nada
    var f = parseInt(this.dataset.fila), c = parseInt(this.dataset.col);
    var celda = tablero[f][c]; // Obtener la celda del tablero
    if (celda.revelada || celda.bandera) return; // Si ya está revelada o tiene bandera, no hacer nada
    revelarCelda( f, c); // Revelar la celda
    verificarVictoria(); // Verificar si se ha ganado
}

function clickBandera(e) {
    e.preventDefault();
    if (!juegoActivo) return;
    var f = parseInt(this.dataset.fila), c = parseInt(this.dataset.col);
    var celda = tablero[f][c];
    if (celda.revelada) return;
    celda.bandera = !celda.bandera;
    if (celda.bandera) {
        this.classList.add("bandera");
        minasRestantes--;
    } else {
        this.classList.remove("bandera");
        minasRestantes++;
    }
    minasRestantesElem.textContent = "Minas: " + minasRestantes;
}

function revelarCelda(f, c){
    var celda = tablero[f][c]; // Obtener la celda del tablero
    if (celda.revelada || celda.bandera) return; // Si ya está revelada o tiene bandera, no hacer nada
    celda.revelada = true; // Marcar la celda como revelada
    celda.elem.classList.add("revelada"); // Añadir clase para mostrarla como revelada
    if (celda.mina){
        celda.elem.classList.add("mina"); // Añadir clase de mina
        celda.elem.textContent = "💣"; // Mostrar mina
        juegoActivo = false; // Terminar el juego
        mostrarModal("¡PERDISTE! 😢");
        return;
    }
    reveladas++; // Aumentar el contador de celdas reveladas
    if (celda.numero > 0) {
        celda.elem.textContent = celda.numero; // Mostrar el número de minas alrededor

    }
    else {
        // Exxpansion recursiva para revelar celdas adyacentes
        for (var df = -1; df <= 1; df++) {
            for (var dc = -1; dc <= 1; dc++) {
                if (df === 0 && dc === 0) continue; // Saltar la celda actual
                var nf = f + df, nc = c + dc; // Nueva fila y columna
                if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) { // Verificar limites del tablero
                    revelarCelda(nf, nc); // Llamada recursiva para revelar celdas adyacentes
                }
            }
        }
    }

}
function revelarTodasMinas() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            var celda = tablero[f][c];
            if (celda.mina) {
                celda.elem.classList.add("mina");
                celda.elem.textContent = "💣";
            }
        }
    }
}

function verificarVictoria() {
    if (reveladas === filas * columnas - minas) {
        juegoActivo = false;
        mostrarModal("¡Ganaste, " + nombreJugador + "!");
    }
}
function mostrarModal(texto) {
    modalMensaje.textContent = texto;
    modal.classList.remove("oculto");
}
function reiniciarJuego() {
    iniciarPartida();
}