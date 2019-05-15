const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let perfilAnfitrionSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    rut: {
        type: String,
        unique: true,
        required: [true, 'El rut es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

// remover un campo del objeto que no se desee retornar.
perfilAnfitrionSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

perfilAnfitrionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('PerfilAnfitrion', perfilAnfitrionSchema);