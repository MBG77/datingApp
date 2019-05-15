const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const PerfilHuesped = require('../models/perfil-huesped');
const { verificaToken } = require('../middleware/autenticacion');

const app = express();

app.options('/perfil-huesped', cors());
app.get('/perfil-huesped', cors(), verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    PerfilHuesped.find({ estado: true }, 'nombre rut email')
        .skip(desde)
        // .limit(limite)
        .exec((err, perfilesHuespedes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            PerfilHuesped.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    perfilesHuespedes,
                    cuantos: conteo
                });
            });
        });
});

app.get('/perfil-huesped/:id', cors(), verificaToken, function(req, res) {

    let id = req.params.id;

    PerfilHuesped.findById(id)
        .exec((err, perfilHuespedDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            if (!perfilHuespedDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                perfilHuesped: perfilHuespedDB
            });

        });
});


app.options('/perfil-huesped', cors());
app.post('/perfil-huesped', cors(), function(req, res) {
    let body = req.body;

    let perfilHuesped = new PerfilHuesped({
        nombre: body.nombre,
        rut: body.rut,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });

    perfilHuesped.save((err, perfilHuespedDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            perfilHuesped: perfilHuespedDB
        });
    });
});

app.options('/perfil-huesped/:id', cors());
app.put('/perfil-huesped/:id', cors(), verificaToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'rut', 'email', 'password']);

    PerfilHuesped.findByIdAndUpdate(id, body, { new: true }, (err, perfilHuespedDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!perfilHuespedDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        };

        res.json({
            ok: true,
            perfilHuesped: perfilHuespedDB
        });
    });
});

app.delete('/perfil-huesped/:id', cors(), verificaToken, function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    PerfilHuesped.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, perfilHuespedBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!perfilHuespedBorrada) {
            return res.status(400).json({
                ok: false,
                er: {
                    message: 'Perfil Empresa no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            perfilHuesped: perfilHuespedBorrada
        });
    });
});

module.exports = app;