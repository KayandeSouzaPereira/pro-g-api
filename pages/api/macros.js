const security = require('./services/security');
const service = require("./services/macros");


export default function handler(req, res) {

    security.checkSec(req, res);
   
  
    if (req.method === 'POST') {
      service.macroRegister(req, res);
    }
    if (req.method === 'DELETE') {
        const body = req.query;
        const idUser = body.idUser;
        security.checkTKSet(idUser, req);
        if(idUser != undefined){
            service.macroExclude(req, res, idUser);
        }
    }
    if (req.method === 'GET') {
      const body = req.query;
      const idUser = body.idUser;

      security.checkTKSet(idUser, req)
      if(idUser != undefined){
        service.getById(req, res, idUser);
      }else{
        res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
      }
    }
  }