//const axios = require('axios');
const https = require('https');
const fs = require('fs');
const querystring = require('querystring');

// ------------------------------------------------------------------------------------------------------------------------------------
// DIRECCIONES DEL SERVIDOR
// Dirección raíz
const url_host = 'tuviajediario.es';
// Direcciones de peticiones
const url_prueba = '/testAlexa';                    // URL para la primera prueba de conexión
const url_getJuego = '/getRandomJuego';             // URL para obtener los datos de un juego aleatorio ()
const url_sendResultado = '/addResultado';          // URL para enviar los resultados de una partida
const url_getDestino = '/getRandomDestino';         // URL para obtener los datos de un destino aleatorio
const url_getAudioCampanada = '/getAudioCampanada'; // URL para obtener los audios para el juego de las campanadas
const url_login = '/loginSkill';                    // URL para realizar el login automático
// ------------------------------------------------------------------------------------------------------------------------------------

function getData(options, postData) {
    return new Promise(function(resolve, reject) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        
        var request = https.request(options, function(response) {
            // Reject if status is not 2xxx (not a successful response)
            if(response.statusCode < 200 || response.getStatusCode >= 300) {
                resolve(response.statusCode);
                return reject(new Error("statusCode=" + response.statusCode));
            }
            
            // Status is in 2xx
            // cumulate data
            var body = [];
            response.on("data", function(chunk) {
                body.push(chunk);
            });
            
            // When process ends 
            response.on("end", function() {
                try {
                    var contentType = response.headers['content-type'];
                    
                    if(contentType.includes('text/plain'))
                        body = body.toString();
                    else if(contentType === 'application/json')
                        body = JSON.parse(Buffer.concat(body).toString());
                    else if(contentType === 'audio/mpeg') {
                        /**
                         * Aquí irá el código de tratamiento del archivo
                         **/
                    } else
                        body = "Content Type inesperado (" + contentType + ").";
                } catch(error) {
                    reject(error);
                }
                
                resolve(body);
            });
        });
        
        // Manage other request errors 
        request.on("error", function(error) {
            reject(error);
        });
        
        // End the request. It's important
        request.end();
    }); // Promise ends
}

async function getRandomJuego(tipo) {
    // Raw params
    const params = {
        tipo: tipo
    }

    const queryParams = querystring.stringify(params);
    
    let options = {
        host: url_host,
        path: url_getJuego + "?" + queryParams,
        method: "GET"
    }
    
    try {
        let jsonData = await getData(options);
        return jsonData;
    } catch(error) {
        console.log(error);
    }
    
    return "ERROR";
}

/*
    Los datos enviados deben introducirse en un JSON con los siguientes campos:
    juego - jugador - fecha - puntos - segundos
*/
async function sendResultado(handlerInput, params) {
    const body = {
        json: JSON.stringify(params)
    }

    const queryParams = querystring.stringify(body);
    
    let options = {
        host: url_host,
        path: url_sendResultado + "?" + queryParams,
        method: "GET"
    }
    
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.query = url_sendResultado + "?" + queryParams;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    try {
        let jsonData = await getData(options);
        return jsonData;
    } catch(error) {
        console.log(error);
    }
    
    return 'ALCACHOFA';
}

async function getRandomDestino() {
    let options = {
        host: url_host,
        path: url_getDestino,
        method: "GET"
    }
    
    try {
        let jsonData = await getData(options);
        return jsonData;
    } catch(error) {
        console.log(error);
    }
}

async function getAudioCampanada(numCampanadas) {
    const params = {
        num: numCampanadas
    }

    const queryParams = querystring.stringify(params);
    
    let options = {
        host: url_host,
        path: url_getAudioCampanada + "?" + queryParams,
        method: "GET"
    }
    
    try {
        let audio = await getData(options);
        return audio;
    } catch(error) {
        console.log(error);
    }
}

async function login(email) {
    const params = {
        email: email
    }
    
    const queryParams = querystring.stringify(params);
    
    let options = {
        host: url_host,
        path: url_login + "?" + queryParams,
        method: "GET"
    }
    
    try {
        let respuesta = await getData(options);
        return respuesta;
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    getRandomJuego,
    sendResultado,
    getRandomDestino,
    getAudioCampanada,
    login
}