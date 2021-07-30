const { response } = require('express');


// Para encriptar la contraseña
const bcryptjs = require('bcryptjs');

//importar el modelo
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {

    const query = {estado: true};
    const { limite = 5, desde = 0 } = req.query;
    
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        await Usuario.find(query)
                     .skip(Number(desde))
                     .limit(Number(limite))
    ]);


    res.json({
        ok: true,
        total,
        usuarios
    });
}

const usuariosPuts = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google,correo, ...resto } = req.body;

    // Validar contra BD
    if (password) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json({
        ok: true,
        msg: 'Usuario actualizado con exito',
        usuario
    });
}

const usuariosPosts = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Grabar el usuario
    await usuario.save();


    res.json({
        ok: true,
        msg: 'post API - Controlador!!',
        usuario
    });
}

const usuariosDelete = async(req, res) => {
    const { id } = req.params;

    // Como borrarlo fisicamente
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });


    res.json({
        ok: true,
        usuario
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - Controlador!!'
    });
}



module.exports = {
    usuariosGet,
    usuariosPuts,
    usuariosPosts,
    usuariosDelete,
    usuariosPatch
}