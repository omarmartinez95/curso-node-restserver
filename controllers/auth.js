const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response) =>{


    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({correo});

        // Verificar si el email existe
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario/password no son correctos - correo'
            })
        }

        // Verificar si el usuario esta activo en la bd
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/password no son correctos - estado:false'
            })
        }

        // verificar la contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg: 'Usuario/password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);



        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:'Hable con el administrador'
        })
        
    }


   
}


module.exports = {
    login
}