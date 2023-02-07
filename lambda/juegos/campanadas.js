/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = número de campanadas que el usuario debe acertar.
        - param1 = número de ronda
        - param2 = 
*/

// Requisitos de otros archivos
const funciones_comunes = require('../funciones_comunes');
const Util = require('../util.js');

// Sonidos de campanadas
const SONIDO_CAMPANADA_01 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_1.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_02 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_2.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_03 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_3.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_04 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_4.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_05 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_5.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_06 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_6.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_07 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_7.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_08 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_8.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_09 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_9.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_10 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_10.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_11 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_11.mp3").replace(/&/g,'&amp;');
const SONIDO_CAMPANADA_12 = Util.getS3PreSignedUrl("Media/sonidos_para_juegos/campanadas/camp_12.mp3").replace(/&/g,'&amp;');

function InicioCampanadas(handlerInput) {
    // Generación de una ronda
    var ronda = GenerarCampanadas();
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0] = 'Vamos a comenzar el juego de las Campanadas. Debes escuchar el sonido del campanario para decir qué hora es. ';
    respuesta[0] += 'Primera ronda: ' + ronda[1];
    
    // Repromt
    respuesta[1] = 'Debe indicar el número de campanadas que ha escuchado.';
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'campanadas', ronda[0], respuesta[1]);
    
    // Configuración de los parámetros específicos del juego
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.param1 = 1;
    sessionAttributes.param2 = respuesta[0];
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

function ComprobarCampanadas(handlerInput, campanadas_usuario) {
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
    // Variables comunes para después de resolver la pregunta
    var speakOutput;
    var puntos = sessionAttributes.puntos;
    var campanadas_correctas = sessionAttributes.siguiente_respuesta;
    var ronda_actual = sessionAttributes.param1;
    var intent_equivocado = sessionAttributes.intent_equivocado;
    
    // Comprobación de acierto
    if(campanadas_correctas === campanadas_usuario) {
        speakOutput = '¡Correcto! ';
        puntos++;
    } else {
        speakOutput = `Lo siento, eran las ${campanadas_correctas}. `;
    }
    
    sessionAttributes.puntos = puntos;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    // Comprobación del número de rondas.
    // Si ya se han hecho 5 rondas, finaliza el juego
    if(ronda_actual < 5) {
        // Generación de una ronda
        var ronda = GenerarCampanadas();
        
        // Actualización del speech
        speakOutput += 'Siguiente ronda: ' + ronda[1];
        intent_equivocado = '¿Qué hora es?';
        
        // Actualización de las variables de sesión
        sessionAttributes.siguiente_respuesta = ronda[0];
        sessionAttributes.param1 = ronda_actual + 1;
        sessionAttributes.intent_equivocado = intent_equivocado;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
        speakOutput = respuesta[0];
        intent_equivocado = respuesta[1];
    }
        
    // Respuestas a devolver
    var respuesta = new Array(2);
    respuesta[0] = speakOutput;
    respuesta[1] = intent_equivocado;
    
    return respuesta;
}

function GenerarCampanadas() {
    // Se genera un número aleatorio entre 1 y 12 (campanadas)
    var num = Math.floor(Math.random() * (12 - 1 + 1) + 1);
    
    // Generación del audio con las campanadas
    var audio;
        
    switch(num) {
        case 1:
            audio = `<audio src="${SONIDO_CAMPANADA_01}"/>`;
            break;
        case 2:
            audio = `<audio src="${SONIDO_CAMPANADA_02}"/>`;
            break;
        case 3:
            audio = `<audio src="${SONIDO_CAMPANADA_03}"/>`;
            break;
        case 4:
            audio = `<audio src="${SONIDO_CAMPANADA_04}"/>`;
            break;
        case 5:
            audio = `<audio src="${SONIDO_CAMPANADA_05}"/>`;
            break;
        case 6:
            audio = `<audio src="${SONIDO_CAMPANADA_06}"/>`;
            break;
        case 7:
            audio = `<audio src="${SONIDO_CAMPANADA_07}"/>`;
            break;
        case 8:
            audio = `<audio src="${SONIDO_CAMPANADA_08}"/>`;
            break;
        case 9:
            audio = `<audio src="${SONIDO_CAMPANADA_09}"/>`;
            break;
        case 10:
            audio = `<audio src="${SONIDO_CAMPANADA_10}"/>`;
            break;
        case 11:
            audio = `<audio src="${SONIDO_CAMPANADA_11}"/>`;
            break;
        case 12:
            audio = `<audio src="${SONIDO_CAMPANADA_12}"/>`;
            break;
    }
    
    // Construcción de la variable de retorno
    var resultado = new Array(2);
    resultado[0] = num;
    resultado[1] = audio;
    return resultado;
}

module.exports = {
    InicioCampanadas,
    ComprobarCampanadas
}