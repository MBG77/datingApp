const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const PerfilAnfitrion = require('../models/perfil-anfitrion');
const { verificaToken } = require('../middleware/autenticacion');

const app = express();


app.options('/perfil-anfitrion', cors());
app.get('/perfil-anfitrion', cors(), verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    PerfilAnfitrion.find({ estado: true }, 'nombre rut email estado')
        .skip(desde)
        // .limit(limite)
        // .populate('postulaciones')
        .exec((err, perfilesAnfitriones) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            PerfilAnfitrion.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    perfilesAnfitriones,
                    cuantos: conteo
                });
            });

        });
});

app.options('/perfil-anfitrion/:id', cors());
app.get('/perfil-anfitrion/:id', cors(), verificaToken, function(req, res) {

    let id = req.params.id;

    PerfilAnfitrion.findById(id)
        .exec((err, perfilAnfitrionDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            if (!perfilAnfitrionDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                perfilAnfitrion: perfilAnfitrionDB
            });

        });
});

app.post('/perfil-anfitrion', cors(), function(req, res) {

    let body = req.body;
    console.log(body);
    let perfilAnfitrion = new PerfilAnfitrion({
        nombre: body.nombre,
        rut: body.rut,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
    });

    perfilAnfitrion.save((err, perfilAnfitrionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            perfilAnfitrion: perfilAnfitrionDB
        });

    });

});

app.options('/perfil-anfitrion/:id', cors());
app.put('/perfil-anfitrion/:id', cors(), verificaToken, function(req, res) {

    let id = req.params.id;
    // let body = req.body;
    let body = _.pick(req.body, ['nombre', 'rut', 'email', 'password']);


    PerfilAnfitrion.findByIdAndUpdate(id, body, { new: true }, (err, perfilAnfitrionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!perfilAnfitrionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        };

        res.json({
            ok: true,
            perfilAnfitrion: perfilAnfitrionDB
        });

    });

});

app.delete('/perfil-anfitrion/:id', cors(), verificaToken, function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    PerfilAnfitrion.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, perfilAnfitrionBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!perfilAnfitrionBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            prefilAnfitrion: perfilAnfitrionBorrado
        });

    });

});

module.exports = app;