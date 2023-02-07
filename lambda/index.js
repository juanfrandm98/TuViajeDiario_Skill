/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// Otros archivos
const funciones_comunes = require('funciones_comunes');
const simon_dice = require('./juegos/simon_dice');
const palabra_intrusa = require('./juegos/palabra_intrusa');
const campanadas = require('./juegos/campanadas');
const series_numeros = require('./juegos/series_numeros');
const que_tiempo_falta = require('./juegos/que_tiempo_falta');
const maleta = require('./juegos/maleta');
const lista_compra = require('./juegos/lista_compra');
const Destino = require('destino');
const conexion_server = require('conexion_server');

// Función que devuelve un juego de forma aleatoria
// El texto devuelto es el que puede usarse en el atributo de sesión 'juego_actual'
// DEPRECATED
/*
function SeleccionarJuegoAleatorio() {
    const JUEGOS = ['simon_dice', 'palabra_intrusa', 'campanadas', 'series_numericas', 'que_tiempo_falta'];
    const index = funciones_comunes.GetRandomNumber(JUEGOS.length - 1, 0);
    return JUEGOS[index];
}*/

// Función que devuelve un juego de forma aleatoria, de entre la lista de los juegos de preparación
// El texto devuelto es el que puede usarse en el atributo de sesión 'juego_actual'
// DEPRECATED
/*
function SeleccionarJuegoPreparacionAleatorio() {
    const JUEGOS = ['maleta', 'lista_compra'];
    const index = funciones_comunes.GetRandomNumber(JUEGOS.length - 1, 0);
    return JUEGOS[index];
}*/

// Función que devuelve el nombre de un juego preparado para su reproducción
// DEPRECATED
/*
function PrintNombreJuego(juego) {
    switch(juego) {
        case 'test_simple':
            return 'Test Simple';
        case 'simon_dice':
            return 'Simón Dice';
        case 'palabra_intrusa':
            return 'La Palabra Intrusa';
        case 'campanadas':
            return 'Las Campanadas';
        case 'series_numericas':
            return 'Series Numéricas';
        case 'que_tiempo_falta':
            return '¿Qué Tiempo Falta?';
        case 'maleta':
            return 'La Maleta';
        case 'lista_compra':
            return 'La Lista de la Compra';
        default:
            return 'Juego Desconocido'
    }
}*/

// Función que devuelve el código interno de un juego en función del juego introducido por el usuario
function GetCodigoJuego(juego_usuario) {
    switch(juego_usuario.toLowerCase()) {
        case 'test simple':
            return 'test_simple';
        case 'simón dice': case 'simon dice':
            return 'simon_dice';
        case 'palabra intrusa': case 'la palabra intrusa':
            return 'palabra_intrusa';
        case 'campanadas': case 'las campanadas':
            return 'campanadas';
        case 'series numéricas': case 'las series numéricas':
            return 'series_numericas';
        case 'qué tiempo falta':
            return 'que_tiempo_falta';
        case 'maleta': case 'la maleta':
            return 'maleta';
        case 'lista de la compra': case 'la lista de la compra':
            return 'lista_compra';
        default:
            return juego_usuario;
    }
}

// Función que devuelve un texto con la explicación del juego pasado como parámetro
// El parámetro debe ser uno de los códigos de juego que se utilizan en la variable de sesión 'juego_actual'
// DEPRECATED
/*
function GetExplicacionJuego(juego) {
    var explicacion;
    
    switch(juego) {
        case 'simon_dice':
            explicacion  = 'En el juego Simón Dice, debes repetir la serie de palabras que yo iré incrementando. ';
            explicacion += 'Tendrás que hacerlo en el mismo orden y sin olvidar ninguna palabra. ';
            explicacion += 'Recuerda que tu respuesta debe empezar por las palabras Simón Dice y terminar por la palabra Final.';
            break;

        case 'palabra_intrusa':
            explicacion  = 'En el juego de la Palabra Intrusa, escucharás una serie de palabras. Todas ellas se ajustarán a una ';
            explicacion += 'temática concreta, salvo una, la palabra intrusa. Tendrás que indicar cuál es esa palabra. ';
            explicacion += 'Tu respuesta tendrá que ser así: la palabra intrusa es...';
            break;

        case 'campanadas':
            explicacion  = 'En el juego de las Campanadas, escucharás un campanario anunciando la hora. Tendrás que escuchar ';
            explicacion += 'atentamente y, cuando termine, indicar qué hora es. Sólo serán horas en punto.';
            break;

        case 'series_numericas':
            explicacion  = 'En el juego de las Series Numéricas, escucharás una serie de números. Tendrás que adivinar el siguiente ';
            explicacion += 'elemento de la serie. Te encontrarás con sumas, restas, tablas de multiplicar y alguna potencia.';
            break;

        case 'que_tiempo_falta':
            explicacion  = 'En el juego ¿Qué Tiempo Falta? escucharás series temporales. En todas ellas, faltará algún elemento en ';
            explicacion += 'los puestos intermedios que tendrás que descubrir. Tu respuesta tendrá que comenzar por la palabra Falta.';
            break;
            
        case 'maleta':
            explicacion  = 'En el juego de la Maleta irás recibiendo una serie de preguntas acerca de qué elementos quieres introducir ';
            explicacion += 'en tu maleta para el próximo viaje. Tendrás que pensar qué cosas serán útiles para el mismo. Recibirás ';
            explicacion += 'preguntas tanto de elección entre elementos como de afirmación o negación.'
            break;
            
        case 'lista_compra':
            explicacion  = 'En el juego de la Lista de la Compra primero escucharás una pequeña lista que tendrás que recordar durante toda ';
            explicacion += 'la compra. Al final, se te hará una pregunta sobre un elemento que te faltará por comprar. Mientras tanto, irás ';
            explicacion += 'viendo más productos en la tienda y tendrás que elegir si comprarlos o no. Tienes que comprar únicamente alimentos ';
            explicacion += 'sanos, pudiendo hacer sólo una excepción. ';
            
        default:
            explicacion = 'No hay ninguna explicación disponible de ese juego.'
            break;
    }
    
    return explicacion;
}*/

// DEPRECATED
/*
function GetDestinoAleatorio() {
    const nombre = 'Granada';
    const clima = 'caliente';
    const situacion = 'interior';
    var informacion = new Array();
    informacion.push('Granada es una ciudad andaluza, capital de la provincia homónima. Destaca por la Alhambra, un complejo monumental de la época del Reino musulmán de Granada.');
    informacion.push('Hay varias leyendas sobre el origen del nombre de la ciudad. Algunas lo relacionan con los judíos, que la llamaban Gar-anat.');
    informacion.push('Hay varias leyendas sobre el origen del nombre de la ciudad. Al parecer, la cuidad romana que había en el Albaycín se llamaba Hizn Garnata.');
    informacion.push('Granada fue un reino musulmán durante 781 años, mucho más que ningún otro territorio de Europa.');
    informacion.push('En 1330, Granada era la ciudad más poblada de Europa, contando con dos grandes mezquitas.');
    informacion.push('La estación de esquí de Sierra Nevada es la que tiene la temporada de esquí más larga de España.');
    informacion.push('Granada es famosa por sus tapas, que se sirven gratis con cada bebida y destacando por su variedad.');
    
    const fecha = new Date();
    var estacion;
    
    if(fecha.getMonth() > 3 && fecha.getMonth() <= 5)
        estacion = 'primavera';
    else if(fecha.getMonth() > 5 && fecha.getMonth() <= 8)
        estacion = 'verano';
    else if(fecha.getMonth() > 8 && fecha.getMonth() <= 10)
        estacion = 'otoño';
    else
        estacion = 'invierno';
    
    var destino = new Destino(nombre, clima, situacion, informacion);
    destino.setEstacion(estacion);
    
    return destino;
}*/

function GetDatoDestino(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const index = funciones_comunes.GetRandomNumber(sessionAttributes.destino.datos_interes.length - 1, 0);
    return sessionAttributes.destino.datos_interes[index];
}

async function ComenzarPartida(handlerInput) {
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var respuesta = new Array(2);
    
    const juegoJSON = await conexion_server.getRandomJuego('especifico');
    const juego = juegoJSON.codigo;
    const explicacion = juegoJSON.explicacion;
    const nombreJuego = juegoJSON.nombre;
    const tipoJuego = 'especifico';
    
    // Configuración de la presentación del juego seleccionado
    respuesta[0]  = 'Vamos a comenzar nuestro viaje a ' + sessionAttributes.destino.nombre;
    respuesta[0] += '. Para ello, en primer lugar ';
    
    if(juego === 'maleta')
        respuesta[0] += 'prepararemos la maleta. ';
    else
        respuesta[0] += 'tenemos que hacer la compra antes de irnos. ';
    
    respuesta[0] += '¿Sabes jugar al juego de ' + nombreJuego +'?';
    respuesta[1] = `¿Sabes jugar al juego ${nombreJuego}?`;
    
    // Guardamos los datos necesarios
    sessionAttributes.explicacion = explicacion;
    sessionAttributes.juego_actual = juego;
    sessionAttributes.siguiente_respuesta = 'explicacion';
    sessionAttributes.tipoJuego = tipoJuego;
    sessionAttributes.json = juegoJSON;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return respuesta;
}

async function InicioJuego(handlerInput, juego) {
    var respuesta = new Array(2);
    
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const time = new Date();
    sessionAttributes.t_ini = time.getTime();
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    // Comprobación del juego introducido
    switch(juego) {
        case 'test_simple':
            // Texto de bienvenida al juego 
            respuesta[0] = 'Vamos a comenzar el test simple. Consta de una serie de preguntas que tendrá que contestar. Primera pregunta: ';
            
            // Primera pregunta 
            respuesta[1] = '¿Cuál es la fecha de hoy?';
            respuesta[0] += respuesta[1];
            
            // Configuración de los parámetros iniciles del juego
            funciones_comunes.ResetParamsPreJuego(handlerInput, 'test_simple', 'respuesta_fecha', respuesta[1]);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'simon_dice':
            respuesta = simon_dice.InicioSimonDice(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'palabra_intrusa':
            respuesta = palabra_intrusa.InicioPalabraIntrusa(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'campanadas':
            respuesta = await campanadas.InicioCampanadas(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'series_numericas':
            respuesta = series_numeros.InicioSeriesNumeros(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'que_tiempo_falta':
            respuesta = que_tiempo_falta.InicioQueTiempoFalta(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'maleta':
            respuesta = maleta.InicioMaleta(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        case 'lista_compra':
            respuesta = lista_compra.InicioListaCompra(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
        default:
            respuesta = [`Lo siento, no tengo el juego ${juego}.`, '¿Qué te apetece hacer hoy?'];
            break;
    }
    
    return respuesta;
}

function ResolverJuegoBasico(handlerInput, input) {
    // Obtención de las variables de sesión
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    // Variables comunes para después de resolver la pregunta
    var speakOutput;
    var pregunta;
    var puntos = sessionAttributes.puntos;
    var siguiente_respuesta;
    var intent_equivocado;
    
    // Actuación en función de la pregunta actual
    switch(sessionAttributes.siguiente_respuesta) {
        case 'respuesta_fecha':
            // Obtención del día de la semana del sistema
            const fecha_correcta = new Date();
            const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
            
            // Comprobación de acierto
            if(fecha_correcta.getDate() === parseInt(input[0])
            && fecha_correcta.getMonth() === meses.indexOf(input[1].toUpperCase()) 
            && fecha_correcta.getFullYear() === parseInt(input[2])) {
                puntos++;
                speakOutput = "¡Correcto! ";
            } else {
                speakOutput = `Lo siento, hoy es ${fecha_correcta.getDate()} de ${meses[fecha_correcta.getMonth()]} de ${fecha_correcta.getFullYear()}. `;
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿a qué día de la semana estamos hoy?';
            siguiente_respuesta = 'respuesta_dia_semana';
            intent_equivocado = '¿A qué día de la semana estamos hoy?'; 
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_dia_semana':
            // Obtención del día de la semana del sistema
            const date = new Date();
            const weekdays = new Array(7);
            weekdays[0] = "lunes";
            weekdays[1] = "martes";
            weekdays[2] = "miércoles";
            weekdays[3] = "jueves";
            weekdays[4] = "viernes";
            weekdays[5] = "sábado";
            weekdays[6] = "domingo";
            const correctDay = weekdays[date.getDay() - 1];
        
            // Comprobación de acierto
            if(input.toUpperCase() === correctDay.toUpperCase()) {
                puntos++;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `Lo siento, se ha equivocado, hoy es ${correctDay}. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿cuál es su número de teléfono?';
            siguiente_respuesta = 'respuesta_telefono';
            intent_equivocado = '¿Cuál es tu número de teléfono';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_telefono':
            // Obtención del teléfono correcto (por defecto, el mio estático)
            const telefono_correcto = 664588064;
            
            // Comprobación de acierto
            if(input === telefono_correcto) {
                puntos++;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, su número de teléfono es ${telefono_correcto}. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿cuántos años tienes?';
            siguiente_respuesta = 'respuesta_edad';
            intent_equivocado = '¿Cuántos años tienes?';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_edad':
            // Obtención del teléfono del usuario (por ahora por defecto el mio)
            const edad_correcta = 24;
            
            // Comprobación de acierto
            if(input === edad_correcta) {
                puntos++;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, tienes ${edad_correcta} años. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿cuál es el actual rey de España?';
            siguiente_respuesta = 'respuesta_rey_actual';
            intent_equivocado = '¿Cuál es el actual rey de España?';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_rey_actual':
            // Lista con las posibles formas de llamar al rey actual
            const rey_correcto = ['FELIPE SEXTO', 'FELIPE VI', 'FELIPE DE BORBÓN', 'FELIPE SEXTO DE BORBÓN', 'FELIPE VI DE BORBÓN'];
            
            // Comprobación de acierto
            if(rey_correcto.includes(input.toUpperCase())) {
                puntos++;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, el rey actual es ${rey_correcto[0]}. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿cómo se llamaba el rey anterior?';
            siguiente_respuesta = 'respuesta_rey_anterior';
            intent_equivocado = '¿Cómo se llamaba el rey anterior?';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_rey_anterior':
            // Lista con las posibles formas de llamar al rey anterior
            const rey_correcto_anterior = ['JUAN CARLOS PRIMERO', 'JUAN CARLOS I', 'EL REY JUAN CARLOS', 'JUAN CARLOS PRIMERO DE ESPAÑA', 'JUAN CARLOS I DE ESPAÑA'];
            
            // Comprobación de acierto
            if(rey_correcto_anterior.includes(input.toUpperCase())) {
                puntos++;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, el rey anterior era ${rey_correcto[0]}. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿cuál es el nombre de tu madre?';
            siguiente_respuesta = 'respuesta_madre';
            intent_equivocado = '¿Cuál es el nombre de tu madre?';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_madre':
            // Lista con las posibles formas de llamar al rey anterior
            const nombre_correcto = 'GUADALUPE';
            
            // Comprobación de acierto
            const caps_name = input.toUpperCase();
            if(caps_name.includes(nombre_correcto)) {
                puntos++;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, el nombre de su madre es ${nombre_correcto}. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿cuál es el resultado de restar tres a veinte?';
            siguiente_respuesta = 'respuesta_cuenta_uno';
            intent_equivocado = '¿Cuál es el resultado de restar tres a veinte?';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_cuenta_uno':
            // Lista con las posibles formas de llamar al rey anterior
            const resultado_correcto_uno = 17;
            
            // Comprobación de acierto
            if(input === resultado_correcto_uno) {
                puntos += 0.5;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, el resultado es ${resultado_correcto_uno}. `
            }
            
            speakOutput += ``;
            
            // Ajuste de los elementos comunes
            pregunta = 'Siguiente pregunta: ¿y si al resultado le quitamos otros tres?';
            siguiente_respuesta = 'respuesta_cuenta_dos';
            intent_equivocado = '¿Cuál es el resultado de restar tres a veinte?';
            break;
        // -------------------------------------------------------------------------------------------------
        case 'respuesta_cuenta_dos':
            // Lista con las posibles formas de llamar al rey anterior
            const resultado_correcto_dos = 14;
            
            // Comprobación de acierto
            if(input === resultado_correcto_dos) {
                puntos += 0.5;
                speakOutput = '¡Correcto! ';
            } else {
                speakOutput = `No es correcto, el resultado es ${resultado_correcto_dos}. `
            }
            
            // Ajuste de los elementos comunes
            pregunta = `Ha finalizado el test con una puntuación de ${puntos} puntos.`;
            siguiente_respuesta = 'ninguna';
            intent_equivocado = `¿Quieres saber cosas sobre ${sessionAttributes.destino.nombre}?`;
            
            sessionAttributes.intent_equivocado = intent_equivocado;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            // Como era la última pregunta, reseteamos las variables de sesión
            funciones_comunes.GetPlayTime(handlerInput);
            funciones_comunes.ResetParamsPostJuego(handlerInput);
            break;
        // -------------------------------------------------------------------------------------------------
    }
    
    // Actualización de las variables de sesión
    sessionAttributes.puntos = puntos;
    sessionAttributes.siguiente_respuesta = siguiente_respuesta;
    sessionAttributes.intent_equivocado = intent_equivocado;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    var atributos_respuesta = new Array(2);
    atributos_respuesta[0] = speakOutput;
    atributos_respuesta[1] = pregunta;
    
    // Respuesta de Alexa
    return atributos_respuesta;
} 

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        //const speakOutput = 'Bienvenido a Tu Viaje Diario, ¿te apetece descubrir hoy un nuevo destino?';
        var respuesta = await funciones_comunes.login(handlerInput);
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //sessionAttributes.juego_actual = "ninguno";
        sessionAttributes.juego_actual = "ninguno";
        sessionAttributes.siguiente_respuesta = "ninguna";
        sessionAttributes.intent_equivocado = respuesta[1];
        //sessionAttributes.destino = GetDestinoAleatorio();
        sessionAttributes.puntos = 0;
        sessionAttributes.param1 = 0;
        sessionAttributes.param2 = 0;
        sessionAttributes.param3 = 0;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
};

const InicioJuegoIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InicioJuegoIntent'
            && sessionAttributes.juego_actual === 'ninguno';
    },
    async handle(handlerInput) {
        // Obtención del juego introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const juego_seleccionado = intent.slots.juego.value;
        const juego = GetCodigoJuego(juego_seleccionado);
        
        // Variables para la respuesta
        var respuesta = await InicioJuego(handlerInput, juego);
        
        // Respuesta de Alexa
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
};

const PreguntaDiaSemanaIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaDiaSemanaIntent'
            && sessionAttributes.juego_actual === 'test_simple'
            && sessionAttributes.siguiente_respuesta === 'respuesta_dia_semana';
    },
    handle(handlerInput) {
        // Obtención del día de la semana introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const userDay = intent.slots.DayOfWeek.value;
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);

        respuesta = ResolverJuegoBasico(handlerInput, userDay);

        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();
    }
};

const PreguntaDiaIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaDiaIntent'
            && sessionAttributes.juego_actual === 'test_simple'
            && sessionAttributes.siguiente_respuesta === 'respuesta_fecha';
    },
    handle(handlerInput) {
        // Obtención de la fecha introducida por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        
        var fecha_usuario = new Array(3);
        fecha_usuario[0] = intent.slots.dia.value;
        fecha_usuario[1] = intent.slots.mes.value;
        fecha_usuario[2] = intent.slots.anio.value;

        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);

        respuesta = ResolverJuegoBasico(handlerInput, fecha_usuario);

        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();

    }
};

const PreguntaTelefonoIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaTelefonoIntent'
            && sessionAttributes.juego_actual === 'test_simple'
            && sessionAttributes.siguiente_respuesta === 'respuesta_telefono';
    },
    async handle(handlerInput) {
        // Obtención del teléfono introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const telefono_usuario = parseInt(intent.slots.telefono.value);
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);

        respuesta = ResolverJuegoBasico(handlerInput, telefono_usuario);

        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();
    }
};

const PreguntaEdadIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaEdadIntent'
            && sessionAttributes.juego_actual === 'test_simple'
            && sessionAttributes.siguiente_respuesta === 'respuesta_edad';
    },
    async handle(handlerInput) {
        // Obtención del teléfono introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const edad_usuario = parseInt(intent.slots.anios.value);
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);

        respuesta = ResolverJuegoBasico(handlerInput, edad_usuario);

        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();
        
    }
}

const PreguntaNombrePersonaIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaNombrePersonaIntent'
            && (sessionAttributes.juego_actual === 'test_simple'
            && (sessionAttributes.siguiente_respuesta === 'respuesta_rey_actual'
            ||  sessionAttributes.siguiente_respuesta === 'respuesta_rey_anterior'
            ||  sessionAttributes.siguiente_respuesta === 'respuesta_madre')
            || sessionAttributes.juego_actual === 'nombre_usuario');
    },
    async handle(handlerInput) {
        // Obtención de los atributos de sesión
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        // Obtención del teléfono introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const nombre = intent.slots.nombre_persona.value;
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);

        if(sessionAttributes.juego_actual === 'test_simple')
            respuesta = ResolverJuegoBasico(handlerInput, nombre);
        else {
            sessionAttributes.jugador = nombre;
            sessionAttributes.juego_actual = 'ninguno';
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            respuesta[0] = '¡Hola ' + nombre + '!';
            respuesta[1] = '¿Te apetece descubrir un nuevo destino?';
            
            const datosDestino = await conexion_server.getRandomDestino();
            sessionAttributes.destino = new Destino(datosDestino.nombre, datosDestino.descripcion, datosDestino.clima,
                                                    datosDestino.situacion, datosDestino.datos_interes);
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();
        
    }
}

const PreguntaCuentaSimpleIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PreguntaCuentaSimpleIntent'
            && sessionAttributes.juego_actual === 'test_simple'
            && (sessionAttributes.siguiente_respuesta === 'respuesta_cuenta_uno'
            ||  sessionAttributes.siguiente_respuesta === 'respuesta_cuenta_dos');
    },
    async handle(handlerInput) {
        // Obtención del número introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const resultado_usuario = parseInt(intent.slots.num.value);
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);

        respuesta = ResolverJuegoBasico(handlerInput, resultado_usuario);

        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();
        
    }
}

const DefaultNumberIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefaultNumberIntent'
            && ((sessionAttributes.juego_actual === 'test_simple' && sessionAttributes.siguiente_respuesta === 'respuesta_telefono')
            || (sessionAttributes.juego_actual === 'test_simple' && sessionAttributes.siguiente_respuesta === 'respuesta_edad')
            || (sessionAttributes.juego_actual === 'test_simple' && sessionAttributes.siguiente_respuesta === 'respuesta_cuenta_uno')
            || (sessionAttributes.juego_actual === 'test_simple' && sessionAttributes.siguiente_respuesta === 'respuesta_cuenta_dos')
            || (sessionAttributes.juego_actual === 'campanadas')
            || (sessionAttributes.juego_actual === 'series_numericas'));
    },
    async handle(handlerInput) {
        // Obtención del número introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const numero = parseInt(intent.slots.number.value);
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);
        
        // Actuación en funciónh de los atributos de sesión
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        switch(sessionAttributes.juego_actual) {
            case 'test_simple':
                respuesta = ResolverJuegoBasico(handlerInput, numero);
                respuesta[0] += respuesta[1];
                break;
            
            case 'campanadas':
                respuesta = await campanadas.ComprobarCampanadas(handlerInput, numero);
                break;
                
            case 'series_numericas':
                respuesta = series_numeros.ComprobarSerieNumerica(handlerInput, numero);
                break;
                
            default:
                respuesta = ['Fallo al gestionar el input genérico de números.', 'Por favor, vuelva a decir la cifra.'];
        }
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
        
    }
}

const DefaultDayOfWeekIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefaultDayOfWeekIntent'
            && sessionAttributes.juego_actual === 'test_simple' && sessionAttributes.siguiente_respuesta === 'respuesta_dia_semana';
    },
    handle(handlerInput) {
        // Obtención del número introducido por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const diaSemana = intent.slots.diaSemana.value;
        
        // Array para almacenar los atributos de la respuesta
        var respuesta = new Array(2);
        
        // Actuación en funciónh de los atributos de sesión
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if(sessionAttributes.juego_actual === 'test_simple') {
            respuesta = ResolverJuegoBasico(handlerInput, diaSemana);
        } else {
            respuesta = ['Fallo al gestionar el intent genérico de día semanal.', 'Por favor, vuelva a decir el día.'];
        }
        
        return handlerInput.responseBuilder
            .speak(respuesta[0] + respuesta[1])
            .reprompt(respuesta[1])
            .getResponse();
        
    }
}

const FaltaIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FaltaIntent'
            && (sessionAttributes.juego_actual === 'que_tiempo_falta' ||
               (sessionAttributes.juego_actual === 'lista_compra' &&
               (sessionAttributes.siguiente_respuesta !== 'SI' && sessionAttributes.siguiente_respuesta !== 'NO')));
    },
    handle(handlerInput) {
        // Obtención de la palabra introducida por el usuario
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        var palabra_usuario = intent.slots.palabraFaltante.value;
        
        // Obtención de las variables de sesión
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        // Variable de respuesta
        var respuesta = new Array(2);
        
        // Opción según juego
        if(sessionAttributes.juego_actual === 'que_tiempo_falta')
            respuesta = que_tiempo_falta.ComprobarRespuesta(handlerInput, palabra_usuario);
        else
            respuesta = lista_compra.ComprobarRespuesta(handlerInput, palabra_usuario);
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
}

const NoLoSeIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NoLoSeIntent';
            //&& sessionAttributes.juego_actual !== 'ninguno';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var respuesta = ['No implementado aún.', 'No implementado aún.']
        
        switch(sessionAttributes.juego_actual) {
            case 'test_simple':
                break;
            // -------------------------------------------------------------------------------------------------
            case 'simon_dice':
                respuesta = simon_dice.PasaTurno(handlerInput);
                break;
            // -------------------------------------------------------------------------------------------------
            case 'palabra_intrusa':
                respuesta = palabra_intrusa.PasaTurno(handlerInput);
                break;
            // -------------------------------------------------------------------------------------------------
            case 'campanadas':
                //respuesta = campanadas.PasaTurno(handlerInput);
                break;
            // -------------------------------------------------------------------------------------------------
            case 'series_numericas':
                respuesta = series_numeros.PasaTurno(handlerInput);
                break;
            // -------------------------------------------------------------------------------------------------
            case 'que_tiempo_falta':
                respuesta = que_tiempo_falta.PasaTurno(handlerInput);
                break;
            // -------------------------------------------------------------------------------------------------
            case 'maleta':
                respuesta = maleta.PasaTurno(handlerInput);
                break;
            // -------------------------------------------------------------------------------------------------
            case 'lista_compra':
                respuesta = lista_compra.PasaTurno(handlerInput);
                break;
        }
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
}

const YesIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
            && ((sessionAttributes.juego_actual === 'maleta' && sessionAttributes.param2 === 'afirmacion') ||
                (sessionAttributes.juego_actual === 'ninguno' && sessionAttributes.siguiente_respuesta === 'ninguna') ||
                (sessionAttributes.juego_actual === 'lista_compra') ||
                (sessionAttributes.siguiente_respuesta === 'explicacion') ||
                (sessionAttributes.siguiente_respuesta === '¿CONTINUAR?') ||
                (sessionAttributes.siguiente_respuesta === 'FINAL') ||
                (sessionAttributes.siguiente_respuesta === 'conocer_destino'));
    },
    async handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var respuesta = new Array(2);
        var juegoJSON;
        var juego;
        var explicacion;
        var nombreJuego;
        var tipoJuego;
        var destino;
        
        if(sessionAttributes.siguiente_respuesta === 'ninguna') {
            const datosDestino = await conexion_server.getRandomDestino();
            sessionAttributes.destino = new Destino(datosDestino.nombre, datosDestino.descripcion, datosDestino.clima,
                                                    datosDestino.situacion, datosDestino.datos_interes);
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            respuesta[0]  = 'En primer lugar, vamos a preparar nuestro viaje. Hoy viajaremos a ';
            respuesta[0] += sessionAttributes.destino.nombre;
            respuesta[0] += '. ¿Conoces ese lugar?';
            respuesta[1]  = '¿Conoces ' + sessionAttributes.destino.nombre + "?";
            
            sessionAttributes.siguiente_respuesta = 'conocer_destino';
            sessionAttributes.intent_equivocado = respuesta[1];
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } else if(sessionAttributes.siguiente_respuesta === 'conocer_destino') {
            respuesta = await ComenzarPartida(handlerInput);
            respuesta[0] = '¡Perfecto! ' + respuesta[0];
            sessionAttributes.intent_equivocado = respuesta[1];
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } else if(sessionAttributes.siguiente_respuesta === 'explicacion') {
            respuesta = await InicioJuego(handlerInput, sessionAttributes.juego_actual);
        } else if(sessionAttributes.siguiente_respuesta === '¿CONTINUAR?') {
            juegoJSON = await conexion_server.getRandomJuego('general');
            juego = juegoJSON.codigo;
            explicacion = juegoJSON.explicacion;
            nombreJuego = juegoJSON.nombre;
            tipoJuego = 'general';
            
            // Configuración de la presentación del juego seleccionado
            respuesta[0]  = 'Estamos en la estación, el vendedor nos ha ofrecido jugar una partida de ';
            respuesta[0] += nombreJuego;
            respuesta[0] += ' para darnos el billete a ';
            respuesta[0] += sessionAttributes.destino.nombre;
            respuesta[0] +='. ¿Sabes jugar a ese juego?';
            respuesta[1] = `¿Sabes jugar al juego ${nombreJuego}?`;
            
            // Guardamos los datos necesarios
            sessionAttributes.explicacion = explicacion;
            sessionAttributes.juego_actual = juego;
            sessionAttributes.tipoJuego = tipoJuego;
            sessionAttributes.siguiente_respuesta = 'explicacion';
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } else if(sessionAttributes.siguiente_respuesta === 'FINAL') {
            respuesta[0]  = GetDatoDestino(handlerInput);
            respuesta[1]  = `¿Quieres saber algo más de ${sessionAttributes.destino.nombre}?`;
            respuesta[0] += ` ${respuesta[1]}`;
        } else {
            switch(sessionAttributes.juego_actual) {
                case 'maleta':
                respuesta = maleta.ComprobarRespuesta(handlerInput, 'SI');
                break;
                
                case 'lista_compra':
                
                if(sessionAttributes.siguiente_respuesta === 'REPETIR') {
                    respuesta = lista_compra.RepetirLista(handlerInput);
                } else {
                    respuesta = lista_compra.ComprobarRespuesta(handlerInput, 'SI');
                }
                
                break;
            }
        }
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
}

const NoIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'
            && ((sessionAttributes.juego_actual === 'maleta' && sessionAttributes.param2 === 'afirmacion') ||
                (sessionAttributes.juego_actual === 'ninguno' && sessionAttributes.siguiente_respuesta === 'ninguna') ||
                (sessionAttributes.juego_actual === 'lista_compra') ||
                (sessionAttributes.siguiente_respuesta === 'explicacion') ||
                (sessionAttributes.siguiente_respuesta === '¿CONTINUAR?') ||
                (sessionAttributes.siguiente_respuesta === 'FINAL') ||
                (sessionAttributes.siguiente_respuesta === 'conocer_destino'));
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var respuesta = new Array(2);
        
        if(sessionAttributes.siguiente_respuesta === '¿CONTINUAR?' || sessionAttributes.siguiente_respuesta === 'explicacion') {
            if(sessionAttributes.siguiente_respuesta === 'explicacion') {
                    respuesta = await InicioJuego(handlerInput, sessionAttributes.juego_actual);
                    respuesta[0] = sessionAttributes.explicacion + ' ' + respuesta[0];
                } else {
                    respuesta = ['Me entristece que digas eso, ¡estaré esperándote para cuando quieras jugar!', '¡Juega conmigo!.'];
                }
        } else if(sessionAttributes.siguiente_respuesta === 'FINAL' ) {
            respuesta[0] = 'Está bien, pues entonces, ¡vuelve mañana para volver a jugar!';
            respuesta[1] = `¿Quieres saber más cosas sobre ${sessionAttributes.destino.nombre}?`;
            sessionAttributes.intent_equivocado = respuesta[1];
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } else if(sessionAttributes.siguiente_respuesta === 'conocer_destino') {
            respuesta = await ComenzarPartida(handlerInput);
            respuesta[0] = sessionAttributes.destino.descripcion + ' ' + respuesta[0];
            sessionAttributes.intent_equivocado = respuesta[1];
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } else {
            switch(sessionAttributes.juego_actual) {
                case 'maleta':
                respuesta = maleta.ComprobarRespuesta(handlerInput, 'NO');
                break;
            
            case 'lista_compra':
                
                if(sessionAttributes.siguiente_respuesta === 'REPETIR') {
                    respuesta = lista_compra.ListaMemorizada(handlerInput);
                } else {
                    respuesta = lista_compra.ComprobarRespuesta(handlerInput, 'NO');
                }
                
                break;
            }
        }
        
        return handlerInput.responseBuilder
            .speak(respuesta[0])
            .reprompt(respuesta[1])
            .getResponse();
    }
}

const DatoDestinoIntentHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DatoDestinoIntent'
            && sessionAttributes.siguiente_respuesta === 'FINAL';
    },
    handle(handlerInput) {
        // Obtención de los atributos de sesión
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var speakOutput = GetDatoDestino(handlerInput);
        const reprompt = `¿Quieres saber algo más de ${sessionAttributes.destino.nombre}?`;
        speakOutput += ` ${reprompt}`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = '!Hasta la próxima!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        //const speakOutput = `You just triggered ${intentName}`;
        
        // Obtención de las variables de sesión
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const speakOutput = sessionAttributes.intent_equivocado;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// -----------------------------------------------------------------------------------------------------------------------------------

const PruebaServerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PruebaServerIntent';
    },
    async handle(handlerInput) {
        /*
        var speakOutput = "Email: ";
        var speakOutput2 = await funciones_comunes.GetUserEmail(handlerInput);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();*/
            
        const EMAIL_PERMISSION = "alexa::profile:email:read";
        const APP_NAME = 'Mi viaje diario';
        const messages = {
            NOTIFY_MISSING_PERMISSIONS: 'Por favor, habilite los permisos de perfil en la aplicación de Amazon Alexa.',
            ERROR: 'Oh, parece que algo salió mal.'
        };
            
    
        const { serviceClientFactory, responseBuilder } = handlerInput;
    
        
        try {
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();
            const profileEmail = await upsServiceClient.getProfileEmail();
            
            if(!profileEmail) {
                const noEmailResponse = 'Parece que no tienes un email configurado. Puedes hacerlo en la aplicación de Amazon Alexa.';
                return responseBuilder
                    .speak(noEmailResponse)
                    .withSimpleCard(APP_NAME, noEmailResponse)
                    .getResponse();
            }
            
            const speechResponse = `Tu email es: ${profileEmail}`;
            return responseBuilder
                .speak(speechResponse)
                .withSimpleCard(APP_NAME, speechResponse)
                .getResponse();
        } catch(error) {
            console.log(JSON.stringify(error));
            if(error.statusCode === 403) {
                return responseBuilder
                    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                    .withAskForPermissionsConsentCard([EMAIL_PERMISSION])
                    .getResponse();
            }
            
            console.log(JSON.stringify(error));
            
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.error = JSON.stringify(error);
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            const response = responseBuilder.speak(messages.ERROR).getResponse();
            return response;
        }
    }
}

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        // LAUNCH INTENT
        LaunchRequestHandler,
        // INTENTS BÁSICOS
        InicioJuegoIntentHandler,
        NoLoSeIntentHandler,
        DatoDestinoIntentHandler,
        // INTENTS GENÉRICOS DE PRUEBA
        DefaultNumberIntentHandler,
        DefaultDayOfWeekIntentHandler,
        // CUESTIONARIO BÁSICO
        PreguntaDiaSemanaIntentHandler,
        PreguntaDiaIntentHandler,
        PreguntaTelefonoIntentHandler,
        PreguntaEdadIntentHandler,
        PreguntaNombrePersonaIntentHandler,
        PreguntaCuentaSimpleIntentHandler,
        // SIMÓN DICE 
        simon_dice.SimonDiceIntentHandler,
        // PALABRA INTRUSA 
        palabra_intrusa.PalabraIntrusaIntentHandler,
        // QUÉ TIEMPO FALTA
        FaltaIntentHandler,
        // MALETA
        maleta.MetoMaletaIntentHandler,
        // INTENTS POR DEFECTO
        PruebaServerIntentHandler,
        //
        YesIntentHandler,
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();