// 1. Seleccionamos los elementos del DOM
const inputConcepto = document.getElementById('input-concepto');
const inputMonto = document.getElementById('input-monto');
const btnAgregar = document.getElementById('btn-agregar');
const listaHistorial = document.getElementById('lista-historial');
const totalMonto = document.getElementById('total-monto');

// --- ESTADO: Array de gastos ---
let misGastos = JSON.parse(localStorage.getItem('gastos')) || [];

// 2. Función Maestra: Se encarga de dibujar TODO (Lista y Total)
// Esta función se llama al inicio, al agregar y al borrar.
function pintarHTML() {
    
    // A. Limpiamos el HTML actual para no duplicar items
    listaHistorial.innerHTML = ''; 
    
    // B. Reiniciamos el total para recalcularlo desde cero
    let totalCalculado = 0;

    // C. Recorremos el array
    misGastos.forEach(function(gasto) {
        
        // Crear el LI
        const li = document.createElement('li');
        li.textContent = `${gasto.concepto}: $${gasto.monto.toFixed(2)} `;

        // --- NUEVO: Crear botón de borrar ---
        const btnBorrar = document.createElement('button');
        btnBorrar.textContent = 'X';
        btnBorrar.style.marginLeft = '10px'; // Un poco de espacio estético
        btnBorrar.style.color = 'red';       // Color para identificarlo
        
        // --- NUEVO: Lógica de Borrado ---
        // Asignamos la función onclick pasando el ID único de este gasto
        btnBorrar.onclick = function() {
            borrarGasto(gasto.id);
        };

        // Insertar el botón dentro del LI y el LI en la lista
        li.appendChild(btnBorrar);
        listaHistorial.appendChild(li);

        // Sumar al total
        totalCalculado += gasto.monto;
    });

    // D. Actualizamos el Total en pantalla
    totalMonto.textContent = totalCalculado.toFixed(2);

    // E. Guardamos el estado actual en LocalStorage
    localStorage.setItem('gastos', JSON.stringify(misGastos));
}

// 3. Función para Borrar un gasto específico
function borrarGasto(id) {
    // Filtramos el array: "Quédate con todos los gastos MENOS el que tiene este ID"
    misGastos = misGastos.filter(function(gasto) {
        return gasto.id !== id;
    });
    
    // Volvemos a pintar la lista (esto actualiza DOM, Total y LocalStorage)
    pintarHTML();
}

// 4. Event Listener para Agregar
btnAgregar.addEventListener('click', function() {
    const concepto = inputConcepto.value.trim();
    const monto = parseFloat(inputMonto.value);

    if (concepto === '' || isNaN(monto) || monto === 0) {
        alert('Por favor, ingresa valores válidos.');
        return; 
    }

    // --- NUEVO: Agregamos un ID único usando Date.now() ---
    const nuevoGasto = {
        id: Date.now(), // Genera un número único basado en el tiempo exacto en milisegundos
        concepto: concepto,
        monto: monto
    };

    misGastos.push(nuevoGasto);

    // Repintamos todo
    pintarHTML();

    // Limpiamos inputs
    inputConcepto.value = '';
    inputMonto.value = '';
    inputConcepto.focus();
});

// 5. Inicialización: Pintar lo que haya guardado al cargar la página
pintarHTML();