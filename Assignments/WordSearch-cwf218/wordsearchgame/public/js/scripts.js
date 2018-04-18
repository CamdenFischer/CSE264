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
                console.log("Login complete. ID: " + myid);
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
                    console.log("Word found & submitted successfully");
                    wordFound();
                    cells = []; //Reset cells after this is processed
                } else {
                    console.log("Not a word");
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

// This class changes found words to a neww color
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
        $('#puzzle').append(appendString);
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
    $('#puzzle').on('click', 'td', function() {
        // Get row and column of the clicked cell
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());

        // If the clicked cell has not been clicked yet, change class
        if ($(this).is('.notSelected')) {
            // Change class of the cell
            $(this).addClass('selected').removeClass('notSelected');

            // Add cell to list of currently selected cells
            var cellToPush = {itemCol: col, itemRow: row, tdItem: $(this)};
            cells.push(cellToPush);
            //console.log($(this).html() + " clicked.");
        }
        // If it has been clicked change it back
        else if ($(this).is('.selected')){
            // Change class of the cell
            $(this).addClass('notSelected').removeClass('selected');

            removeFromCells(row, col);
        }
    });     
}

// Remove a cell from the global array
function removeFromCells(row, col){
    var index = -1;

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

// Run the setup code when the page finishes loading
$( () => {
    //preloadImages();
    attachEventHandlers();
    var socket = io.connect(HOST);

    // Returns {name, score, winner}
    socket.on('players', function(ret) {
        console.log("Leaderboard updated");
        appendPlayers(ret);
    });

    // Returns claimed words & letters
    socket.on('gridupdates', function(ret) {
        updateGrid(ret.words);
    });
});

function updateGrid(words){

    for (var i = 0; i < words.length; i++){ // For each word
        var word = words[i].letters;
        console.log("Grid update: " + words[i].text);
        for (var t = 0; t < word.length; t++){ // For each letter in the word
            var letter = word[t];
            
            var row = letter.r;
            var col = letter.c;

            //console.log("row: " + row + " col: " + col);

            var cellToChange = $('#puzzle tr').eq(row).find('td').eq(col);
            removeFromCells(row, col);
            $(cellToChange).removeClass('notSelected').removeClass('selected').addClass('locked'); 
        }
    }
}

// This function builds the leaderboard table
function appendPlayers(ret){
    // First, delete all players on the list
    $("#leaderboard tr").empty();
    $("#leaderboard").append("<tr><th>Player</th><th>Points</th></tr>");

    // Next, add the new list of players to the list
    for (var i = 0; i < ret.length; i++){
        var player = ret[i];
        var str;
        if (player.winner){
            str = "<tr class='winner'>";
        } else {
            str = "<tr class='notWinner'>"
        }
        str += "<td>" + player.name + "</td>";
        str += "<td>" + player.score + "</td>";
        str += "</tr>";
        $("#leaderboard").append(str);
    }

}