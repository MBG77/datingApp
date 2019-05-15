const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const PerfilAnfitrion = require('../models/perfil-anfitrion');
const PerfilHuesped = require('../models/perfil-huesped');

const app = express();

app.options('/login', cors());
app.post('/login', cors(), (req, res) => {

    let body = req.body;
    console.log('body:: ', body);
    if (!body.contratante) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El contratante es requerido'
            }
        });
    }
    if (!body.email) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El email es requerido'
            }
        });
    }
    if (!body.password) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El password es requerido'
            }
        });
    }

    if (body.contratante.toLowerCase() === 'anfitrion') {
        PerfilAnfitrion.findOne({ email: body.email }, (err, perfilAnfitrionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!perfilAnfitrionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: '(Usuario) o contraseña incorrectos'
                    }
                });
            };

            if (!bcrypt.compareSync(body.password, perfilAnfitrionDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o (contraseña) incorrectos'
                    }
                });
            };

            let token = jwt.sign({
                perfilAnfitrion: perfilAnfitrionDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            res.json({
                ok: true,
                perfilAnfitrion: perfilAnfitrionDB,
                token
            });
        });

    } else {

        PerfilHuesped.findOne({ email: body.email }, (err, perfilHuespedDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!perfilHuespedDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: '(Usuario) o contraseña incorrectos'
                    }
                });
            };

            if (!bcrypt.compareSync(body.password, perfilHuespedDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o (contraseña) incorrectos'
                    }
                });
            };

            let token = jwt.sign({
                perfilHuesped: perfilHuespedDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            res.json({
                ok: true,
                perfilHuesped: perfilHuespedDB,
                token
            });
        });
    }

});


module.exports = app;