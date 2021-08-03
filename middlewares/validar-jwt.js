const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    // Colo leer los headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay toquen en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuarioAutenticado = await Usuario.findById(uid);
        if (!usuarioAutenticado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            });
        }
        req.uid = uid;
        req.usuarioAutenticado = usuarioAutenticado;
        // Verificar si el uid tiene estado en true
        if (!usuarioAutenticado.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario autenticado con estado false'
            });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });

    }


}


module.exports = {
    validarJWT
}