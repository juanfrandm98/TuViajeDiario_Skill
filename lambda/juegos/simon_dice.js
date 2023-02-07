/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = cadena de palabras actual que el usuario tiene que replicar.
        - param1 = temática de la cadena de palabras
        - param2 = lista de palabras de la temática seleccionada
*/

// Requisitos de otros archivos
const funciones_comunes = require('../funciones_comunes');

// Obtención de diccionarios
const DICCIONARIOS = require('../diccionarios');

// Lista de temáticas
const TEMATICAS = DICCIONARIOS.TEMATICAS;

function InicioSimonDice(handlerInput) {
    // Generación de la temática de la partida
    var tematica = TEMATICAS[Math.floor(Math.random() * TEMATICAS.length)];
    var lista_palabras;
    var primera_palabra;
    
    // Selección de la lista de palabras correspondiente
    lista_palabras = DICCIONARIOS.getListaPorTematica(tematica);
    
    primera_palabra = GeneraSiguientePalabra(lista_palabras);
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0] = 'Vamos a comenzar el juego Simón Dice. Debes repetir la serie de palabras que yo iré incrementando. ';
    respuesta[0] += `Esta vez vamos a jugar con ${tematica}. Empiezo: Simón Dice: ${primera_palabra} Final.`;
    
    // Repromt
    respuesta[1] = `Recuerda que la serie debe empezar por las palabras Simón Dice y terminar por la palabra Final. Simón Dice: ${primera_palabra} Final.`;
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'simon_dice', primera_palabra, respuesta[1]);
    
    // Configuración de los parámetros específicos del juego
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.param1 = tematica;
    sessionAttributes.param2 = lista_palabras;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

function GeneraSiguientePalabra(lista_palabras) {
    return lista_palabras[Math.floor(Math.random() * lista_palabras.length)];
}

function CompruebaSimonDice(textoCorrecto, textoUsuario) {
    // Obtenemos listas de palabras separadas por espacios
    const listaCorrecta = textoCorrecto.split(" ");
    const listaUsuario  = textoUsuario.split(" ");
    
    // Variable de retorno, que indica si el texto del usuario es correcto 
    var todoBien = true;
    
    // iteradores
    var i = 0; // sobre listaCorrecta
    var j = 0; // sobre listaUsuario
    
    // Comprobación de error
    for(i; i < listaCorrecta.length && todoBien; i++) {
        // Quitamos posibles palabras que el usuario pueda introducir y que conducirían a error
        while(listaUsuario[j] === "y" || listaUsuario[j] === "el" || listaUsuario[j] === "la" ||
              listaUsuario[j] === "los" || listaUsuario[j] === "las")
            j++;
        
        // Comprobamos que las palabras coincidan en el mismo orden
        if(listaCorrecta[i] !== listaUsuario[j])
            todoBien = false;
        
        // Aumentamos el iterador j
        j++;
    }
    
    return todoBien;
}

const SimonDiceIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SimonDiceIntent'
            && sessionAttributes.juego_actual === 'simon_dice';
    },
    handle(handlerInput) {
        // Obtención de la serie de palabras introducida por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const serie_plana = intent.slots.serie.value;
        
        // Obtención de las variables de sesión
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        // Variables comunes para después de resolver la pregunta
        var respuesta = new Array(2);
        var puntos = sessionAttributes.puntos;
        var serie_correcta = sessionAttributes.siguiente_respuesta;
        var intent_equivocado = sessionAttributes.intent_equivocado;
        
        // Comprobación de la serie actual
        if(CompruebaSimonDice(serie_correcta, serie_plana)) {
            puntos++;
    
            // Adición de nueva palabra
            serie_correcta += " " + GeneraSiguientePalabra(sessionAttributes.param2);
            
            respuesta[0] = "Simón Dice: " + serie_correcta + " Final.";
            respuesta[1] = `Recuerda que la serie debe empezar por las palabras Simón Dice y terminar por la palabra Final. Simón Dice: ${serie_correcta} Final.`;
            
            // Actualización de las variables de sesión
            sessionAttributes.puntos = puntos;
            sessionAttributes.siguiente_respuesta = serie_correcta;
            sessionAttributes.intent_equivocado = respuesta[1];
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } else {
            respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
        }
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
        
    }
}

async function PasaTurno(handlerInput) {
    var respuesta = new Array("", "");
    return funciones_comunes.TerminarJuego(handlerInput, respuesta);
}

module.exports = {
    SimonDiceIntentHandler,
    InicioSimonDice,
    PasaTurno
}