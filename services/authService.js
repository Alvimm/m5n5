const users = require('../data/users');
const { decrypt } = require('./encryptionService');

function doLogin(credentials) {
  return users.find(user => user.username === credentials.username && user.password === credentials.password);
}

function getPerfil(sessionId) {
  const user = JSON.parse(decrypt(sessionId));
  const userData = users.find(item => parseInt(user.usuario_id) === parseInt(item.id));
  return userData ? userData.perfil : null;
}

module.exports = { doLogin, getPerfil };