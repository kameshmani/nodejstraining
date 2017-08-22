var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.json());     // to support JSON-encoded bodies

app.get('/processusers', (req, res) => {

    var reqURL = "http://localhost:3001/users";
    request(reqURL, function (err, response, body) {

        log("body:" + JSON.stringify(body));

        if (err) {
            res.status(500);
            res.header("Content-Type", "application/json");
            res.send(buildErrorJson('ERROR', 'Error in processing request'));
        } else if (!err && response.statusCode == 200) {
            res.status(200);
            res.header("Content-Type", "application/json");
            res.send(body);
        }
    });
});


app.post('/processusers', (req, res) => {

    var postData = {
        userid: 101,
        firstName: "Kamesh",
        lastName: "TEST",
        location: "NC"
    };

    var reqURL = 'http://localhost:3001/users'
    var options = {
        method: 'post',
        body: postData,
        json: true,
        url: reqURL
    }
    request(options, function (err, response, body) {
        if (err) {
            res.status(500);
            res.header("Content-Type", "application/json");
            res.send(buildErrorJson('ERROR', 'Error in processing request'));
        }
        var bodyJson = JSON.stringify(body);
        log("bodyJson:"+bodyJson);
        // log("UserId:"+bodyJson.userid);
        // log("firstName:"+bodyJson.firstName);
        // log("lastName:"+bodyJson.lastName);
        // log("location:"+bodyJson.location);
        res.send(body);
    })

});
app.listen(3000);

var log = msg => console.log(msg);

var buildErrorJson = (code, message) => {

    var json = JSON.stringify(
        {
            "code": code,
            "message": message
        }
    );
    return json;
}

// http://localhost:3000/processusers
