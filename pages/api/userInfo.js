const security = require('./services/security');
const service = require('./services/userinfo');

export default function handler(req, res) {

  security.checkSec(req, res);
  
  if (req.method === 'POST') {
    service.userInfoRegister(req, res);
  }
  if (req.method === 'DELETE') {
    service.userInfoDelete(req, res)
  }
  if (req.method === 'GET') {
    service.userInfoListAll(res);
  }
}
