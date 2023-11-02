const service = require("./services/cad");
const security = require('./services/security');

export default function handler(req, res) {
    security.checkSec(req, res);

    if (req.method === 'POST') {
        service.cadastro(req, res);
    }
}

