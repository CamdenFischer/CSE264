var HOST = "localhost:3000";
//var HOST = "localhost:3000";
var SERVER = "http://" + HOST + "/";

//vars for holding which cells have been clicked
var cells = [];
var rows = [];
var columns = [];

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
            appendString += "<td class='notSelected'>" + result.grid[x] + "</td>";
            x++;
        }
        appendString += "</tr>";
        $('table').append(appendString);
    }
}

function setPuzzleTitle(name) {
    $("#puzzlelabel").html(name);
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
    $('table').on('click', 'td', function() {
        // Get row and column of the clicked cell
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());

        // If the clicked cell has not been clicked yet, change class
        if ($(this).is('.notSelected')) {
            // Change class of the sell
            $(this).addClass('selected').removeClass('notSelected');

            // Add cell to list of currently selected cells
            var cellToPush = {itemCol: col, itemRow: row};
            cells.push(cellToPush);
        }
        // If it has been clicked change it back
        else if ($(this).is('.selected')){
            // Change class of the cell
            $(this).addClass('notSelected').removeClass('selected');

            var index = -1;

            // Get index of item to be deleted
            for (var i = 0; i < cells.length; i++){

                if (cells[i].itemCol == col && cells[i].itemRow == row){
                    index = i;
                }
            }

            console.log("index to delete: " + index);

            // Remove the item
            if (index > -1){
                cells.splice(index, 1);
            }
        } 
        
        console.log("Number of Cells: " + cells.length);
    });     
}

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