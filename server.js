const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req,res) => {
  res.end("Hello from branch: " + (process.env.APP_BRANCH || "unknown"));
}).listen(port);
