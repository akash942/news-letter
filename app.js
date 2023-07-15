const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { log } = require("console");
const { subscribe } = require("diagnostics_channel");
const { dirname } = require("path");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fName;
  const lname = req.body.lName;
  const email = req.body.email;
  const url = "https://us21.api.mailchimp.com/3.0/lists/ff27c1b165";

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "akash:130c500176242b8484e37150463c7b40-us213",
  };

  var sc = 0;
  const request = https.request(url, options, function (response) {
    sc = response.statusCode;
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
    if (sc == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();

  // console.log(fname);
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});

module.exports = app;

// API key
// 130c500176242b8484e37150463c7b40-us21
// 130c500176242b8484e37150463c7b40-us21

// audience id
// ff27c1b165
