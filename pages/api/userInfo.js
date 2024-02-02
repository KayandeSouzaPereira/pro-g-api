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
    return service.userInfoDelete(req, res)
  }
  if (req.method === 'GET') {
    const body = req.query;
    const usuario = body.user;
    const img = body.imgTipo;

    let checktk = security.checkTKSet(usuario, req);
    if (checktk == false){
      return res.status(403).json({ retorno: "Token Invalido"});
    }
    if (img != undefined){
      return service.userInfoImage(req,res)
    }
    if (usuario && img == undefined){
      return service.userInfo(res, usuario);
    }
    else{
      return service.userInfoListAll(res);
    }
  }
}
