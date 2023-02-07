const date = require('date-and-time');
const conexion_server = require('conexion_server');

function GetRandomNumber(max, min) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function ResetParamsPreJuego(handlerInput, nombre_juego, primera_pregunta, pregunta) {
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.juego_actual = nombre_juego;
    sessionAttributes.siguiente_respuesta = primera_pregunta;
    sessionAttributes.puntos = 0;
    sessionAttributes.segundos = 0;
    sessionAttributes.intent_equivocado = pregunta;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

function ResetParamsPostJuego(handlerInput) {
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    if(sessionAttributes.juego_actual === 'maleta' || sessionAttributes.juego_actual === 'lista_compra') {
        sessionAttributes.siguiente_respuesta = '¿CONTINUAR?';
        sessionAttributes.intent_equivocado = '¿Quieres continuar ahora con el segundo juego?';
    } else {
        sessionAttributes.siguiente_respuesta = 'FINAL';
        sessionAttributes.intent_equivocado  = 'Hoy no puedes jugar más, ¿pero quieres saber más cosas sobre ';
        sessionAttributes.intent_equivocado += sessionAttributes.destino.nombre + '?';
    }
    
    sessionAttributes.juego_actual = "ninguno";
    sessionAttributes.puntos = 0;
    sessionAttributes.param1 = 0;
    sessionAttributes.param2 = 0;
    sessionAttributes.param3 = 0;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

function GetPlayTime(handlerInput) {
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const t_fin = new Date();
    var diff = t_fin.getTime() - sessionAttributes.t_ini;
    sessionAttributes.segundos = diff/1000;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

function GetFormattedDate() {
    const now = new Date();
    return date.format(now, 'YYYY/MM/DD HH:mm:ss');
}

function TerminarJuego(handlerInput, respuesta) {
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    GetPlayTime(handlerInput);
    
    respuesta[0] += `Ha finalizado el juego con ${sessionAttributes.puntos} puntos. `;
    
    if(sessionAttributes.juego_actual === 'maleta' || sessionAttributes.juego_actual === 'lista_compra')
        respuesta[0] += '¿Quieres continuar ahora con el segundo juego?';
    else
        respuesta[0] += 'Ya has llegado a ' + sessionAttributes.destino.nombre + '. ¿Quieres saber datos de la ciudad?';
    
    const params = {
        juego: sessionAttributes.juego_actual,
        jugadorID: sessionAttributes.jugadorID,
        fecha: GetFormattedDate(),
        puntos: sessionAttributes.puntos,
        segundos: sessionAttributes.segundos
    }
    
    var respuesta_server = conexion_server.sendResultado(handlerInput, params);
    
    ResetParamsPostJuego(handlerInput);
    
    sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    respuesta[1] = sessionAttributes.intent_equivocado;
    sessionAttributes.respuesta_server = respuesta_server;
    sessionAttributes.params = params;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

// Variables para obtener el email del usuario
const EMAIL_PERMISSION = "alexa::profile:email:read";

async function GetUserEmail(handlerInput) {
    const { serviceClientFactory, responseBuilder } = handlerInput;
    var email = [false, 'email'];
    
    try {
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();
        const profileEmail = await upsServiceClient.getProfileEmail();
        
        if(!profileEmail) {
            email[1] = 'Parece que no tienes un email configurado. Puedes hacerlo en la aplicación de Amazon Alexa.';
        } else {
            email[0] = true;
            email[1] = profileEmail;
        }
    } catch(error) {
        console.log(JSON.stringify(error));
        if(error.statusCode === 403) {
            email[1] = 'PERMISOS';
        } else {
            email[1] = 'Parece que ocurrió un error inesperado.';
        }
    }
    
    return email;
}

async function login(handlerInput) {
    var respuesta = new Array(2);
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const email = await GetUserEmail(handlerInput);
    
    if(email) {
        var respuestaServer = await conexion_server.login(email);
        
        if(respuestaServer.jugadorID) {
            sessionAttributes.jugadorID = respuestaServer.jugadorID;
            sessionAttributes.nombre = respuestaServer.nombre;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            respuesta[1] = '¿Te apetece descubrir un nuevo destino?';
            respuesta[0] = 'Hola, ' + respuestaServer.nombre + ". ¡Bienvenido a tu viaje diario! " + respuesta[1];
        } else {
            respuesta[0] = respuestaServer;
            respuesta[1] = respuestaServer;
        }
    } else {
        respuesta[0] = email[1];
        respuesta[1] = email[1];
    }
    
    return respuesta;
}

module.exports = {
    GetRandomNumber,
    ResetParamsPreJuego,
    ResetParamsPostJuego,
    GetPlayTime,
    GetFormattedDate,
    TerminarJuego,
    GetUserEmail,
    login
}