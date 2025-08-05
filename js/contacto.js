"use strict";
var themeToggle = document.getElementById("themeToggle");
var currentTheme = localStorage.getItem("theme") || "light";

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("formContacto");
    var modalCerrar = document.getElementById("modalCerrar");

    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeToggle();
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        var nombre = document.getElementById("nombreContacto").value.trim();
        var email = document.getElementById("emailContacto").value.trim();
        var mensaje = document.getElementById("mensajeContacto").value.trim();

        var errores = [];
        // Validaciones
        if (nombre.length < 3 || !/^[a-zA-Z0-9 ]+$/.test(nombre)) {
            errores.push("El nombre debe ser alfanumérico y tener al menos 3 caracteres.");
        }
        // Validación del email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errores.push("El email no es válido.");
        }
        // Validación del mensaje
        if (mensaje.length < 5 || !/^[a-zA-Z0-9 .,;:¡!¿?()\-_'"]+$/.test(mensaje)) {
            errores.push("El mensaje debe tener al menos 5 caracteres.");
        }
        // Si hay errores, mostrarlos
        if (errores.length > 0) {
            mostrarModal(errores.join("<br>"));
            return;
        }
        // Si no hay errores, enviar el formulario
        var asunto = encodeURIComponent("Contacto Buscaminas");
        var cuerpo = encodeURIComponent("Nombre: " + nombre + "\nEmail: " + email + "\nMensaje: " + mensaje);
        window.location.href = "mailto:correo@ejemplo.com?subject=" + asunto + "&body=" + cuerpo;

    });
    modalCerrar.addEventListener("click", function() {
        document.getElementById("modal").classList.add("oculto");
    });
});

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
    var modal = document.getElementById("modal");
    var modalMensaje = document.getElementById("modalMensaje");
    modalMensaje.innerHTML = texto;
    modal.classList.remove("oculto");
}