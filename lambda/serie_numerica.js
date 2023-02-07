/*
    Clase para gestionar fácilmente series numéricas
*/

module.exports = class SerieNumerica {
    
    // Construye una serie numérica de la siguiente forma:
    // - inicio es el primer número de la serie.
    // - tipo es la operación que sigue la serie, puediendo ser suma,
    //   resta, multiplicación o potencia.
    // - variación es la variación que tiene la serie en cada elemento
    // - cantidad es el número de elementos que tiene la serie, contando
    //   el siguiente (fuera del vector serie)
    constructor(inicio, tipo, variacion, cantidad) {
        this.serie = []
        this.siguiente = inicio;
        
        for(var i = 0; i < cantidad - 1; i++) {
            this.serie.push(this.siguiente);
            
            switch(tipo) {
                case '+':
                    this.siguiente += variacion;
                    break;
                
                case '-':
                    this.siguiente -= variacion;
                    break;
                
                case '*':
                    this.siguiente = inicio * (i + 2);
                    break;
                    
                case '^':
                    this.siguiente = Math.pow(inicio, i + 2);
                    break;
            }
        }
    }
    
    // Devuelve el array serie
    getSerie() {
        return this.serie;
    }
    
    // Devuelve el siguiente elemento de la serie
    getSiguiente() {
        return this.siguiente;
    }
    
    // Devuelve un string con la serie numérica (sin el último elemento)
    getStringSerie() {
        var texto = `${this.serie[0]}`;
        
        for(var i = 1; i < this.serie.length; i++)
            texto += `, ${this.serie[i]}`;
            
        return texto;
    }
    
}