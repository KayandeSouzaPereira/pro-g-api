const service = require("./services/cad");
const security = require('./services/security');

export default async function handler(req, res) {
    //security.checkSec(req, res);

    if (req.method === 'POST') {
        await service.cadastro(req, res);
    }
}

