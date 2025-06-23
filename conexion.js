async function crearUsuario(usuario) {
    try {
        // Comprobar si hay correos electrónicos duplicados
        const responseCheck = await fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(usuario.email)}`);
        const existingUsers = await responseCheck.json();
        
        if (existingUsers.length > 0) {
            throw new Error('El correo electrónico ya existe');
        }

        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...usuario, is_active: true })
        });

        if (!response.ok) {
            throw new Error('No se pudo crear el usuario');
        }

        const nuevoUsuario = await response.json();
        alert('Usuario creado con éxito');
        return nuevoUsuario;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        document.getElementById('error de formulario').textContent = error.message;
        return null;
    }
}

async function getUsuarioPorId(id) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${id}`);
        if (!response.ok) {
            return null;
        }
        const usuario = await response.json();
        return usuario.is_active ? usuario : null;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
}

async function eliminarUsuarioLogico(id) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: false })
        });

        if (!response.ok) {
            throw new Error('No se pudo eliminar lógicamente el usuario');
        }

        alert('Usuario eliminado lógicamente');
        obtenerUsuariosActivos(); // Refresh table
    } catch (error) {
        console.error('Error al eliminar lógicamente el usuario', error);
        alert('Error al eliminar lógicamente el usuario');
    }
}

async function obtenerUsuariosActivos() {
    try {
        const response = await fetch('http://localhost:3000/usuarios?is_active=true');
        if (!response.ok) {
            throw new Error('No se pudieron obtener los usuarios');
        }
        const usuariosActivos = await response.json();
        
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = ''; // Borrar filas existentes

        usuariosActivos.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.edad}</td>
                <td>${usuario.email}</td>
                <td>
                    <button onclick="eliminarUsuarioLogico('${usuario.id}')">Eliminar</button>
                    <button onclick="verDetalleUsuario('${usuario.id}')">Ver</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error fetching users');
    }
}

async function verDetalleUsuario(id) {
    const usuario = await getUsuarioPorId(id);
    if (usuario) {
        alert(`Detalles del usuario:\nID: ${usuario.id}\nName: ${usuario.nombre}\nAge: ${usuario.edad}\nEmail: ${usuario.email}`);
    } else {
        alert('Usuario no encontrado o no activo');
    }
}

async function handleCreateUser() {
    document.getElementById('error de formulario').textContent = ''; // Borrar errores anteriores
    
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const email = document.getElementById('email').value.trim();

    if (!nombre || !edad || !email) {
        document.getElementById('error de formulario').textContent = 'Todos los campos son obligatorios';
        return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        document.getElementById('error de formulario').textContent = 'formato de correo electrónico no válido';
        return;
    }

    const usuario = { nombre, edad, email };
    const nuevoUsuario = await crearUsuario(usuario);
    
    if (nuevoUsuario) {
        // Clear form
        document.getElementById('nombre').value = '';
        document.getElementById('edad').value = '';
        document.getElementById('email').value = '';
        // Refresh table
        obtenerUsuariosActivos();
    }
}