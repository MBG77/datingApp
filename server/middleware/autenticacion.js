const jwt = require('jsonwebtoken');

// ===========================
// Verificar Token
// ===========================
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Toke no válido'
                }
            });
        };

        req.perfilUsuario = decoded.perfilUsuario;
        next();
    });
};

module.exports = {
    verificaToken
}