/* ============================================================
   ESCAPE ROOM FYQ – CAMBIO DE UNIDADES
   Autor: Samuel López Melián
   ============================================================ */

/* -------------------------
   VARIABLES GLOBALES
------------------------- */

let alumno = "";
let curso = "";

let codigos = [];
const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";

let candado = Array(10).fill(" _ ");
let retoActual = 0;

/* -------------------------
   GENERAR CÓDIGOS ALEATORIOS
------------------------- */

function generarDigito() {
    return Math.random() < 0.5
        ? letras[Math.floor(Math.random() * letras.length)]
        : Math.floor(Math.random() * 10).toString();
}

function generarCodigos() {
    codigos = [];
    for (let i = 0; i < 10; i++) codigos.push(generarDigito());
}

/* -------------------------
   ELEMENTOS DEL DOM
------------------------- */

const startBtn = document.getElementById("startBtn");
const startScreen = document.querySelector(".start-screen");
const gameArea = document.getElementById("gameArea");
const candadoBox = document.getElementById("candadoBox");

/* -------------------------
   INICIO DEL ESCAPE ROOM
------------------------- */

startBtn.addEventListener("click", () => {

    alumno = document.getElementById("nombreAlumno").value.trim();
    curso = document.getElementById("cursoAlumno").value.trim();

    if (alumno === "" || curso === "") {
        alert("Por favor, escribe tu nombre y tu curso antes de comenzar.");
        return;
    }

    generarCodigos();
    candado = Array(10).fill(" _ ");
    retoActual = 0;

    startScreen.style.display = "none";
    gameArea.style.display = "block";

    setTimeout(() => {
        gameArea.style.opacity = "1";
    }, 50);

    mostrarCandado();
    cargarReto();
});

/* -------------------------
   MOSTRAR CANDADO
------------------------- */

function mostrarCandado() {
    candadoBox.innerHTML = `
        <h3>Candado dimensional</h3>
        <div class="candado-line">
            ${candado.map(c => `<span class="slot">${c}</span>`).join("")}
        </div>
    `;
}

/* -------------------------
   RETOS
------------------------- */

const retos = [
    { pregunta: "28 kg → g", respuesta: "28000" },
    { pregunta: "4,5 L → mL", respuesta: "4500" },
    { pregunta: "320 cm → m", respuesta: "3,2" },
    { pregunta: "0,75 km → m", respuesta: "750" },
    { pregunta: "5600 mg → g", respuesta: "5,6" },
    { pregunta: "8,2 dag → g", respuesta: "82" },
    { pregunta: "3 m² → cm²", respuesta: "30000" },
    { pregunta: "2,5 dm³ → cm³", respuesta: "2500" },
    { pregunta: "2,5 h → min", respuesta: "150" },
    { pregunta: "5400 s → h", respuesta: "1,5" }
];

/* -------------------------
   CARGAR RETO
------------------------- */

function cargarReto() {
    const r = retos[retoActual];

    gameArea.innerHTML = `
        <h2>Reto ${retoActual + 1} de 10</h2>
        <p><strong>Convierte:</strong> ${r.pregunta}</p>

        <input type="text" id="respuesta" placeholder="Escribe la respuesta...">
        <button class="btn" onclick="comprobar()">Comprobar</button>

        <p id="feedback"></p>
    `;
}

/* -------------------------
   COMPROBAR RESPUESTA
------------------------- */

function comprobar() {
    const r = retos[retoActual];
    const user = document.getElementById("respuesta").value.trim().replace(".", ",");
    const fb = document.getElementById("feedback");

    if (user === r.respuesta) {
        fb.textContent = "✔ Correcto";
        fb.style.color = "#00ff9d";

        candado[retoActual] = codigos[retoActual];
        mostrarCandado();

        retoActual++;

        if (retoActual < 10) {
            setTimeout(() => cargarReto(), 1200);
        } else {
            setTimeout(() => pantallaFinal(), 1200);
        }

    } else {
        fb.textContent = "✘ Incorrecto. Revisa la conversión.";
        fb.style.color = "#ff4b4b";
    }
}

/* -------------------------
   PANTALLA FINAL
------------------------- */

function pantallaFinal() {
    gameArea.innerHTML = `
        <div class="final-container">
            <h2>¡Lo lograste!</h2>
            <p>Pingu está libre gracias a tus respuestas.</p>

            <div class="final-layout">
                <img src="pingu_liberado.png" class="final-img" alt="Pingu liberado">

                <div class="final-code-box">
                    <h3>Código final</h3>
                    <p class="final-code">${codigos.join(" - ")}</p>

                    <button class="btn" onclick="exportarDiplomaFinal()">
                        Descargar diploma
                    </button>

                    <button class="restart-button" onclick="reiniciarJuego()">
                        Reiniciar escape room
                    </button>
                </div>
            </div>
        </div>
    `;
}

/* -------------------------
   EXPORTAR DIPLOMA FINAL
------------------------- */

function exportarDiplomaFinal() {
    const panel = document.getElementById("diplomaFinal");

    document.getElementById("diplomaNombre").innerText = alumno;
    document.getElementById("diplomaCurso").innerText = curso;
    document.getElementById("diplomaCodigo").innerText = codigos.join(" - ");

    panel.style.display = "block";

    html2canvas(panel, { scale: 2 }).then(canvas => {
        const enlace = document.createElement("a");
        enlace.download = `${alumno}_${curso}_diploma_escape_room.png`;
        enlace.href = canvas.toDataURL("image/png");
        enlace.click();
        panel.style.display = "none";
    });
}

/* -------------------------
   REINICIAR ESCAPE ROOM
------------------------- */

function reiniciarJuego() {
    location.reload();
}