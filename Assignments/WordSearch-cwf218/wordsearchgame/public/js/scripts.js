var HOST = "localhost:3000";
//var HOST = "localhost:3000";
var SERVER = "http://" + HOST + "/";

// Array of cell objects that have been clicked
var cells = [];

// Array of players on the leaderboard
var players = [];

// Stores the players id
var myid;

// Login user
function login(loginname) {
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
                console.log("Login AJAX complete. ID: " + myid);
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
                console.log("GET /puzzle successful. Theme: " + ret.theme);
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
    var letters = {};
    
    // Set up letters array to submit each row and column
    for (var i = 0; i < cells.length; i++) {
        letters[i] = {r: cells[i].itemRow, c: cells[i].itemCol}; 
    }
    $.ajax(
        "/wordsearch/submit",
        {
            type: "GET",
            processData: true,
            data: {
                id: myid,
                letters: letters
               },
            dataType: "json",
            success: function(ret) {
                if (ret.success){
                    console.log("AJAX complete - word found & submitted successfully");
                    wordFound();
                    cells = []; //Reset cells after this is processed
                } else {
                    window.alert("Not a word");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
        }
    );
    
}

function wordFound(){
    for (var i = 0; i < cells.length; i++){
        var td = cells[i].tdItem;
        $(td).addClass('locked').removeClass('selected');
    }
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
        login($("#username").val());
        $("#username").val("");
    });

    $("#submit").click(function () {
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
            var cellToPush = {itemCol: col, itemRow: row, tdItem: $(this)};
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

            // Remove the item
            if (index > -1){
                cells.splice(index, 1);
            }
        }
    });     
}

// Run the setup code when the page finishes loading
$( () => {
    //preloadImages();
    attachEventHandlers();
    var socket = io.connect(HOST);

    // Returns {name, score, winner}
    socket.on('players', function(ret) {
        players = [];
        ret.forEach((name, score, winner) => {
            var name = ret.name;
            var score = ret.score;
            var winner = ret.winner;
            players.push({name: name, score: score, winner: winner});
        });
        
    });

    // Returns claimed words & letters
    socket.on('gridupdates', function() {

    });
});