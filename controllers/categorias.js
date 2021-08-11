const { response } = require("express");

const { Categoria } = require('../models');



// Obtener categorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

    const query = { estado: true };
    const { limite = 5, desde = 0 } = req.query;
    try {

        const [categorias, total] = await Promise.all([
            Categoria.find(query).populate('usuario', 'nombre').skip(Number(desde)).limit(Number(limite)),
            Categoria.countDocuments(query)
        ]);

        res.json({
            msg: 'Todas las categorias!!',
            categorias,
            total
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar los logs de la aplicación'
        });

    }



}

// Obtener categoria - populate
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;

    try {
        const categoriaDB = await Categoria.findById(id)
                                           .populate('usuario', 'nombre');

        res.json({
            categoriaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar los logs de la aplicación'
        });
    }

}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria: ${categoriaDB.nombre} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = new Categoria(data);


    // Guardar en BD
    await categoria.save();

    res.json({
        msg: 'Categoria creada exitosamente',
        categoria
    });

}

// Actualizar categoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuarioAutenticado, ...data } = req.body;


    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        ok: true,
        msg: 'Categoria actualizada con exito',
        categoria
    });



}

// Borrar categoria logicamente - estado : false
const eliminarCategoria = async (req, res = response) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});
        
        res.json({
            msg: 'Categoria eliminada exitosamente',
            categoria
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar los logs de la aplicación'
        });

    }
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}