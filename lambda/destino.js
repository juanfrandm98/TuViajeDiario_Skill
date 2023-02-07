/*
    Clase para gestionar fácilmente destinos de viajes
*/

// Funciones comunes
const funciones_comunes = require('funciones_comunes');

module.exports = class Destino {
    
    // Construye un destino con los siguientes parámetros:
    // nombre = nombre del destino.
    // clima = clima del destino (frio, caliente).
    // situacion = situación geográfica (interior, costa).
    // informacion = array con datos de interés del destino
    constructor(nombre, descripcion, clima, situacion, datos_interes) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.clima = clima;
        this.situacion = situacion;
        this.datos_interes = datos_interes;
    }
    
    getNombre() { return this.nombre; }
    
    getClima() { return this.clima; }
    
    getSituacion() { return this.situacion; }
    
    getEstacion() { return this.estacion; }
    
    getDescripcion() { return this.descripcion; }
    
    setEstacion(estacion) { this.estacion = estacion; }
    
    getDato() {
        const index = funciones_comunes.GetRandomNumber(this.datos_interes.length - 1, 0);
        return this.datos_interes[index];
    }
    
}