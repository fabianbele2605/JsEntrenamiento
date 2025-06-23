async function crearUsuario(usuario) {
    try {
        // Check for duplicate email
        const responseCheck = await fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(usuario.email)}`);
        const existingUsers = await responseCheck.json();
        
        if (existingUsers.length > 0) {
            throw new Error('El correo electrónico ya existe');
        }

        const responseAll = await fetch('http://localhost:3000/usuarios');
        const allUsers = await responseAll.json();
        const maxId = allUsers.reduce((max, user) => Math.max(max, parseInt(user.id) || 0), 0);
        const newId = maxId + 1;

        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...usuario, is_active: true })
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        const nuevoUsuario = await response.json();
        alert('User created successfully!');
        return nuevoUsuario;
    } catch (error) {
        console.error('Error creating user:', error);
        document.getElementById('form-error').textContent = error.message;
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
        console.error('Error fetching user:', error);
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
            throw new Error('No se pudo eliminar el usuario');
        }

        alert('Usuario eliminado');
        obtenerUsuariosActivos(); // Refresh table
    } catch (error) {
        console.error('Error logically deleting user:', error);
        alert('Error logically deleting user');
    }
}

async function obtenerUsuariosActivos() {
    try {
        const response = await fetch('http://localhost:3000/usuarios?is_active=true');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const usuariosActivos = await response.json();
        
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = ''; // Clear existing rows

        usuariosActivos.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.edad}</td>
                <td>${usuario.email}</td>
                <td>
                    <button onclick="eliminarUsuarioLogico('${usuario.id}')">Delete</button>
                    <button onclick="viewUserDetails('${usuario.id}')">View</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al recuperar usuarios:', error);
        alert('Error al recuperar usuarios');
    }
}

async function viewUserDetails(id) {
    const usuario = await getUsuarioPorId(id);
    if (usuario) {
        alert(`Detalles del usuario:\nID: ${usuario.id}\nNombre: ${usuario.nombre}\nEdad: ${usuario.edad}\nEmail: ${usuario.email}`);
    } else {
        alert('User not found or not active');
    }
}

async function handleCreateUser() {
    document.getElementById('form-error').textContent = ''; // Clear previous errors
    
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const email = document.getElementById('email').value.trim();

    if (!nombre || !edad || !email) {
        document.getElementById('form-error').textContent = 'All fields are required';
        return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        document.getElementById('form-error').textContent = 'Formato de correo electrónico no válido';
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