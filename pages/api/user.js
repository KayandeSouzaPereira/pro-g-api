const security = require('./services/security');
const service = require('./services/user');

export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'POST') {
    const body = req.body;
    const usuario = body.usuario;

    const check = security.checkTKSet(usuario, req)
    if(!check){
      return res.status(403).json({ retorno: "Token Invalido"});
    }else{
      service.userRegister(req, res);
    }
  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const usuario = body.usuario;

    const check = security.checkTKSet(usuario, req)
    if(!check){
      return res.status(403).json({ retorno: "Token Invalido"});
    }else{
      return service.userDelete(req, res);
    }
  }
  if (req.method === 'GET') {
    const body = req.query;
    const usuario = body.usuario;

    const check = security.checkTKSet(usuario, req)
    if(!check){
      return res.status(403).json({ retorno: "Token Invalido"});
    }else{
      service.userListByNm(req, res);
    }
  }else{
    service.userListAll(res);
  }
}

