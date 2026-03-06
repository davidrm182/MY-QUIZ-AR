const SHEET_ID = '16L9GDzTaz04WeGMXCBzLlYans9Jm0Ys94txHpXz-uq8'; 
let preguntas = [];
let indicePregunta = 0;
let aciertos = 0;

async function iniciarQuiz(nombreTema) {
    // Cambiamos de pantalla
    document.getElementById('pantalla-inicio').classList.add('oculto');
    document.getElementById('pantalla-quiz').classList.remove('oculto');
    document.getElementById('pregunta').innerText = "Cargando preguntas...";

    const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${nombreTema}`;

    try {
        const respuesta = await fetch(URL);
        const texto = await respuesta.text();
        const inicio = texto.indexOf('{');
        const fin = texto.lastIndexOf('}') + 1;
        const json = JSON.parse(texto.substring(inicio, fin));
        
        preguntas = json.table.rows.map(row => ({
            pregunta: row.c[0] ? row.c[0].v : '',
            a: row.c[1] ? row.c[1].v : '',
            b: row.c[2] ? row.c[2].v : '',
            c: row.c[3] ? row.c[3].v : '',
            d: row.c[4] ? row.c[4].v : '',
            correcta: row.c[5] ? row.c[5].v.toString().toLowerCase().trim() : ''
        }));

        mostrarPregunta();
    } catch (e) {
        alert("Error cargando el tema. Revisa que la pestaña se llame: " + nombreTema);
    }
}

function mostrarPregunta() {
    if (indicePregunta >= preguntas.length) {
        mostrarFinal();
        return;
    }

    document.getElementById('btn-siguiente').classList.add('oculto');
    let p = preguntas[indicePregunta];
    document.getElementById('contador').innerText = `Aciertos: ${aciertos} | Pregunta ${indicePregunta + 1} de ${preguntas.length}`;
    document.getElementById('pregunta').innerText = p.pregunta;
    
    document.getElementById('opciones').innerHTML = `
        <button onclick="verificar('a', this)">${p.a}</button>
        <button onclick="verificar('b', this)">${p.b}</button>
        <button onclick="verificar('c', this)">${p.c}</button>
        <button onclick="verificar('d', this)">${p.d}</button>
    `;
}

function verificar(respuestaUsuario, boton) {
    let correcta = preguntas[indicePregunta].correcta;
    let botones = document.getElementById('opciones').getElementsByTagName('button');

    for (let b of botones) { b.disabled = true; }

    if (respuestaUsuario === correcta) {
        boton.style.backgroundColor = "#4CAF50"; 
        boton.style.color = "white";
        aciertos++;
    } else {
        boton.style.backgroundColor = "#f44336"; 
        boton.style.color = "white";
        for (let b of botones) {
            if (b.innerText.toLowerCase().startsWith(correcta)) {
                b.style.border = "3px solid #4CAF50";
            }
        }
    }
    document.getElementById('btn-siguiente').classList.remove('oculto');
}

function siguiente() {
    indicePregunta++;
    mostrarPregunta();
}

function mostrarFinal() {
    document.getElementById('pantalla-quiz').classList.add('oculto');
    document.getElementById('pantalla-final').classList.remove('oculto');
    let porcentaje = Math.round((aciertos / preguntas.length) * 100);
    document.getElementById('resultado').innerHTML = `
        <h2>¡Test completado!</h2>
        <p>Has acertado <strong>${aciertos}</strong> de <strong>${preguntas.length}</strong></p>
        <p>Puntuación: ${porcentaje}%</p>
    `;
}