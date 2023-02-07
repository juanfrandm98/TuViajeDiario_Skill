/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = número correcto que continúa la serie.
        - param1 = número de ronda.
        - param2 = dificultad.
        - param3 = puntuación que el usuario tenía en la última comprobación.
*/

// Requisitos de otros archivos
const funciones_comunes = require('../funciones_comunes');
const conexion_server = require('../conexion_server');
const SerieNumerica = require('../serie_numerica');

// Tipos de series numéricas para cada dificultad
const TIPOS_LVL_1 = ['+', '-'];
const TIPOS_LVL_2 = ['+', '-', '*'];
const TIPOS_LVL_3 = ['+', '+', '-', '-', '*', '*', '^'];
const TIPOS_LVL_4 = ['-', '-', '*', '*', '^'];

const MAX_RONDAS = 10;

function InicioSeriesNumeros(handlerInput) {
    // Generación de la serie
    var serie = GeneraSerie(1);
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0] = 'Vamos a comenzar el juego de las Series Numéricas. Debes decir qué número es el siguiente en la serie. ';
    respuesta[0] += `Primera ronda: ${serie.getStringSerie()}...`;
    
    // Repromt
    respuesta[1] = `Debes decir cuál es el siguiente número de la serie: ${serie.getStringSerie()}...`;
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'series_numericas', serie.getSiguiente(), respuesta[1]);
    
    // Configuración de los parámetros específicos del juego
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.param1 = 1;
    sessionAttributes.param2 = 2;
    sessionAttributes.param3 = 0;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

function ComprobarSerieNumerica(handlerInput, numero_usuario) {
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
    // Variables comunes para después de resolver la pregunta
    var puntos = sessionAttributes.puntos;
    var numero_correcto = sessionAttributes.siguiente_respuesta;
    var ronda_actual = sessionAttributes.param1;
    var dificultad = sessionAttributes.param2;
    var intent_equivocado = sessionAttributes.intent_equivocado;
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Comprobación de acierto
    if(numero_correcto === numero_usuario) {
        respuesta[0] = '¡Correcto! ';
        puntos++;
    } else {
        respuesta[0] = `Lo siento, el siguiente número era ${numero_correcto}. `;
    }
    
    // Ajuste de dificultad
    dificultad = AjustarDificultad(handlerInput, dificultad, ronda_actual, puntos);
    
    sessionAttributes.puntos = puntos;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    // Comprobación del número de rondas.
    // Si ya se han hecho 10 rondas, finaliza el juego
    if(ronda_actual < MAX_RONDAS) {
        // Generación de una ronda
        var serie = GeneraSerie(dificultad);
        
        // Actualización del speech
        respuesta[0] += `Siguiente ronda: ${serie.getStringSerie()}...`;
        respuesta[1] = `Debes decir cuál es el siguiente número de la serie: ${serie.getStringSerie()}...`;
        
        // Actualización de las variables de sesión
        sessionAttributes.siguiente_respuesta = serie.getSiguiente();
        sessionAttributes.param1 = ronda_actual + 1;
        sessionAttributes.param2 = dificultad;
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
    var puntos = sessionAttributes.puntos;
    var ronda_actual = sessionAttributes.param1;
    var dificultad = sessionAttributes.param2;
    var intent_equivocado = sessionAttributes.intent_equivocado;
    
    // Ajuste de dificultad
    dificultad = AjustarDificultad(handlerInput, dificultad, ronda_actual, puntos);
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Comprobación del número de rondas.
    // Si ya se han hecho 10 rondas, finaliza el juego
    if(ronda_actual < MAX_RONDAS) {
        // Generación de una ronda
        var serie = GeneraSerie(dificultad);
        
        // Actualización del speech
        respuesta[0] = `¡No pasa nada! Siguiente ronda: ${serie.getStringSerie()}...`;
        respuesta[1] = `Debes decir cuál es el siguiente número de la serie: ${serie.getStringSerie()}...`;
        
        // Actualización de las variables de sesión
        sessionAttributes.puntos = puntos;
        sessionAttributes.siguiente_respuesta = serie.getSiguiente();
        sessionAttributes.param1 = ronda_actual + 1;
        sessionAttributes.param2 = dificultad;
        sessionAttributes.intent_equivocado = respuesta[1];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
}

function AjustarDificultad(handlerInput, dificultad, numRonda, puntos_actuales) {
    if(numRonda === 3 || numRonda === 6 || numRonda === 8 || numRonda === 10) {
        // Obtención de la puntuación en el último cambio de dificultad
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var puntos_anteriores = sessionAttributes.param3;
        
        if(numRonda === 3) {
            if(puntos_actuales <= 1 && dificultad > 1)
                dificultad--;
            else if(puntos_actuales === 3 && dificultad < 4)
                dificultad++;
        } else if(numRonda === 6) {
            if((puntos_actuales - puntos_anteriores) <= 1 && dificultad > 1)
                dificultad--;
            else if((puntos_actuales - puntos_anteriores) === 3 && dificultad < 4)
                dificultad++;
        } else if(numRonda === 8) {
            if((puntos_actuales - puntos_anteriores) === 0 && dificultad > 1)
                dificultad--;
            else if((puntos_actuales - puntos_anteriores) === 2 && dificultad < 4)
                dificultad++;
        } else if(numRonda === 10) {
            if((puntos_actuales - puntos_anteriores) === 0 && dificultad > 1)
                dificultad--;
            else if((puntos_actuales - puntos_anteriores) === 2 && dificultad < 4)
                dificultad++;
        }
        
        // Actualización de la puntuación en el último cambio de dificultad
        sessionAttributes.param3 = puntos_actuales;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
    
    return dificultad;
}

function GeneraSerie(dificultad) {
    var inicio;
    var tipo;
    var variacion;
    var cantidad = 5;
    
    switch(dificultad) {
        case 1:
            tipo = TIPOS_LVL_1[Math.floor(Math.random() * TIPOS_LVL_1.length)];
            variacion = 1;
            
            if(tipo === '+')
                inicio = funciones_comunes.GetRandomNumber(5, 1);
            else
                inicio = funciones_comunes.GetRandomNumber(10, 5);
            break;
            
        case 2:
            tipo = TIPOS_LVL_2[Math.floor(Math.random() * TIPOS_LVL_2.length)];
            
            if(tipo === '+') {
                inicio = funciones_comunes.GetRandomNumber(6, 1);
                variacion = funciones_comunes.GetRandomNumber(3, 1);
            } else if(tipo === '-') {
                inicio = funciones_comunes.GetRandomNumber(10, 8);
                variacion = funciones_comunes.GetRandomNumber(2, 1);
            } else {
                inicio = funciones_comunes.GetRandomNumber(3, 1);
                variacion = 0;
            }
            break;
            
        case 3:
            tipo = TIPOS_LVL_3[Math.floor(Math.random() * TIPOS_LVL_3.length)];
               
            if(tipo === '+') {
                 inicio = funciones_comunes.GetRandomNumber(50, 1);
                variacion = funciones_comunes.GetRandomNumber(10, 1);
            } else if(tipo === '-') {
                inicio = funciones_comunes.GetRandomNumber(50, 30);
                variacion = funciones_comunes.GetRandomNumber(5, 1);
            } else if(tipo === '*') {
                inicio = funciones_comunes.GetRandomNumber(5, 2);
                variacion = 0;
            } else {
                inicio = 2;
                variacion = 0;
            }
            break;
            
        case 4:
            tipo = TIPOS_LVL_4[Math.floor(Math.random() * TIPOS_LVL_4.length)];
            
            if(tipo === '-') {
                inicio = funciones_comunes.GetRandomNumber(100, 50);
                variacion = funciones_comunes.GetRandomNumber(10, 1);
            } else if(tipo === '*') {
                inicio = funciones_comunes.GetRandomNumber(10, 2);
                variacion = 0;
            } else {
                inicio = funciones_comunes.GetRandomNumber(3, 2);
                variacion = 0;
            }
            break;
    }
    
    return new SerieNumerica(inicio, tipo, variacion, cantidad);
}

module.exports = {
    InicioSeriesNumeros,
    ComprobarSerieNumerica,
    PasaTurno
}