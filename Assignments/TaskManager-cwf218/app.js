/*
    Camden Fischer
    cwf218
    CSE 264 - Web Apps
    HW 4
*/
var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan"); 
var bodyParser = require("body-parser");
var $ = require("jquery");

var app = express();

var entries = [];
app.locals.entries = entries;

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    res.render("index");
});

app.post("/delete", function(req, res) {
    console.log("deleted boiii");
});

app.post("/", function(req, res){   

    if (!req.body.task || !req.body.type || !req.body.date){
        res.status(400).send("Entries must have a title and a body.");
        return;
    }
    entries.push({
        task: req.body.task,
        type: req.body.type,
        date: req.body.date,
        number: entries.length
    });
    console.log(entries);
    res.redirect("/");
});

http.createServer(app).listen(3000, function() {
    console.log("Task Manager app started.");
});

function length(){
    return entries.length;
}

function deleteItem(){
    console.log('oh fuck yeah');
   /*
    $('table [type="checkbox"]').each(function(i, chk) {
        if (chk.checked) {
        entries.remove(i);
        }
    });

    for (i = 0; i < entries.length; i++){
        entries[i].number = 1;
    }

    location.reload();
*/
}