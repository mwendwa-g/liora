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
            {url: /\/api\/lioracas\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/lioracas\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/lioracas\/orders(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/lioracas\/users(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`,
            { url: /\/api\/lioracas\/users\/email\/(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/lioracas\/users\/(.*)/, methods: ['PUT'] },
            { url: /\/api\/lioracas\/orders\/(.*)/, methods: ['PUT'] },
            `/`,
        ]
    }) 
}

async function isRevoked(req, token) {
    const role = token.payload.role;
    if (!role) {
        return true; 
    }
    if (role === "admin") {
        return false; 
    }
    if (role === "delivery" && req.path.includes("orders-list.html")) {
        return false; 
    }
    if (role === "customer" && req.path.includes("index.html")) {
        return false;
    }
    return true;
}


module.exports = authJwt;