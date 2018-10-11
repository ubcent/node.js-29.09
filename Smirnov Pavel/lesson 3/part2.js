let req = require("request");
let urlLink = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181011T204241Z.89526eacc264616c.860cfeeed9defb4ee8526313afc5aa549b095cd1&lang=en-ru";
let url = require("url");
let http = require("http");
let text = "";

// текст передается в виде http://localhost:8888/?text=hello
function onRequest(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    if(request.headers.referer){
        text = url.parse(request.headers.referer, true).query.text;
        req(urlLink + "&text=" + text,
            (error, res, body)=>{
                console.log(JSON.parse(body).text[0])
            });
    }
    response.end();
}
http.createServer(onRequest).listen(8888);
console.log("Server has started.");

