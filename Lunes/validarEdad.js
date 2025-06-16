// Validar si una edad permite conducir

// creamos la function
function puedesConducir(edad) {
    if(edad >= 16){
        console.log("Tienes edad para conducir")
    }else{
        console.log("No tienes edad para conducir")
    }
}

// aqui llamamos la function "puedesConducir" 
// y le damos el valor del argumento que es la edad
puedesConducir(18)