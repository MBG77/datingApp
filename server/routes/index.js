const express = require('express');

const app = express();



app.use(require('./perfil-anfitrion'));
app.use(require('./perfil-huesped'));
app.use(require('./login'));


module.exports = app;