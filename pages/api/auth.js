const service = require('./services/auth');
const security = require('./services/security');

export default function handler(req, res) {
        security.checkSec(req, res);
        
        if (req.method === 'POST') {
                const body = req.body;
                const user = body.usuario;
                const pass = body.password;
                const token = body.token;
                service.login(user, pass, token, res);
        }  
}

