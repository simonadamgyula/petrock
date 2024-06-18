const fs = require('node:fs');
const { createServer } = require('node:http');
var path = require('path');

const server = createServer((req, res) => {
    if (req.method == "GET") {
        handeGet(req, res);
    } else if (req.method == "POST") {
        handePost(req, res);
    }
});

function handeGet(req, res) {
    console.log(req.url)

    if (req.url == "/") {
        const data = fs.readFileSync("html/index.html");

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data)
        res.end();
    }
    if (req.url.startsWith("/public")) {
        const contentType = getContentType(req.url);

        let data = null
        try {
            data = fs.readFileSync("." + req.url);
        } catch (err) {
            console.log(err);
            res.writeHead(404, { "Content-Type": "text/html" });
            res.write("404 Not Found");
            res.end();

            return;
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.write(data)
        res.end();
    }
}

function handePost(req, res) {
    if (req.url == "/joke") {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            fetch("https://v2.jokeapi.dev/joke/Any?type=single")
                .then(response => response.json())
                .then(joke => {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(joke));
                    res.end();
                });
        });
    }

}

function getContentType(url) {
    var extname = path.extname(url);
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        default:
            contentType = 'text/html';
            break;
    }
    return contentType
}

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
});
