function dividir(diviendo, divisor) {
  try {
    if(divisor === 0) {
      throw new Error("No se puede dividir por 0.");
    }
    return diviendo / divisor
  } catch (error) {
    console.error("Error al dividir:", error.message);
    return null
  }
}

let resultadoTrue = dividir(50, 2);
console.log(resultadoTrue)

let resultadoFalse = dividir(50, 0)
console.log(resultadoFalse)