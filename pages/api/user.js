const security = require('./services/security');
const service = require('./services/user');

export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'POST') {
    service.userRegister(req, res);
  }
  if (req.method === 'DELETE') {
    service.userDelete(req, res);
  }
  if (req.method === 'GET') {
    service.userListByNm(req, res);
  }else{
    service.userListAll(res);
  }
}

