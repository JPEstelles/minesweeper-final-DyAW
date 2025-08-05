"use strict"

var formJugador = document.getElementById("formJugador");
var juegoSection = document.getElementById("juego");
var tableroElem = document.getElementById("tablero"); 
var reiniciarBtn = document.getElementById("reiniciarBtn");
var minasRestantesElem = document.getElementById("minasRestantes");
var temporizadorElem = document.getElementById("temporizador");
var errorNombre = document.getElementById("errorNombre");
var themeToggle = document.getElementById("themeToggle");
var currentTheme = localStorage.getItem("theme") || "light";
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
var banderasColocadas = 0;
var timer = null;
var segundos = 0;

document.addEventListener("DOMContentLoaded", function() {
    formJugador.addEventListener("submit", iniciarJuego);
    reiniciarBtn.addEventListener("click", reiniciarJuego);

    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeToggle();

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    modalCerrar.addEventListener("click", function() { //Al click en el boton de cerrar del modal se oculta
     modal.classList.add("oculto");
    });
});

function iniciarJuego(evento) {
    evento.preventDefault();
    errorNombre.textContent = "";
    var input = document.getElementById("nombreJugador");
    var nombre = input.value.trim();

    if (nombre.length <3 || !/^[a-zA-Z0-9 ]+$/.test(nombre)){
        errorNombre.textContent = "El nombre debe tener al menos 3 caracteres alfanuméricos."; 
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
    banderasColocadas = 0;
    reveladas = 0;
    juegoActivo = true; // estado del juego
    temporizadorElem.textContent = "Tiempo: 00:00";
    clearInterval(timer); // Limpiar el temporizador 
    timer = null;
    segundos = 0;
    minasRestantesElem.textContent = "Minas: " + (minas - banderasColocadas);
    tableroElem.innerHTML = ""; // Limpiar el tablero
     // -----------Crear matriz del tablero con celdas vacías -----------
    for (var f = 0; f < filas; f++) {           
        tablero[f] = [];                        // Inicializa la fila como un array
        for (var c = 0; c < columnas; c++) {    
            tablero[f][c] = {                   // Crea un objeto para cada celda!!!
                mina: false,                   
                revelada: false,               
                bandera: false,                 
                numero: 0,                      
                elem: null                      // Referencia al elemento HTML (se asigna después)
            };
        }
    }
   //----------- Colocar minas aleatoriamente en el tablero-----------
    var totalCeldas = filas * columnas;         
    var minasColocadas = 0;                     
    while (minasColocadas < minas) {            // Hasta colocar todas las minas
        var random = Math.floor(Math.random() * totalCeldas);  // Índice aleatorio
        var f = Math.floor(random / columnas)
        var c = random % columnas;             
        if (!tablero[f][c].mina) {              // Si esa celda no tiene mina
            tablero[f][c].mina = true;         
            minasColocadas++;                  
        }
    }
    // -----------Calcular cuántas minas hay alrededor de cada celda-----------
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            if (!tablero[f][c].mina) { // Si la celda no es una mina
                tablero[f][c].numero = contarMinasAlrededor(f, c);// Se calcula el número de minas alrededor
            }
        }
    }
    // ----------- Crear elementos HTML para cada celda del tablero -----------
    for (var f = 0; f < filas; f++) { // Recorre cada fila
        for (var c = 0; c < columnas; c++) { // y cada columna
            var celdaDiv = document.createElement("div"); // Crea el elemento div para la celda
            celdaDiv.className = "celda"; 
            celdaDiv.dataset.fila = f; 
            celdaDiv.dataset.col = c; 
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
            var nf = fila + df;                 
            var nc = columna + dc;              
            if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) { // Verifica que esté dentro del tablero
                if (tablero[nf][nc].mina) {     // Si hay mina en la celda vecina
                    total++;                    
                }
            }
        }
    }
    return total; 
}

function clickCelda(e){
    if (!juegoActivo) return; // Si el juego no está activo, no hacer nada
    // Inicio Tmeporizador
    if (!timer) {
        timer = setInterval(function() {
            segundos++;
            var min = String(Math.floor(segundos / 60)).padStart(2, '0'); // Calcula minutos
            var sec = String(segundos % 60).padStart(2, '0'); // Calcula segundos
            temporizadorElem.textContent = "Tiempo: " + min + ":" + sec; 
        }, 1000); // Actualiza cada segundo
    }
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
    //Si ya tiene una bandera , se la saco
    if (celda.bandera){
        celda.bandera = false;
        this.classList.remove("bandera");
        this.textContent = ""; 
        banderasColocadas--;
    }
    else{
        if(banderasColocadas < minas){
            celda.bandera = true;
            this.classList.add("bandera");
            this.textContent = "🚩"; 
            banderasColocadas++;
        } else {
            mostrarModal("No puedes colocar más banderas que minas.");
        }
    }
    minasRestantesElem.textContent = "Minas: " + (minas - banderasColocadas);
}

function revelarCelda(f, c){
    var celda = tablero[f][c]; // Obtener la celda del tablero
    if (celda.revelada || celda.bandera) return; // Si ya está revelada o tiene bandera, no hacer nada
    celda.revelada = true; 
    celda.elem.classList.add("revelada"); // Añadir clase para mostrarla como revelada
    if (celda.mina){
        celda.elem.classList.add("mina"); 
        celda.elem.textContent = "💣"; 
        juegoActivo = false; 
        mostrarModal("¡PERDISTE! Sos Malisimo " + nombreJugador + " 😢");
        clearInterval(timer);
        revelarTodasMinas();
        return;
    }
    reveladas++; // Aumentar el contador de celdas reveladas
    if (celda.numero > 0) {
        celda.elem.textContent = celda.numero; // Mostrar el número de minas alrededor
    } else {
        for (var df = -1; df <= 1; df++) {  // Exxpansion recursiva para revelar celdas adyacentes
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
        clearInterval(timer);
    }
}
function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    updateThemeToggle();
}

function updateThemeToggle() {
    if (themeToggle) {
        themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";
    }
}
function mostrarModal(texto) {
    modalMensaje.textContent = texto;
    modal.classList.remove("oculto");
}

function reiniciarJuego() {
    clearInterval(timer);
    iniciarPartida();
}