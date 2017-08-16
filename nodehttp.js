/* Request

http://localhost:3000?firstName=Kamesh&lastName=Mani&userId=103&location=NC

*/


const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;


process.on('uncaughtException', function (error) {
    log(error);
})

// ES6 Arrow function
var log = msg => console.log(msg);

// server.on("request", function (req, res) {
//     res.end("this is the response");
// });


http.createServer((req, res) => {
    var content_type = "application/json";

    // Using URL Module
    var url_query = url.parse("http://" + req.headers.host + req.url, true);
    var query = url_query.query;

    // Using ES6 Template Literals & Multi-line Strings
    var logReq = `
        Request URL             :${url_query.href}
        Request URL             :${url_query.protocol}
        Request Method          :${req.method}
        Host                    :${url_query.hostname}
        Port                    :${url_query.port}
        Request Path            :${url_query.pathname}
        Request Query String    :${url_query.search}
        Request Query JSON      :${JSON.stringify(url_query.query)}
        Header                  :${JSON.stringify(req.headers)}
        `;

    log(logReq);

    if (url_query.pathname == '/users') {

        if (req.method === 'GET') {

            addHeader(res, 200, content_type);
            readUsersJSON(res);

        } else if (req.method === 'PUT') {

            if (query.userId && query.firstName && query.lastName && query.location) {
                var userData = {
                    "userid": parseInt(query.userId),
                    "firstName": query.firstName,
                    "lastName": query.lastName,
                    "location": query.location
                };
                var usersFile = "users.json";
                var usersJson = fs.readFileSync(usersFile);
                var users = JSON.parse(usersJson);

                var indexOfUserId = users.map(function (item) { return item.userid; }).indexOf(parseInt(query.userId));
                log("UserId index:" + indexOfUserId);

                if (indexOfUserId === -1) {
                    var code = "INVALID_USERID";
                    var message = "Bad Request, Invalid user id";
                    addHeader(res, 400, content_type);
                    addError(res, code, message);
                    res.end();
                } else {
                    users.splice(indexOfUserId, 1);     // Remove existing user object
                    users.push(userData);               // Add updated user object
                    fs.writeFileSync(usersFile, JSON.stringify(users));
                    addHeader(res, 200, content_type);
                    let json = JSON.stringify(users);
                    !isEmptyObject(json) ? res.write(json) : res.write(buildErrorJson('NO_DATA', 'There is no data available'));
                    res.end();
                }

            } else {
                var code = "INVALID_DATA";
                var message = "Bad data, incomplete data";
                addHeader(res, 400, content_type);
                addError(res, code, message);
                res.end();
            }
        } else if (req.method === 'POST') {


            if (query.userId && query.firstName && query.lastName && query.location) {
                var userData = {
                    "userid": parseInt(query.userId),
                    "firstName": query.firstName,
                    "lastName": query.lastName,
                    "location": query.location
                };
                var usersFile = "users.json";
                var usersJson = fs.readFileSync(usersFile);
                var users = JSON.parse(usersJson);
                users.push(userData);

                fs.writeFileSync(usersFile, JSON.stringify(users));
                addHeader(res, 201, content_type);
                let json = JSON.stringify(users);
                !isEmptyObject(json) ? res.write(json) : res.write(buildErrorJson('NO_DATA', 'There is no data available'));
                res.end();
            } else {
                var code = "INVALID_DATA";
                var message = "Bad data, incomplete data";
                addHeader(res, 400, content_type);
                addError(res, code, message);
                res.end();
            }

        } else if (req.method === 'DELETE') {
            var url_query = url.parse(req.url, true);
            var query = url_query.query;
            if (query.userId) {
                var usersFile = "users.json";
                var usersJson = fs.readFileSync(usersFile);
                var users = JSON.parse(usersJson);

                var indexOfUserId = users.map(function (item) { return item.userid; }).indexOf(parseInt(query.userId));
                log("UserId index:" + indexOfUserId);


                if (indexOfUserId === -1) {
                    var code = "INVALID_USERID";
                    var message = "Bad Request, Invalid user id";
                    addHeader(res, 400, content_type);
                    addError(res, code, message);
                    res.end();
                } else {
                    users.splice(indexOfUserId, 1);
                    addHeader(res, 200, content_type);
                    fs.writeFileSync(usersFile, JSON.stringify(users));
                    let json = JSON.stringify(users);
                    !isEmptyObject(json) ? res.write(json) : res.write(buildErrorJson('NO_DATA', 'There is no data available'));
                    res.end();
                }
            } else {
                var code = "INVALID_USERID";
                var message = "Bad Request, Invalid user id";
                addHeader(res, 400, content_type);
                addError(res, code, message);
                res.end();
            }

        } else {
            var code = "INVALID_HTTP_METHOD_ERROR";
            var message = "Bad Request, Invalid http method";
            addHeader(res, 400, content_type);
            addError(res, code, message);

            res.end();
        }
    } else {
        var code = "INVALID REQEUST";
        var message = "Bad Request, Invalid Request";
        addHeader(res, 404, content_type);
        addError(res, code, message);

        res.end();
    }

}).listen(port);

log("server started.. running on " + port);

// Using ES6 Arrow function
var addHeader = (res, status, type) => {
    var content_type = { "Content-Type": type };
    res.writeHead(status, content_type);
}

var addError = (res, code, message) => {
    res.write(buildErrorJson(code, message));
}

var buildErrorJson = (code, message) => {

    var json = JSON.stringify(
        {
            "code": code,
            "message": message
        }
    );
    return json;
}

var readUsersJSON = (res) => {

    fs.readFile('users.json', (err, json) => {
        if (err) {
            log("Error" + err.stack);
            var code = "BAD_DATA";
            var message = "Bad data, missing/invalid file format";
            res.write(buildErrorJson(code, message));
            res.end();
        } else {
            !isEmptyObject(json) ? res.write(json) : res.write(buildErrorJson('NO_DATA', 'There is no data available'));
            res.end();
        }
    });
}

var isEmptyObject = obj => {
    return Object.keys(obj).length === 2;
}

























