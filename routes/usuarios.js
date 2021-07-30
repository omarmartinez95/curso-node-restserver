const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { usuariosGet, 
        usuariosPuts, 
        usuariosPosts, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');




router.get('/', usuariosGet );

router.put('/:id', [
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos
] ,usuariosPuts );

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser mas de 6 letras').isLength({min:6}),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        // Validar el role
        check('rol').custom(esRoleValido),
        validarCampos
] ,usuariosPosts );

router.delete('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
] ,usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;