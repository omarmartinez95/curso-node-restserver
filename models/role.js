const { Schema, model } = require('mongoose');

const RoleSchema = Schema({

    role: {
        type: String,
        required:[true, 'El rol debe ser obligatorio']
    }

})


module.exports = model('Role', RoleSchema)