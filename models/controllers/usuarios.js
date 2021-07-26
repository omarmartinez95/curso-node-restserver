const { response } = require('express');

const usuariosGet = (req, res = response) => {

    const { q, nombre } = req.query;

    res.json({
        ok: true,
        msg: 'get API - Controlador!!',
        q,
        nombre
    });
}

const usuariosPuts = (req, res) => {

    const id = req.params.id;

    res.json({
        ok: true,
        id,
        msg: 'put API - Controlador!!'
    });
}

const usuariosPosts = (req, res) => {

    const {nombre, edad} = req.body;

    res.json({
        ok: true,
        msg: 'post API - Controlador!!',
        nombre,
        edad
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        ok: true,
        msg: 'delete API - Controlador!!'
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