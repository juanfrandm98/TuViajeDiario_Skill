/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = respuesta correcta esperada del usuario.
        - param1 = número de ronda.
        - param2 = tipo de ronda (afirmacion - eleccion).
*/

// Carga de archivos
const funciones_comunes = require('../funciones_comunes');
const Destino = require('../destino');

// Vectores de elementos para el juego
const ROPA_INVIERNO = ['abrigo', 'cazadora', 'jersey', 'sudadera', 'pantalón largo', 'gorro', 'camiseta de manga larga', 'botas', 'bufanda', 'paraguas', 'chubasquero', 'camisa de manga larga'];
const ROPA_VERANO = ['camiseta de manga corta', 'pantalón corto', 'bermudas', 'zapato abierto', 'gafas de sol', 'gorra', 'camisa de manga corta', 'sombrero'];
const ROPA_COSTA = ['chanclas', 'toalla de playa', 'bañador', 'crema solar', 'sombrilla', 'pelota de playa'];
const ROPA_SIEMPRE = ['cepillo de dientes', 'peine', 'ropa interior', 'pijama', 'colonia', 'desodorante', 'cinturón'];

// Número máximo de rondas por partida
const MAX_RONDAS = 10;

function CompruebaPrendaAdecuada(vector, destino) {
    var adecuado;
    
    switch(vector) {
        case 0:
            if((destino.estacion === 'verano') ||
               (destino.estacion === 'otoño' && destino.clima === 'caliente') ||
               (destino.estacion === 'primavera' && destino.clima === 'caliente'))
                adecuado = false;
            else
                adecuado = true;
            break;
            
        case 1:
            if((destino.estacion === 'verano') ||
               (destino.estacion === 'otoño' && destino.clima === 'caliente') ||
               (destino.estacion === 'primavera' && destino.clima === 'caliente'))
                adecuado = true;
            else
                adecuado = false;
            break;
            
        case 2:
            if(destino.situacion === 'costa' && destino.estacion !== 'invierno')
                adecuado = true;
            else
                adecuado = false;
            break;
            
        case 3:
            adecuado = true;
            break;
    }
    
    return adecuado;
}

function GenerarRonda(handlerInput) {
    // Obtención de los atributos de sesión
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    var ronda = sessionAttributes.param1 + 1;
    
    // Selección del tipo de ronda
    var tipo_ronda;
    if(ronda % 3 === 0) {
        tipo_ronda = 'eleccion';
    } else {
        tipo_ronda = 'afirmacion';
    }
    
    var elemento;
    var respuesta;
    var output;
    var adecuado;
    
    switch(tipo_ronda) {
        case 'afirmacion':
            var vector = funciones_comunes.GetRandomNumber(6,0);
            var index;
            
            switch(vector) {
                case 0: case 1:
                    vector = 0;
                    index = funciones_comunes.GetRandomNumber(ROPA_INVIERNO.length - 1, 0);
                    elemento = ROPA_INVIERNO[index];
                    break;
                case 2: case 3:
                    vector = 1;
                    index = funciones_comunes.GetRandomNumber(ROPA_VERANO.length - 1, 0);
                    elemento = ROPA_VERANO[index];
                    break;
                case 4: case 5:
                    vector = 2;
                    index = funciones_comunes.GetRandomNumber(ROPA_COSTA.length - 1, 0);
                    elemento = ROPA_COSTA[index];
                    break;
                case 6:
                    vector = 3;
                    index = funciones_comunes.GetRandomNumber(ROPA_SIEMPRE.length - 1, 0);
                    elemento = ROPA_SIEMPRE[index];
                    break;
            }
            
            adecuado = CompruebaPrendaAdecuada(vector, sessionAttributes.destino);
            
            if(adecuado)
                respuesta = 'SI';
            else
                respuesta = 'NO';
                
            output = `¿Tienes que echar en la maleta lo siguiente: ${elemento}?`;
            break;
        
        case 'eleccion':
            // Selección de los elementos de la ronda
            const index_verano = funciones_comunes.GetRandomNumber(ROPA_VERANO.length - 1, 0);
            const elemento_verano = ROPA_VERANO[index_verano];
            const index_invierno = funciones_comunes.GetRandomNumber(ROPA_INVIERNO.length - 1, 0);
            const elemento_invierno = ROPA_INVIERNO[index_invierno];
            
            // Comprobación de si el elemento invernal es adecuado
            adecuado = CompruebaPrendaAdecuada(0, sessionAttributes.destino);
            
            if(adecuado)
                respuesta = elemento_invierno;
            else
                respuesta = elemento_verano;
                
            // Se aleatoriza la posición de los elementos en la pregunta
            const orden_aleatorio = funciones_comunes.GetRandomNumber(1,0);
            if(orden_aleatorio === 0)
                output = `Elige qué echar en la maleta: ¿${elemento_invierno} o ${elemento_verano}?`;
            else
                output = `Elige qué echar en la maleta: ¿${elemento_verano} o ${elemento_invierno}?`;
            break;
    }
    
    sessionAttributes.siguiente_respuesta = respuesta;
    sessionAttributes.param1 = ronda;
    sessionAttributes.param2 = tipo_ronda;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return output;
    
}

function InicioMaleta(handlerInput) {
    // Generación de la primera ronda
    const output = GenerarRonda(handlerInput);
    
    // Obtención de las variables de sesión
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0]  = 'Vamos a comenzar el juego de la Maleta. Debes contestar las siguientes preguntas para hacer tu maleta para el viaje a ';
    respuesta[0] += `${sessionAttributes.destino.nombre}. Primera pregunta: ${output}`;
    
    // Repromt
    respuesta[1] = `Debes contestar a la siguiente pregunta: ${output}`;
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'maleta', sessionAttributes.siguiente_respuesta, respuesta[1]);
    
    return respuesta;
}

function ComprobarRespuesta(handlerInput, respuesta_usuario) {
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var respuesta_correcta = sessionAttributes.siguiente_respuesta;
    var puntos = sessionAttributes.puntos;
    var ronda = sessionAttributes.param1;
    var tipo_ronda = sessionAttributes.param2;
    
    // Variable de retorno 
    var respuesta = new Array(2);
    
    // Comprobación de acierto
    if(respuesta_usuario.includes(respuesta_correcta)) {
        puntos++;
        respuesta[0] = '¡Correcto! '
    } else {
        if(tipo_ronda === 'afirmacion') {
            if(respuesta_usuario === 'SI')
                respuesta[0] = 'No tendrías que haberlo metido, pero no pasa nada. ';
            else
                respuesta[0] = 'Tendrías que haberlo metido, pero no pasa nada. ';
        } else {
            respuesta[0] = `Tendrías que haber metido ${respuesta_correcta} mejor, pero no pasa nada. `;
        }
    }
    
    sessionAttributes.puntos = puntos;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    // Comprobación de la ronda actual
    if(ronda < MAX_RONDAS) {
        const output = GenerarRonda(handlerInput);
        
        respuesta[0] += `Siguiente pregunta: ${output}`;
        respuesta[1] = `Debes contestar a la siguiente pregunta: ${output}`;
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
    
    // Variable de retorno
    var respuesta = new Array(2);
    respuesta[0] = 'No pasa nada. ';
    
    // Comprobación de la ronda actual
    if(sessionAttributes.param1 < MAX_RONDAS) {
        const output = GenerarRonda(handlerInput);
        
        respuesta[0] += `Siguiente pregunta: ${output}`;
        respuesta[1] = `Debes contestar a la siguiente pregunta: ${output}`;
        sessionAttributes.intent_equivocado = respuesta[1];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
}

const MetoMaletaIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MetoMaletaIntent'
            && (sessionAttributes.juego_actual === 'maleta' && sessionAttributes.param2 === 'eleccion');
    },
    handle(handlerInput) {
        // Obtención de la palabra introducida por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const prenda_usuario = intent.slots.prenda.value;
        
        var respuesta = ComprobarRespuesta(handlerInput, prenda_usuario)
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
}

module.exports = {
    InicioMaleta,
    ComprobarRespuesta,
    MetoMaletaIntentHandler,
    PasaTurno
}