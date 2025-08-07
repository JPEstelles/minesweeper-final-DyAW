

# Minesweeper

Proyecto final de la materia Desarrollo y Arquitecturas Web 2025.

## Descripción

Este proyecto es una versión web del juego clásico Buscaminas (Minesweeper) desarrollada en HTML5, CSS3 y JavaScript (ES5). El tablero se genera dinámicamente y el juego es completamente funcional para un jugador.

## Características

- Tablero de 8x8 con 10 minas, generado aleatoriamente en cada partida.
- Ingreso de nombre de jugador con validación.
- Click izquierdo para revelar celdas, click derecho para poner/quitar banderas.
- Expansión automática de celdas vacías.
- Contador de minas restantes (minas menos banderas).
- Temporizador que inicia al revelar la primera celda.
- Modales para mensajes de victoria, derrota y errores.
- Reinicio de partida sin recargar la página.
- Página de contacto con validación y envío por mailto.
- Totalmente responsive.

## Cómo jugar

1. Ingresa tu nombre y presiona "Iniciar partida".
2. Haz click izquierdo en una celda para revelarla.
3. Haz click derecho para poner o quitar una bandera si crees que hay una mina.
4. Revela todas las celdas sin minas para ganar.

## Estructura del Proyecto

- **index.html**: Página principal del juego.
- **contacto.html**: Formulario de contacto.
- **css/**: Archivos de estilos.
- **js/**: Archivos de JavaScript.
- **img/**: Imágenes del proyecto.
- **.gitignore**: Ignora archivos ocultos y carpetas innecesarias.
- **README.md**: Información y guía del proyecto.

## Mapa Conceptual: Funcionamiento del Buscaminas (JS)
INICIO
│
├── DOMContentLoaded
│ ├── Escucha eventos (formulario, botones, modal)
│ └── Aplica tema visual y configura música
│
├── Formulario jugador
│ ├── Valida nombre
│ └── Llama a iniciarPartida()
│
├── iniciarPartida()
│ ├── Resetea estado del juego
│ ├── Crea tablero vacío
│ ├── Coloca minas aleatorias
│ ├── Calcula números alrededor
│ └── Dibuja tablero con celdas interactivas
│
├── Interacciones del jugador
│ ├── Click izquierdo: revelarCelda()
│ │ ├── Inicia timer
│ │ ├── Revela celda y expande si es 0
│ │ └── Si es mina: fin del juego
│ ├── Click derecho: clickBandera()
│ │ └── Coloca/quita banderas
│ └── Verifica victoria
│
├── Funciones extra
│ ├── Tema claro/oscuro
│ ├── Música de fondo
│ ├── Modal de mensajes
│ └── Reinicio del juego
│
└── FIN

## Contacto

Puedes acceder a la página de contacto desde el enlace en la parte superior del sitio.

## Código fuente

El código del proyecto está disponible en [GitHub](https://github.com/JPEstelles/minesweeper-final-DyAW.git).

Pagina en Github Pages : https://jpestelles.github.io/minesweeper-final-DyAW/


