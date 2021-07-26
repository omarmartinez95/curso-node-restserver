const { Router } = require('express');
const router = Router();

const { usuariosGet, 
        usuariosPuts, 
        usuariosPosts, 
        usuariosDelete, 
        usuariosPatch } = require('../models/controllers/usuarios');


router.get('/', usuariosGet );

router.put('/:id', usuariosPuts );

router.post('/', usuariosPosts );

router.delete('/', usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;