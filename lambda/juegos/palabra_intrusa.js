/*
    En este juego, los parámetros de sesión se utilizan de la siguiente manera:
        - siguiente_respuesta = palabra intrusa que el usuario debe decir.
        - param1 = número de ronda
    En un futuro
        - param2 = nivel de dificultad
*/

// Requisitos de otros archivos
const funciones_comunes = require('../funciones_comunes');

// Obtención de diccionarios
const DICCIONARIOS = require('../diccionarios');

// Lista de temáticas
const TEMATICAS = DICCIONARIOS.TEMATICAS;
const MAX_RONDAS = 10;

function InicioPalabraIntrusa(handlerInput) {
    const rondaGenerada = GeneraSiguienteSerie(4, 1);
    const serie = rondaGenerada[0];
    const intrusa = rondaGenerada[1];
    
    // Respuestas a devolver
    var respuesta = new Array(2);
    
    // Texto de bienvenida al juego
    respuesta[0] = 'Vamos a comenzar el juego Palabra Intrusa. Debes encontrar la palabra que no encaja con las demás. ';
    respuesta[0] += `Vamos con la primera ronda. Las palabras son: ${serie}`;
    
    // Repromt
    respuesta[1] = `Tu respuesta debe comenzar así: La palabra intrusa es... Las palabras son: ${serie}`;
    
    // Configuración de los parámetros iniciales básicos del juego
    funciones_comunes.ResetParamsPreJuego(handlerInput, 'palabra_intrusa', intrusa, respuesta[1]);
    
    // Configuración de los parámetros específicos del juego
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.param1 = 1;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

const PalabraIntrusaIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PalabraIntrusaIntent'
            && sessionAttributes.juego_actual === 'palabra_intrusa';
    },
    handle(handlerInput) {
        // Obtención de la palabra introducida por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const palabras_usuario_planas = intent.slots.palabraIntrusa.value;
        const palabras_usuario = palabras_usuario_planas.split(' ');
        
        // Obtención de las variables de sesión
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        // Variables comunes para después de resolver la pregunta
        var respuesta = new Array(2);
        var puntos = sessionAttributes.puntos;
        var palabra_incorrecta = sessionAttributes.siguiente_respuesta;
        var ronda_actual = sessionAttributes.param1;
        var intent_equivocado = sessionAttributes.intent_equivocado;
        
        // Fallo por defecto
        if(palabra_incorrecta.length === 1)
            respuesta[0] = `Lo siento, la palabra intrusa era ${palabra_incorrecta[0]}. `;
        else {
            respuesta[0] = `Lo siento, las palabras intrusas eran: `;
            for(var palabra in palabra_incorrecta)
                respuesta[0] += `${palabra} `;
        }
        
        // Comprobación de la palabra incorrecta
        var todas_correctas = true;
        
        for(var i = 0; i < palabra_incorrecta.length && todas_correctas; i++)
            if(!palabras_usuario.includes(palabra_incorrecta[i]))
                todas_correctas = false;
        
        if(todas_correctas) {
            respuesta[0] = "¡Correcto! ";
            puntos++;
        }
        
        sessionAttributes.puntos = puntos;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        // Comprobación del número de ronda
        // Si ya se han hecho 10 rondas, finaliza el juego
        if(ronda_actual < MAX_RONDAS) {
            // Se genera una nueva ronda
            const rondaGenerada = GeneraSiguienteSerie(4, 1);
            var serie = rondaGenerada[0];
            palabra_incorrecta = rondaGenerada[1];
            
            // Actualización del speach
            respuesta[0] += `Siguiente ronda: ${serie}`;
            respuesta[1] = `Tu respuesta debe comenzar así: La palabra intrusa es... Las palabras son: ${serie}`;
            
            // Actualización de las variables de sesión
            sessionAttributes.siguiente_respuesta = palabra_incorrecta;
            sessionAttributes.param1 = ronda_actual + 1;
            sessionAttributes.intent_equivocado = intent_equivocado;
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

function GeneraSiguienteSerie(num_palabras_correctas, num_palabras_intrusas) {
    // Variable de retorno
    // - ronda[0] contendrá la lista de palabras de la ronda 
    // - ronda[1] contendrá la palabra intrusa
    var ronda = new Array(2);
    
    // Selección de temáticas
    var tematica_correcta = TEMATICAS[Math.floor(Math.random() * TEMATICAS.length)];
    var tematica_intrusa;
    
    do {
        tematica_intrusa = TEMATICAS[Math.floor(Math.random() * TEMATICAS.length)];
    } while(tematica_correcta === tematica_intrusa)
    
    // Generación de las palabras correctas
    var lista_palabras = DICCIONARIOS.getListaPorTematica(tematica_correcta);
    var serie = generaSerieSinRepetidas(lista_palabras, num_palabras_correctas)
    
    // Generación de las palabras intrusas
    var lista_intrusas = DICCIONARIOS.getListaPorTematica(tematica_intrusa)
    var serie_intrusas = generaSerieSinRepetidas(lista_intrusas, num_palabras_intrusas);
        
    // Suma de la serie con la palabra intrusa
    for(var i = 0; i < serie_intrusas.length; i++)
        serie.push(serie_intrusas[i]);
    
    // Barajar la serie
    serie = barajar(serie);
    
    // Configuración de la variable de retorno
    ronda[0] = serie;
    ronda[1] = serie_intrusas;
    
    return ronda;
}

function generaSerieSinRepetidas(lista_original, num) {
    var serie = new Array();
    
    for(var i = 0; i < num; i++) {
        var palabra = lista_original[Math.floor(Math.random() * lista_original.length)];
        if(!serie.includes(palabra))
            serie.push(palabra);
        else
            i--;
    }
    
    return serie;
}

function barajar(input) {
    var output = new Array();
    
    do {
        var index = Math.floor(Math.random() * input.length);
        output.push(input[index]);
        input.splice(index, 1);
    } while(input.length > 0)
    
    return output;
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
        // Se genera una nueva ronda
        const rondaGenerada = GeneraSiguienteSerie(4, 1);
        var serie = rondaGenerada[0];
        const palabra_incorrecta = rondaGenerada[1];
        
        // Actualización del speach
        respuesta[0] = `¡No pasa nada! Siguiente ronda: ${serie}`;
        respuesta[1] = `Tu respuesta debe comenzar así: La palabra intrusa es... Las palabras son: ${serie}`;
        
        // Actualización de las variables de sesión
        sessionAttributes.siguiente_respuesta = palabra_incorrecta;
        sessionAttributes.param1 = ronda_actual + 1;
        sessionAttributes.intent_equivocado = respuesta[1];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } else {
        respuesta = funciones_comunes.TerminarJuego(handlerInput, respuesta);
    }
    
    return respuesta;
}

module.exports = {
    PalabraIntrusaIntentHandler,
    InicioPalabraIntrusa,
    PasaTurno
}