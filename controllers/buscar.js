const { response, json } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require('../models')


const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res=response ) => {

    //  Para validar si es un id de mongo
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario)? [usuario]:[]
        });
    }

    //Expresion regular para las busquedas insensibles 
    const regex = new RegExp( termino, 'i' );

    // Buscar por nombre de usuarios con los operadores
    const usuarios = await Usuario.find({
        $or:[{nombre: regex}, {correo: regex}],
        $and:[{estado: true}]
    });
    res.json({
        results: usuarios
    })

}

const buscarCategorias = async( termino = '', res=response ) => {

    //  Para validar si es un id de mongo
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria)? [categoria]:[]
        });
    }

    //Expresion regular para las busquedas insensibles 
    const regex = new RegExp( termino, 'i' );

    // Buscar por nombre de usuarios con los operadores
    const categorias = await Categoria.find({nombre: regex});
    res.json({
        results: categorias
    })

}

const buscarProductos = async( termino = '', res=response ) => {

    //  Para validar si es un id de mongo
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre').populate('usuario','nombre');
        return res.json({
            results: (producto)? [producto]:[]
        });
    }

    //Expresion regular para las busquedas insensibles 
    const regex = new RegExp( termino, 'i' );

    // Buscar por nombre de usuarios con los operadores
    const producto = await Producto.find({nombre: regex}).populate('categoria','nombre').populate('usuario','nombre');
    res.json({
        results: producto
    })

}



const buscar = async(req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        case 'categoria':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            });
    }



}

module.exports = {
    buscar
}