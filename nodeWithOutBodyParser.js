var express = require('express');
var app = express();
var fs = require('fs');

app.use(function (req, res, next) {
    var data = "";
    console.log("Request Method:" + req.method)
    if (req.method === "POST") {

        req.on('data', function (chunk) {
            data += chunk;
            console.log("chunk:" + chunk);
        })
        req.on('end', function () {
            req.rawBody = data;
            req.jsonBody = JSON.parse(data);
            next();
        })
    } else {
        next();
    }

})
app.post('/users', (req, res) => {
    // console.log('Body JSON Data :' + JSON.stringify(req.jsonBody));
    console.log("Post users");
    var resData = {
        "userid": req.jsonBody.userid,
        "firstName": req.jsonBody.firstName,
        "lastName": req.jsonBody.lastName,
        "location": req.jsonBody.location
    };

    var usersFile = "users.json";
    var usersJson = fs.readFileSync(usersFile);
    var users = JSON.parse(usersJson);
    users.push(resData);

    fs.writeFileSync(usersFile, JSON.stringify(users));
    res.header("Content-Type", "application/json");
    res.send(users);
});

app.get('/users', (req, res) => {
    console.log("get users");
    var usersFile = "users.json";
    var usersJson = fs.readFileSync(usersFile);
    res.header("Content-Type", "application/json");

    res.send(JSON.parse(usersJson));
});


app.listen(3001);

//  http://localhost:3000/processusers
//  {
//         "userid": 104,
//         "firstName": "Kamesh",
//         "lastName": "TEST",
//         "location": "NC"
//     }

