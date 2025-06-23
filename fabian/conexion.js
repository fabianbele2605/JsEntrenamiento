
async function crearUsuario(usuario) {
    try {
        //duplicado de email
        const reponseCheck = await fetch("http://localhost:3000/usuarios?email=${encodeURIComponent(usuario.email)}");
        const existingUser = await responseCheck.json();
        
        if (existingUser.length > 0) {
            throw new Error("Error, este correo ya exite.");
        }

        const reponse = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ ...usuario, is_active: true })
        });

        if (!reponse.ok) {
            throw new Error("No se pudo crear el usuario");
        }

        const nuevoUsuario = await reponse.json();
        alert("¡Usuario creado exitosamente!");
        return nuevoUsuario;
    } catch (error) {
        console.error("'Error al crear el usuario:", error);
        document.getElementById("error de formulario").textContent = error.message;
        return null
    }
}

async function getUsuarioPorId(id) {
    try {
        const reponse = await fetch("http://localhost:3000/usuarios/?${id}");
        if(reponse.ok) {
            return null;
        }
        const usuario = await Response.json();
        return usuario.is_active ? usuario : null;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return null
    }
}

async function eliminarUsuarioLogico(id) {
    try {
        const reponse = await fetch("http://localhost:3000/usuarios/?${id}", {
            method: "PATCH",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({ is_active: false})
        });
        
        if (!reponse.ok) {
            throw new Error("No se pudo eliminar lógicamente el usuario");
        }

        alert("Usuario eliminado lógicamente");
        obtenerUsuariosActivos(); // actualizar tabla
    } catch (error) {
        console.error("Error al eliminar lógicamente el usuario", error);
        alert("Error al eliminar lógicamente el usuario");
    }
}

async function obtenerUsuariosActivos() {
    try {
        const reponse = await fetch("http://localhost:3000/usuarios?is_active=true");
        if(!reponse.ok) {
            throw new Error("No se pudieron obtener los usuarios");
        }

        const usuariosActivos = await reponse.json();

        const tableBody = document.getElementById("users-table-body");
        tableBody.innerHTML = ""; // borrar las filas existente

        usuariosActivos.forEach(usuario => {
            const row = document.createElement("tr");
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
        console.error("Error al obtener usuarios:", error);
        alert("Error al recuperar usuarios")
    }
}


async function verDetalleUsuario(id) {
    const usuario = await get.getUsuarioPorId(id);
    if(usuario) {
        alert(`Detalle Usuario:\nID: ${usuario.id}\nNombre: ${usuario.nombre}\nEdad: ${usuario.edad}\nEmail: ${usuario.email} `);
    } else {
        alert("Usuario no encontrado o no activo");
    }
}


async function manejarCrearUsuario() {
    document.getElementById("error de formulario").textContent = ""; // borrar datos anteriores

    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const email = document.getElementById("email").value.trim();

    if (!nombre || !edad || !email) {
        document.getElementById("error de formulario").textContent = "Todos los campos son obligatorios";
        return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        document.getElementById("error de formulario").textContent = "formato de correo electrónico no válido";
        return;
    }

    const usuario = { nombre, edad, email};
    const nuevoUsuario = await crearUsuario(usuario);

    if (nuevoUsuario) {
        // borra formulario
        document.getElementById("nombre").value = "";
        document.getElementById("edad").value = "";
        document.getElementById("email").value = "";
        // actualizar tabla
        obtenerUsuariosActivos();
    }
}
