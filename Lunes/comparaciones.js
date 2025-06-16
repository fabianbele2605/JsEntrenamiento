// El operador de comparacion (==) comprueba si sus dos operandos son iguales 
// y devuelve un resultado booleano
// . A diferencia del operador de igualdad estricta (===),
//  es que este convierte y compara operandos que son de diferentes tipos.

// aqui nos dara un valor true 
console.log( 4 == 4)


// aqui nos dara un valor false, porque la comparacion es mucho mas estricta, compara los valores y tipos
console.log("Hola" === "hola")

// aqui nos dara el valor true ,porque la comparacion de == es mas flexibe solo compara los valores
console.log("5" == 5 )

// aqui nos dara un valor false, porque la comparacion es mucho mas estricta, compara los valores y tipos
console.log("5" === 5)

// aqui nos dara el valor true ,porque la comparacion de == es mas flexibe solo compara los valores
console.log(0 == false)
// aqui nos dara un valor false, porque la comparacion es mucho mas estricta, compara los valores y tipos
console.log(0 === false)