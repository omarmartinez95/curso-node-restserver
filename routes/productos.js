const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProductos, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/productos
 */

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,obtenerProducto) 


router.post('/',[
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
],crearProductos)

router.put('/:id', [
    validarJWT,
    // check('categoria').custom( existeCategoriaPorId),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto )

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto)

module.exports = router;