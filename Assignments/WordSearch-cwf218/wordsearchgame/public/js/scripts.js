var HOST = "localhost:3000";
//var HOST = "localhost:3000";
var SERVER = "http://" + HOST + "/";

// Utility method for encapsulating the jQuery Ajax Call
function doAjaxCall(method, cmd, params, fcn) {
    $.ajax(
            SERVER + cmd,
            {
                type: method,
                processData: true,
                data: params,
                dataType: "jsonp",
                success: function (result) {
                    fcn(result)
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error: " + jqXHR.responseText);
                    alert("Error: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            }
    );
}

var myid;

// Login user
function login(loginname) {
    console.log("Login function called. Username: " + loginname);
    $.ajax(
        "/wordsearch/login",
        {
            type: "GET",
            processData: true,
            data: {
                username: loginname
            },
            dataType: "json",
            success: function(ret) {
                myid = ret.id;
                console.log("AJAX complete. ID: " + myid);
                getPuzzle();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
        }
    );
}

// Send a puzzle request to the server
function getPuzzle(){
    $.ajax(
        "/wordsearch/puzzle",
        {
            type: "GET",
            processData: true,
            data: {
                id: myid
            },
            dataType: "json",
            success: function(ret) {
                console.log("GET /puzzle successful");
                console.log("Theme: " + ret.theme);
                setPuzzleTitle(ret.theme);
                generatePuzzle(ret);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
        }
    );
}

function submitWord(){
    
    doAjaxCall("GET", "submit", {id: myid},
    function (result) {
        if (result.success){
            
        } else {

        }
    });
}

var appendString = "";

function generatePuzzle(result){
    var x = 0;
    var i = 0;
    var t = 0;
    for (i = 0; i < result.ncols; i++){
        appendString = "<tr>";
        for (t = 0; t < result.nrows; t++){
            appendString += "<td>" + result.grid[x] + "</td>";
            x++;
        }
        appendString += "</tr>";
        $('table').append(appendString);
    }
}

function setPuzzleTitle(name) {
    $("#puzzlelabel").html(name);
}

function handleLetterClick(cell){

}

// Attach an event handler to each button on the page
function attachEventHandlers() {   
    $("#login").click(function () {
        console.log("Login button clicked");
        login($("#username").val());
        $("#username").val("");
    });

    $("#submit").click(function () {
        console.log("Submit button clicked");
        submitWord();
    });

    //function called when letter is clicked
    $("td").click(function(){
        var cell = $(this);
        var row = cell.parent();
        var col = cell.parents("table").find("td:nth-child(" + (cell.index() + 1) + ")");

        console.log("row: " + row + "col: " + col);
    });
}

$(function(){
    
});

// Run the setup code when the page finishes loading
$( () => {
    //preloadImages();
    attachEventHandlers();
    var socket = io.connect(HOST);

    //
    socket.on('players', function() {

    });

    //
    socket.on('gridupdates', function() {

    });
});