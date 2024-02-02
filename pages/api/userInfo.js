const security = require('./services/security');
const service = require('./services/userinfo');

export default function handler(req, res) {

  security.checkSec(req, res);
  
  if (req.method === 'POST') {

    const body = req.body;
    const usuario = body.usuario;
    
    security.checkTKSet(usuario, req);

    service.userInfoRegister(req, res);
  }
  if (req.method === 'DELETE') {
    service.userInfoDelete(req, res)
  }
  if (req.method === 'GET') {
    const body = req.query;
    const usuario = body.user;

    security.checkTKSet(usuario, req);

    if (usuario){
      service.userInfoImage(req,res)
    }else{
      service.userInfoListAll(res);
    }
  }
}
