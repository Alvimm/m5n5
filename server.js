const express = require('express');
const bodyParser = require('body-parser');
const { doLogin, getPerfil } = require('./services/authService');
const { encrypt, decrypt } = require('./services/encryptionService');
const { getContracts } = require('./services/contractService');
const users = require('./data/users');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/api/auth/login', (req, res) => {
  const credentials = req.body;
  const userData = doLogin(credentials);

  if (userData) {
    const dataToEncrypt = `{"usuario_id":${userData.id}}`;
    const bufferToEncrypt = Buffer.from(dataToEncrypt, "utf8");
    const hashString = encrypt(bufferToEncrypt);
    res.json({ sessionid: hashString });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/decrypt/:sessionid', (req, res) => {
  const sessionid = req.params.sessionid;
  const decryptedSessionid = decrypt(sessionid);
  res.json({ decryptedSessionid: decryptedSessionid });
});

app.get('/api/users/:sessionid', (req, res) => {
  const sessionid = req.params.sessionid;
  const perfil = getPerfil(sessionid);

  if (perfil !== 'admin') {
    res.status(403).json({ message: 'Forbidden' });
  } else {
    res.status(200).json({ data: users });
  }
});

app.get('/api/contracts/:empresa/:inicio/:sessionid', (req, res) => {
  const empresa = req.params.empresa;
  const dtInicio = req.params.inicio;
  const sessionid = req.params.sessionid;

  const result = getContracts(empresa, dtInicio);
  if (result)
    res.status(200).json({ data: result });
  else
    res.status(404).json({ data: 'Dados Não encontrados' });
});