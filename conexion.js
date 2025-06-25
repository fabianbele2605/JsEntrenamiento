async function agregarAuto(auto) {
    try {
        const responseAll = await fetch('http://localhost:3000/autos');
        const totalAutos = await responseAll.json();
        const maxId = totalAutos.reduce((max, autos) => Math.max(max, parseInt(autos.id) || 0), 0);
        const nuevoId = maxId + 1;
        
        const response = await fetch('http://localhost:3000/autos', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body : JSONS.stringify({ id: nuevoId.toString(), ...auto})
        });

        if (!response.ok) {
            throw new Error('no se pudo agregar el auto');
        }

        const nuevoAuto = await response.json();
        alert('Auto Agregado Exitosamente!');
        return nuevoAuto;
    } catch (error) {
        console.error('Error al agregar auto:', error);
        document.getElementById('form-error').textContent = error.message;
        return null
    }
}

async function getAutoPorID(id) {
    try {
        const response = await fetch(`http://localhost:3000/autos/${id}`);
        if(!response.ok) {
            return null;
        }

        const auto = await response.json();
        return auto.estado ? auto : null;
    } catch (error) {
        console.error('Error al obtener el auto:', error);
        return null;
    }
}

// funcion para saber si el vehiculo sigeu en el inventariop si aparace false es por que fue vendido
async function estadoAuto(id) {
    try {
        const response = await fetch(`http://localhost:3000/autos/${id}`, {
            method: "PATCH",
            headers: { 'content-type' : 'application/json' },
            body: JSON.stringify({ estado: false})
        });

        if(!response.ok) {
            throw new Error('todavia no se ha vendido el auto');
        }

        alert('Auto vendido');
        obtenerAutoDisponibles();
    } catch (error) {
        console.error('Error al quitar el auto del inventario:', error);
        alert('Error al quitar el auto del inventario');
    }
}


async function obtenerAutoDisponibles() {
    try {
        const response = await fetch('http://localhost:3000/autos?estado=true');
        if(!response.ok) {
            throw new Error('No se pudieron obtener los autos disponibles');
        }

        const autosDisponibles = await response.json();

        const tableBody = document.getElementById('auto-table-body');
        tableBody.innerHTML = '';

        autosDisponibles.forEach(auto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${auto.id}</td>
                <td>${auto.marca}</td>
                <td>${auto.linea}</td>
                <td>${auto.modelo}</td>
                <td>${auto.color}</td>
                <td>${auto.estaod}</td>
                <td>
                    <button onclick="estadoAuto('${auto.id}')">De baja</button>
                    <button onclick="viewCarDetails('${auto.id}')">Ver</button>
                 </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al recuperar auto:', error);
        alert('Error al recuperar auto');
    }
}

async function viewCarDetails(id) {
    const auto = await getAutoPorID(id);
    if(auto) {
        alert(`Detalle del auto:\nID: ${auto.id}\nMarca: ${auto.marca}\nLinea: ${auto.linea}\nModelo: ${auto.modelo}\nColor: ${auto.color}`);
    } else {
        alert('Auto no encontrado o no activo');
    }
}

async function handleAddCar() {
    document.getElementById('form-error').textContent = '';
    

    const marca = document.getElementById('marca').value.trim();
    const linea = document.getElementById('linea').value.trim();
    const modelo = parseInt(document.getElementById('modelo').value);
    const color = document.getElementById('color').value.trim();

    if (!marca || !linea || !modelo || !color) {
        document.getElementById('form-error').textContent = 'Todos los campos son obligatorios';
        return;
    }

    const auto = { marca, linea, modelo, color};
    const nuevoAuto = await crearAuto(auto);

    if (nuevoAuto) {
        document.getElementById('marca').value = '';
        document.getElementById('linea').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('color').value = '';

        obtenerAutoDisponibles();
    }
}