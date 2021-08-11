const { Router } = require('express');
const { check } = require('express-validator');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');


const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');



const router = Router();


/**
 * {{url}}/api/categorias
 */


//Obtener todas las categorias, publico
router.get('/', obtenerCategorias)

//Obtener una categoria en particular por id
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria)


// Crear una nueva categoria, privado con cualquier rol, con token, peticion post
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// crear un put para actualizar un registro por el id
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], actualizarCategoria)

// Borrar una categoria, se permite si es un admin, marcar el estado activo o inactivo
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], eliminarCategoria)







module.exports = router;