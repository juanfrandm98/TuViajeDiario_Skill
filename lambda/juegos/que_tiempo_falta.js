/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = palabra faltante correcta.
        - param1 = número de ronda.
*/

// Requisitos de otros archivos
const funciones_comunes = require('../funciones_comunes');

// Series temporales
const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const ESTACIONES = ['primavera', 'verano', 'otoño', 'invierno'];

const MAX_RONDAS = 10;

function InicioQueTiempoFalta(handlerInput) {
    const rondaGenerada = GeneraRonda(1);
    const lista = rondaGenerada[0];
    const faltante = rondaGenerada[1];
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0] = 'Vamos a comenzar el juego ¿Qué tiempo falta?. Debes encontrar la palabra que falta en las siguientes series temporales. ';
    respuesta[0] += `Vamos con la primera ronda. Las palabras son: ${lista}`;
    
    // Repromt
    respuesta[1] = 'Tu respuesta debe comenzar así: Falta...';
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'que_tiempo_falta', faltante, respuesta[1]);
    
    // Configuración de los parámetros específicos del juego
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.param1 = 1;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

function ComprobarRespuesta(handlerInput, respuesta_usuario) {
    // Variables comunes para después de resolver la pregunta
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var puntos = sessionAttributes.puntos;
    var palabra_faltante = sessionAttributes.siguiente_respuesta;
    var ronda_actual = sessionAttributes.param1;
    var intent_equivocado = sessionAttributes.intent_equivocado;
    
    // Variable de retorno
    var respuesta = new Array(2);
    
    // Arreglamos el slot para suprimir posibles artículos
    var palabras = respuesta_usuario.split(" ");
    var palabra_usuario;
    if (palabras[0] === 'el' || palabras[0] === 'la')
        palabra_usuario = palabras[1];
    else
        palabra_usuario = palabras[0];
    
    // Comprobación de acierto
    if(palabra_usuario === palabra_faltante) {
        puntos++;
        respuesta[0] = "¡Correcto! ";
    } else {
        respuesta[0] = `Lo siento, la palabra que faltaba era ${palabra_faltante}. `;
    }
    
    sessionAttributes.puntos = puntos;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    // Comprobación del número de ronda
    // Si ya se han hecho 10 rondas, finaliza el juego
    if(ronda_actual < MAX_RONDAS) {
        // Actualización de la ronda
        ronda_actual++;
        
        // Se genera una nueva ronda
        const ronda = GeneraRonda(ronda_actual);
        var lista = ronda[0];
        palabra_faltante = ronda[1];
        
        // Actualización del speach
        respuesta[0] += `Siguiente ronda: ${lista}`;
        respuesta[1] = `Tu respuesta debe comenzar así: Falta... La serie es: ${lista}.`;
        
        // Actualización de las variables de sesión
        sessionAttributes.siguiente_respuesta = palabra_faltante;
        sessionAttributes.param1 = ronda_actual;
        sessionAttributes.intent_equivocado = respuesta[1];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
}

function PasaTurno(handlerInput) {
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var ronda_actual = sessionAttributes.param1;
    
    // Variable de respuesta
    var respuesta = new Array(2);
    
    // Comprobación del número de ronda
    // Si ya se han hecho 10 rondas, finaliza el juego
    if(ronda_actual < MAX_RONDAS) {
        // Actualización de la ronda
        ronda_actual++;
        
        // Se genera una nueva ronda
        const ronda = GeneraRonda(ronda_actual);
        var lista = ronda[0];
        var palabra_faltante = ronda[1];
        
        // Actualización del speach
        respuesta[0] = `Siguiente ronda: ${lista}`;
        respuesta[1] = `Tu respuesta debe comenzar así: Falta... La serie es: ${lista}.`;
        
        // Actualización de las variables de sesión
        sessionAttributes.siguiente_respuesta = palabra_faltante;
        sessionAttributes.param1 = ronda_actual;
        sessionAttributes.intent_equivocado = respuesta[1];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
}

function GeneraRonda(numRonda) {
    var lista;
    var numPalabras = 4;
    
    // En función del número de ronda actual, se seleccionar una de las opciones
    // de etapas temporales
    if(numRonda % 5 === 0) { // Rondas múltiplo de 5
        lista = ESTACIONES; 
    } else if(numRonda % 2 === 0) { // Rondas pares
        lista = MESES;
    } else { // Rondas pares 
        lista = DIAS;
    }
    
    // Se obtiene el índice de la primera compontente de la serie, obteniéndose
    // el resto de forma circular
    var index = funciones_comunes.GetRandomNumber(lista.length - 1, 0);
    
    var lista_ronda= [];
    for(var i = 0; i < numPalabras; i++)
        lista_ronda.push(lista[(index + i) % lista.length]);
    
    // Se selecciona aleatoriamente una de las palabras del centro de la serie
    // para ser separada, dejando un hueco lógico
    index = funciones_comunes.GetRandomNumber(lista_ronda.length - 2, 1);
    var faltante_ronda = lista_ronda[index];
    lista_ronda.splice(index, 1);
    
    // Se prepara la variable de retorno, con los datos de la ronda
    var ronda = [2];
    ronda[0] = lista_ronda;
    ronda[1] = faltante_ronda;
    
    return ronda;
    
}

module.exports = {
    InicioQueTiempoFalta,
    ComprobarRespuesta,
    PasaTurno
}