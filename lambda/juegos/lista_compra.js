/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = SI ó NO (comprar algo).
        - param1 = número de ronda.
        - param2 = elementos que faltan de la lista de la compra.
        - param3 = opción insana ya comprada.
*/

// Carga de archivos
const funciones_comunes = require('../funciones_comunes');

// Vectores de alimentos para el juego
const BASICOS = ['pan', 'agua', 'leche', 'huevos'];
const SANOS = ['manzanas', 'peras', 'naranjas', 'limones', 'lechuga', 'tomate', 'pollo', 'merluza', 'salmón', 'dorada', 'ternera', 'pavo', 'patata', 'pimiento', 'berenjena', 'puerro'];
const INSANOS = ['chocolate', 'cerveza', 'refresco de cola', 'refresco de naranja', 'refresco de limón', 'patatas fritas', 'chucherías', 'pizza', 'galletas', 'helados', 'bombones'];

// Número máximo de rondas por partida
const MAX_RONDAS = 11;

// Tamaño de la lista de la compra
const TAM_LISTA = 3;

function GenerarListaCompra(num) {
    // Comprobamos que los elementos pedidos no superen los existentes
    if(num > BASICOS.length)
        num = BASICOS.length;
        
    // Obtenemos num elementos para la lista
    var lista_compra = new Array();
    var index;
    
    do {
        index = funciones_comunes.GetRandomNumber(BASICOS.length - 1, 0);
        if(!lista_compra.includes(BASICOS[index]))
            lista_compra.push(BASICOS[index]);
    } while(lista_compra.length < TAM_LISTA);
    
    return lista_compra;
}

function GenerarRonda(handlerInput) {
    // Obtención de los atributos de sesión
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var lista_compra = sessionAttributes.param2;
    
    // Obtención del número de ronda
    var ronda = sessionAttributes.param1 + 1;
    var intent_equivocado = sessionAttributes.intent_equivocado;
    
    var respuesta_correcta;
    var output;
    
    // Si es la última ronda
    if(ronda === MAX_RONDAS) {
        respuesta_correcta = lista_compra[0];
        
        output  = 'Ya hemos terminado de comprar. Sólo nos falta una cosa de la lista de la compra. ';
        output += '¿Recuerdas qué era?'
        intent_equivocado = 'Si te acurdas, di lo que falta por comprar, si no te acuerdas, sólo di no.';
    } else {
        var opcion;
        var elemento;
    
        if(lista_compra.length > 1) {
            if(lista_compra.length === MAX_RONDAS - 1 - ronda)
            opcion = 2;
        else(lista_compra.length > 1)
            opcion = funciones_comunes.GetRandomNumber(2,0);
        } else {
            opcion = funciones_comunes.GetRandomNumber(1,0);
        }
        
        var index;
        
        if(opcion === 0) {
            index = funciones_comunes.GetRandomNumber(SANOS.length - 1, 0);
            elemento = SANOS[index];
            respuesta_correcta = 'SI';
        } else if (opcion ===1) {
            index = funciones_comunes.GetRandomNumber(INSANOS.length - 1, 0);
            elemento = INSANOS[index];
            respuesta_correcta = 'NO';
        } else {
            index = funciones_comunes.GetRandomNumber(lista_compra.length - 1, 0);
            elemento = lista_compra[index];
            lista_compra.splice(index, 1);
            respuesta_correcta = 'SI';
        }
        
        // Variable de retorno
        output = `¿Quieres comprar lo siguiente: ${elemento}?`;
        intent_equivocado = 'Responde con sí o no: ' + output;
    }
    
    // Modificación de los atributos de sesión
    sessionAttributes.siguiente_respuesta = respuesta_correcta;
    sessionAttributes.param1 = ronda;
    sessionAttributes.param2 = lista_compra;
    sessionAttributes.intent_equivocado = intent_equivocado;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return output;
}

function InicioListaCompra(handlerInput) {
    // Generación de la lista de la compra
    const lista = GenerarListaCompra(TAM_LISTA);
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0]  = 'Vamos a comenzar el juego de la Lista de la Compra. Primero debes memorizar la ';
    respuesta[0] += `lista de la compra, compuesta por: ${lista}. ¿Necesitas que la repita?`;
    
    // Repromt
    respuesta[1] = '¿Necesitas que te repita la lista de la compra?';
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'lista_compra', 'REPETIR', respuesta[1]);
    
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.param1 = 1;
    sessionAttributes.param2 = lista;
    sessionAttributes.param3 = false;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
    
}

function RepetirLista(handlerInput) {
    // Obtención de las variables de sesión
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Repetición de la lista
    respuesta[0] = `La lista es: ${sessionAttributes.param2}. ¿Necesitas que te la repita? `;
    respuesta[1] = '¿Necesitas que te repita la lista de la compra?';
    
    return respuesta;
}

function ListaMemorizada(handlerInput) {
    // Obtención de las variables de sesión
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    // Generación de la ronda
    const output = GenerarRonda(handlerInput);
    
    // Speech
    var respuesta = new Array(2);
    respuesta[0]  = 'Ahora que estamos en el supermercado, tendrás que decidir qué alimentos comprar. ';
    respuesta[0] += 'Recuerda que sólo puedes comprar un capricho. Primer alimento: ';
    respuesta[0] += output;
    respuesta[1] = `Responde con sí o no: ${output}`;
    
    return respuesta;
    
}

function ComprobarRespuesta(handlerInput, respuesta_usuario) {
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const ronda = sessionAttributes.param1;
    const respuesta_correcta = sessionAttributes.siguiente_respuesta;
    var puntos = sessionAttributes.puntos;
    var intent_equivocado = sessionAttributes.intent_equivocado;
    var capricho_cogido = sessionAttributes.param3;
    
    // Variable de retorno
    var respuesta = new Array(2);
    
    if(respuesta_correcta === 'SI') {
        if(respuesta_usuario === respuesta_correcta) {
            puntos++;
            respuesta[0] = '¡Correcto! ';
        } else {
            respuesta[0] = 'Ese era un alimento sano que tendrías que haber cogido. ';
        }
    } else if(respuesta_correcta === 'NO') {
        if(respuesta_usuario === respuesta_correcta) {
            puntos++;
            respuesta[0] = '¡Correcto!';
        } else if(!capricho_cogido) {
            capricho_cogido = true;
            puntos++;
            respuesta[0] = 'De acuerdo, este será tu capricho del día, pero el resto de la compra tendrá que ser sana. ';
        } else {
            respuesta[0] = 'Lo siento, ya sólo deberías comprar alimentos saludables. ';
        }
    } else {
        // Arreglamos el slot para suprimir posibles artículos
        var palabras = respuesta_usuario.split(" ");
        var palabra_usuario;
        if (palabras[0] === 'el' || palabras[0] === 'la' ||
            palabras[0] === 'los' || palabras[0] === 'las')
            palabra_usuario = palabras[1];
        else
            palabra_usuario = palabras[0];
        
        if(respuesta_correcta === palabra_usuario) {
            puntos += 3;
            respuesta[0] = '¡Correcto! ';
        } else {
            respuesta[0]  = `Había que comprar ${sessionAttributes.param2[0]}`;
            respuesta[0] += ', pero no te preocupes. Lo compraremos el próximo día. ';
        }
    }
    
    sessionAttributes.puntos = puntos;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    if(ronda < MAX_RONDAS) {
        // Generación de una nueva ronda
        const output = GenerarRonda(handlerInput);
        respuesta[0] += output;
        respuesta[1] = 'Responde sí o no: ' + output;
        
        // Modificación de las variables de sesión
        sessionAttributes.param3 = capricho_cogido;
        sessionAttributes.intent_equivocado = intent_equivocado;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
    
}

function PasaTurno(handlerInput) {
    // Obtención de los atributos de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    // Variable de retorno
    var respuesta = new Array(2);
    respuesta[0] = 'No pasa nada. ';
    
    if(sessionAttributes.param1 < MAX_RONDAS) {
        // Generación de una nueva ronda
        const output = GenerarRonda(handlerInput);
        respuesta[0] += output;
        respuesta[1] = 'Responde sí o no: ' + output;
        
        // Modificación de las variables de sesión
        sessionAttributes.intent_equivocado = respuesta[1];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
}

module.exports = {
    InicioListaCompra,
    RepetirLista,
    ListaMemorizada,
    ComprobarRespuesta,
    PasaTurno
}