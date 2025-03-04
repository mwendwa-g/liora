const { expressjwt: expressJwt } = require('express-jwt');

function authJwt(){
    const secret = process.env.SECRET;
    const api = process.env.API_URL;

    return expressJwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/f1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/f1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`,
            { url: /\/api\/f1\/users\/email\/(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/f1\/users\/(.*)/, methods: ['PUT'] },
            `/`
        ]
    })
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
      return false;
    }
    return true;
}

module.exports = authJwt;