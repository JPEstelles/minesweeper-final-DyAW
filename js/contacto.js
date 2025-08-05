"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("formContacto");
    var erroresDiv =  document.getElementById("erroresContacto");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        erroresDiv.innerHTML = ""; // Limpiar errores previos

        var nombre = document.getElementById("nombreContacto").value.trim();
        var email = document.getElementById("mailContacto").value.trim();
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
            errores.push("El mensaje debe ser alfanumérico y tener al menos 5 caracteres.");
        }
        // Si hay errores, mostrarlos
        if (errores.length > 0) {
            erroresDiv.innerHTML = errores.map(function(e) {
                return "<div>" + e + "</div>";
            }).join("");
            erroresDiv.style.color = "#D32F2F";
            return;
        }
        // Si no hay errores, enviar el formulario
        var asunto = encodeURIComponent("Contacto Buscaminas");
        var cuerpo = encodeURIComponent("Nombre: " + nombre + "\nEmail: " + email + "\nMensaje: " + mensaje);
        window.location.href = "mailto:correo@ejemplo.com?subject=" + asunto + "&body=" + cuerpo;

    });
});
