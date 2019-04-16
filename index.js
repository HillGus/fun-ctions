const http = require('http');
const fs = require('fs');

const functions = {};

function getBody(req, callback) {
	var body = '';
	var shouldReturn = false;
	req.on('data', (data) => body += data);
	req.on('end', () => callback(body));
}
console.log('opa');
http.createServer((req, res) => {
	console.log(req);
	if (req.url === '/')
		fs.readFile('index.html', (err, html) => res.end(html));
	else if (req.url.startsWith('/function')) {
		switch (req.method) {
			case 'GET': {
				const functionName = req.url.replace('/function/', '');
				if (functions[functionName]) {
					const response = eval('(' + functions[functionName] + ')()');
				}
				break;
			}
			case 'POST': {
				getBody(req, (body) => {
					body = JSON.parse(body);
					functions[body['name']] = body['function'];
				});
				break;
			}
			case 'DELETE': {
				delete functions[body['name']];
				break;
			}
		}
		if (!res.finished)
			res.end(JSON.stringify(functions));
	}
}).listen(process.env.PORT || 4000, "0.0.0.0");