// CLASES DE DICCIONARIOS
const TEMATICAS = ['animales', 'frutas', 'vehículos'];

// DICCIONARIOS
const ANIMALES = ['perro', 'gato', 'león', 'tigre', 'gacela', 'pájaro', 'pescado', 'cocodrilo', 'lagartija', 'araña', 'escorpión', 'erizo', 'ratón', 'tiburón', 'delfín', 'ballena', 'marmota', 'elefante', 'toro', 'vaca', 'oveja', 'gallina'];
const FRUTAS = ['naranja', 'limón', 'manzana', 'pera', 'kiwi', 'melón', 'sandía', 'mandarina', 'cereza', 'fresa', 'melocotón', 'coco', 'uva', 'plátano', 'granada', 'caqui', 'ciruela', 'arándano', 'frambuesa', 'piña'];
const VEHICULOS = ['coche', 'moto', 'furgoneta', 'camión', 'tractor', 'barco', 'avión', 'helicóptero', 'submarino', 'autobús', 'metro', 'tren', 'caravana'];

function getListaPorTematica(tematica) {
    var lista = new Array();
    
    switch(tematica) {
        case 'animales':
            lista = ANIMALES;
            break;
        case 'frutas':
            lista = FRUTAS;
            break;
        case 'vehículos':
            lista = VEHICULOS;
            break;
    }
    
    return lista;
}

module.exports = {
    TEMATICAS,
    getListaPorTematica
}