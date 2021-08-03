const jwt = require('jsonwebtoken');

const generarJWT = ( uid = ''  ) => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        // Generar un JWT
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            // Tiempo de expiración
            expiresIn: '4h'
        }, ( err, token ) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });

}


module.exports = {
    generarJWT
}