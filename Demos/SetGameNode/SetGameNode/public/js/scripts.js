// imageList holds the images for each card in the deck
var imageList = new Array();

// isSet takes a list of 3 card numbers and determines if the list constitutes a set 
function isSet(ilist) {
    function count(n) {
        return (n - 1) % 3 + 1;
    }
    function color(n) { // 1=red 2=purple 3=green
        return (Math.ceil(n / 3) - 1) % 3 + 1;
    }
    function shape(n) { // 1=squiggle 2=diamond 3=oval
        return (Math.ceil(n / 9) - 1) % 3 + 1;
    }
    function fill(n) { // 1=filled 2=shaded 3=open
        return (Math.ceil(n / 27) - 1) % 3 + 1;
    }

    function featureOk(feature) {
        if (feature(ilist[0]) == feature(ilist[1]) && feature(ilist[1]) == feature(ilist[2]))
            return true;
        else
        if (feature(ilist[0]) == feature(ilist[1]) || feature(ilist[1]) == feature(ilist[2]) || feature(ilist[0]) == feature(ilist[2]))
            return false;
        else
            return true;
    }

    function setOk() {
        return featureOk(count) && featureOk(color) && featureOk(shape) && featureOk(fill);
    }

    return setOk();
}

var okToLoad = true;
function loadGrid(cards) {
    //if (okToLoad) {
    //$("#idlist").html(cards.toString());
    $("#grid").empty();
    for (var i = 0; i < cards.length; i += 3) {
        var newRow = $("<tr></tr>");
        for (var j = 0; j < 3; ++j) {
            var newCell = $("<td></td>");
            $(newCell).html('');
            $(newCell).append(imageList[cards[i + j]]);
            $(newRow).append(newCell);
        }
        $("#grid").append(newRow);
    }
    $("img").click(clickCard);
    //}
}

// loadStatus reloads the leader board from the list of players
function loadStatus(players) {
    var usergrid = "";
    for (var i = 0; i < players.length; ++i) {
        var player = players[i];
        var row = "<tr style='background-color:" + (player.winner ? "gold" : "white") + "'>" +
                "<td>" + player.player + "</td>" +
                "<td>" + player.score + "</td>" +
                "<td>" + (player.row ? "*" : " ") + "</td>" +
                "<td>" + (player.shuffle ? "*" : " ") + "</td>" +
                "<td>" + (player.end ? "*" : " ") + "</td>" +
                "</tr>";
        usergrid += row;
    }
    $("#userlist tbody").html(usergrid);
}

function nullFcn(result) {
}

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

var myid = 0;

function login(loginname) {
    doAjaxCall("GET", "login", {loginName: loginname},
    function (result) {
        myid = result;
        loadName();
    });
}

// Send an addrow request to the server
function addRow() {
    doAjaxCall("GET", "addrow", {id: myid}, nullFcn);
}
// Send a shuffle request ot the server
function shuffle() {
    doAjaxCall("GET", "shuffle", {id: myid}, nullFcn);
}

// Send an endgame request to the server
function endGame() {
    doAjaxCall("GET", "endgame", {id: myid}, nullFcn);
}

// Submit a set to the server
function submitSet(lst) {
    doAjaxCall("GET", "submitset", {id: myid, cards: lst}, nullFcn);
}

// Retrieve the user's login name from the server
function loadName() {
    doAjaxCall("GET", "loginname", {id: myid},
    function (result) {
        $("#lname").html(result)
    });
}

// Process a click on one of the cards in the grid. Toggle the card's status
// between selected and not selected. Also make sure that the user can't select
// more than 3 cards.
var clickedCount = 0;
function clickCard(evt) {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        if (--clickedCount <= 0) {
            clickedCount = 0;
            okToLoad = true;
        }
    } else {
        if (clickedCount >= 3) {
            alert("You can select a maximum of 3 cards.");
        } else {
            $(this).addClass("selected");
            ++clickedCount;
            okToLoad = false;
        }
    }
}

// Load all 81 card images into memory to same time later.
function preloadImages() {
    for (var i = 1; i <= 81; ++i) {
        var img = new Image();
        var num = ("0000" + i);
        num = num.substr(num.length - 2);
        img.id = "" + i;
        img.src = "images/" + num + ".gif";
        imageList[i] = img;
    }
}

// Attach an event handler to each button on the page
function attachEventHandlers() {
    $("#login").click(function () {
        login($("#loginname").val());
        $("#loginname").val("");

    });
    $("#btnSet").click(function () {
        var lst = new Array();
        $("#grid img.selected").each(function () {
            var id = parseInt($(this).attr("id"));
            lst.push(id);
        });
        if (isSet(lst)) {
            submitSet(lst);
            clickedCount = 0;
            okToLoad = true;
        } else {
            alert("Invalid Set!");
        }

    });
    $("#btnAdd").click(function () {
        addRow();
    });
    $("#btnShuffle").click(function () {
        shuffle();
    });
    $("#btnEnd").click(function () {
        endGame();
    });

    $("#sendchat").click(function () {
        doAjaxCall("GET", "chat", {id: myid, message: $("#chatmsg").val()}, nullFcn);
        $("#chatmsg").val("");
    });
}

// Append a new chat message to the chat box
function displayChatMessage(message) {
    $("#chat").append(message);
}

// Run the setup code when the page finishes loading
$( () => {
    preloadImages();
    attachEventHandlers();
    var socket = io.connect(HOST);
    
    // Update the card grid when a new card list arrives from the server
    socket.on('hand', function (cards) {
        loadGrid(cards);
    });
    
    // Update the leader board when an updated player list arrives from the server
    socket.on('players', function (players) {
        loadStatus(players);
    });
    
    // Update the chat box when a new message arrives from the server
    socket.on('chat', function (message) {
        displayChatMessage(message);
    });
});
