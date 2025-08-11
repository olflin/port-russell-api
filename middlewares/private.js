const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware JWT: valide le token, expose req.decoded et renouvelle l'en-tête Authorization.
 * Échoue avec 401 si le token est manquant ou invalide.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.checkJWT = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_invalid');
            } else {
                req.decoded = decoded;

                const expireIn = 24 * 60 * 60; // 24 hours
                // Re-signe avec le même payload attendu par le reste de l'app
                const payload = {
                  id: decoded.id,
                  username: decoded.username,
                  email: decoded.email,
                };
                const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: expireIn });

                res.header('Authorization', 'Bearer ' + newToken);
                next();
            }
        });
    } else {
        return res.status(401).json('token_required');
    }
};
