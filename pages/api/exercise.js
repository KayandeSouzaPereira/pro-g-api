const security = require('./services/security');
const service = require("./services/exercise");

export default function handler(req, res) {

  security.checkSec(req, res);
 

  if (req.method === 'POST') {
    service.exerciseRegister(req, res);
  }
  if (req.method === 'DELETE') {
    service.exerciseExclude(req, res);
  }
  if (req.method === 'GET') {
    service.exerciseListByNm(req, res);
  }else{
    service.exerciseListAll(res);
  }
}

