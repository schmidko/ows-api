const http = require('http');
const app = require('../src/app');

const port = process.env.PORT || 6699;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);