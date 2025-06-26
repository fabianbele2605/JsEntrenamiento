// funcion para agregar motos
async function agregarMoto(moto) {
    try {
        const responseAll = await fetch('http://localhost:3000/motos');
        const totalMotos = await responseAll.json();
        const maxId = totalMotos.reduce((max, motos) => Math.max(max, parseInt(motos.id) || 0), 0);
        const nuevoId = maxId + 1;
        
        const response = await fetch('http://localhost:3000/motos', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body : JSON.stringify({ id: nuevoId.toString(), ...moto, is_estado: true })
        });

        if (!response.ok) {
            throw new Error('no se pudo agregar la moto');
        }

        const nuevoMoto = await response.json();
        alert('Moto Agregada Exitosamente!');
        return nuevoMoto;
    } catch (error) {
        console.error('Error al agregar moto:', error);
        document.getElementById('form-error').textContent = error.message;
        return null
    }
}

async function getMotoPorID(id) {
    try {
        const response = await fetch(`http://localhost:3000/motos/${id}`);
        if(!response.ok) {
            return null;
        }

        const moto = await response.json();
        return moto.is_estado ? moto : null;
    } catch (error) {
        console.error('Error al obtener la moto:', error);
        return null;
    }
}

// estado de moto
async function estadoMoto(id) {
    try {
        const response = await fetch(`http://localhost:3000/motos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ is_estado: false, debaja: true})
        });

        if(!response.ok) {
            throw new Error('todavia no se ha vendido la moto');
        }

        alert('Moto de baja');
        obtenerMotoDisponibles();
    } catch (error) {
        console.error('Error al quitar la moto del inventario:', error);
        alert('Error al quitar la moto del inventario');
    }
}

async function ventaMoto(id) {
    try {
        const response = await fetch(`http://localhost:3000/motos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ is_estado: true, venta: true })
        });

        if (!response.ok) {
            throw new Error('Todavia no se ah vendido la moto');
        }

        alert('Moto vendida');

    } catch (error) {
        console.error('Error al quitar la moto del inventario:', error);
        alert('Error al quitar la moto del inventario')
    }
}


// obtener motos
async function obtenerMotoDisponibles() {
    try {
        const response = await fetch('http://localhost:3000/motos?is_estado=true');
        if(!response.ok) {
            throw new Error('No se pudieron obtener las motos disponibles');
        }

        const motosDisponibles = await response.json();

        const tableBody = document.getElementById('moto-table-body');
        tableBody.innerHTML = '';

        motosDisponibles.forEach(moto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${moto.id}</td>
                <td>${moto.marca}</td>
                <td>${moto.linea}</td>
                <td>${moto.modelo}</td>
                <td>${moto.color}</td>
                <td>${moto.venta?'Vendido' : 'Disponible'}</td>
                <td>
                    <button onclick="estadoMoto('${moto.id}')">De baja</button>
                    <button onclick="viewMotoDetails('${moto.id}')">Ver</button>
                    <button onclick="ventaMoto('${moto.id}')">Vendido</button>
                 </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al recuperar moto:', error);
        
    }
}


// funcion ver detalles de la moto
async function viewMotoDetails(id) {
    const moto = await getMotoPorID(id);
    if(moto) {
        alert(`Detalle de la moto:\nID: ${moto.id}\nMarca: ${moto.marca}\nLinea: ${moto.linea}\nModelo: ${moto.modelo}\nColor: ${moto.color}`);
    } else {
        alert('Moto no encontrado o no activo');
    }
}


// funcion para agregar moto al formulario

async function handleAddMoto() {
    document.getElementById('form-error').textContent = '';
    

    const marca = document.getElementById('marca').value.trim();
    const linea = document.getElementById('linea').value.trim();
    const modelo = parseInt(document.getElementById('modelo').value);
    const color = document.getElementById('color').value.trim();

    if (!marca || !linea || !modelo || !color) {
        document.getElementById('form-error').textContent = 'Todos los campos son obligatorios';
        return;
    }

    const moto = { marca, linea, modelo, color};
    const nuevoMoto = await agregarMoto(moto);

    if (nuevoMoto) {
        document.getElementById('marca').value = '';
        document.getElementById('linea').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('color').value = '';

        obtenerMotoDisponibles();
    }
}


obtenerMotoDisponibles()

const validateSale=(estado)=> estado?'Vendido':'Disponible'