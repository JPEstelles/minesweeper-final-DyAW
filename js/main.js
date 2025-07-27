"use strict"

var formJugador = document.getElementById("formJugador");
var juegoSection = document.getElementById("juego");
var tableroElem = document.getElementById("tablero"); 
var reiniciarBtn = document.getElementById("reiniciarBtn");
var minasRestantesElem = document.getElementById("minasRestantes");
var temporizadorElem = document.getElementById("temporizador");
// Variables globales
var nombreJugador = "";
var columnas = 8;
var filas = 8;
var minas = 10;

document.addEventListener("DOMContentLoaded", function() {
    formJugador.addEventListener("submit", iniciarJuego);
    reiniciarBtn.addEventListener("click", reiniciarJuego);
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

function iniciarPartida(){
    minasRestantesElem.textContent = "Minas: " + minas;
    temporizadorElem.textContent = "Tiempo: 00:00";
    tableroElem.innerHTML = ""; // Limpiar el tablero
    for (var i = 0; i < filas * columnas; i++){
        var celdaDiv = document.createElement("div");
        celdaDiv.className = "celda";
        tableroElem.appendChild(celdaDiv);
    }
}

function reiniciarJuego() {
    iniciarPartida();
}