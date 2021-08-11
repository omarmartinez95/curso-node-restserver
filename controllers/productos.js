const { response } = require("express");
const { Producto } = require("../models");


const obtenerProductos = async(req, res = response) => {

    const query = { estado: true };
    const { limite = 5, desde = 0 } = req.query;

    const [ productos, total ] = await Promise.all([
        Producto.find(query)
                .populate('categoria', 'nombre')
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite)),
        Producto.countDocuments(query)
    ]);

    res.json({
        msg: 'obtener productos',
        productos,
        total
    });

}

const obtenerProducto = async(req, res = response) => {
    const { id } = req.params;
    try {

        const producto = await Producto.findById(id).populate('categoria', 'nombre').populate('usuario', 'nombre')
        res.json({
            producto
        })
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado revisar los logs de la aplicación'
        });
        
    }
}

const crearProductos = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `La categoria: ${productoDB.nombre} ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuarioAutenticado._id
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json({
        msg: 'Producto creado exitosamente',
        producto
    });

}

const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuarioAutenticado, ...data } = req.body;

    if(data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuarioAutenticado._id;
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        ok: true,
        msg: 'Producto actualizado con exito',
        producto
    });
     
}


const eliminarProducto = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true});
    res.json({
        msg: 'Producto eliminado exitosamente',
        producto
    });
}


module.exports = {
    crearProductos,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}