/* Wordsearch Game Server
 J. Femister
 Version 1.0  - Original Version
 */


// Constants

const PORT = 3000;
const HOST = "localhost";
const DEBUG = 1;
const NOT_BEING_USED = -1;
const ERROR = -1;
const SUCCESS = 0;

const http = require("http");
const url = require('url');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

let theme = "";
let gridletters = "";

function getGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class Player {
    constructor(login, ipaddr) {
        this.name = login;
        this.id = getGUID();
        this.score = 0;
        this.winner = false;
        this.ipaddr = ipaddr;
    }
}

class PlayerList {
    constructor() {
        this.players = [];
        this.ids = {};
        this.unames = {};
    }

    add(player) {
        this.players.push(player);
        this.ids[player.id] = player;
        this.unames[player.name] = player;
        return player.id;
    }

    updateScore(id, pts) {
        this.ids[id].score += pts;
    }

    length() {
        return this.players.length;
    }

    idOnList(id) {
        return !(typeof this.ids[id] === "undefined");
    }

    nameOnList(uname) {
        return !(typeof this.unames[uname] === "undefined");
    }

    getPlayer(id) {
        return this.ids[id];
    }

    getPlayerName(id) {
        return this.getPlayer(id).name;
    }

    setWinner() {
        var hi = -1;
        var winner = -1;
        this.players.forEach((player, index, array) => {
            if (player.score > hi) {
                hi = player.score;
                winner = index;
            }
        });
        if (winner > -1) {
            this.players.forEach((player, index, array) => {
                if (index === winner)
                    player.winner = true;
                else
                    player.winner = false;

            });
        }
    }
}

var players = new PlayerList();
var playerListChanged = false;

function processLogin(req, uname) {
    let ipaddr = req.connection.remoteAddress;
    let filteredName = uname.replace(/[^a-zA-Z0-9 ]/g, "");
    if (filteredName.trim().length <= 0) {
        console.log(`Login: Empty name rejected. (${uname})`);
        return "";
    } else {
        if (filteredName.length > 20) {
            filteredName = filteredName.substring(0, 21);
        }
        while (players.nameOnList(filteredName)) {
            filteredName = filteredName + "*";
        }
        let id = players.add(new Player(filteredName, ipaddr));
        let index = players.length();
        console.log(`New login ${filteredName}`);
        let ret = {};
        ret.success = true;
        ret.id = id;
        ret.username = players.getPlayerName(id);
        playerListChanged = true;
        return ret;
    }
}

function processPuzzle(id) {
    if (players.idOnList(id)) {
        let ret = {};
        ret.success = true;
        ret.theme = theme;
        ret.nrows = nrows;
        ret.ncols = ncols;
        ret.grid = gridletters;
        return ret;
    } else {
        let ret = {};
        ret.success = false;
        ret.theme = "INVALID ID";
        ret.nrows = 0;
        ret.ncols = 0;
        ret.grid = ""
        return ret;
    }
}


let currentUpdates = [];
let accumulatedUpdates = [];
function processSubmit(id, pairs) {
    function grabLetters(list) {
        let letts = "";
        function getLetter(r, c) {
            let index = r * ncols + c; return gridletters.charAt(index)
        }
        let minr = minc = 5000;
        let maxr = maxc = -1;
        list.forEach((pair, index, array) => {
            let row = parseInt(pair.r);
            let col = parseInt(pair.c);
            minr = Math.min(minr, row);
            minc = Math.min(minc, col);
            maxr = Math.max(maxr, row);
            maxc = Math.max(maxc, col);
            let ll = getLetter(row, col);
            letts += ll
        });
        //console.log(`minr=${minr} minc=${minc} maxr=${maxr} maxc=${maxc} letts=${letts}`);
        if ((maxr - minr == 0 && maxc - minc == letts.length - 1) ||
            (maxc - minc == 0 && maxr - minr == letts.length - 1) ||
            (maxr - minr == letts.length - 1 && maxc - minc == letts.length - 1))
            return letts;
        else
            return "";
    }
    let wd = grabLetters(pairs);
    if (wd == "") return false;
    let swd = sortString(wd);
    if (words[swd] == 1) {
        if (swd != "HPQRX")
           words[swd] = 2;
        let newwd = { text: wd, letters: pairs }
        currentUpdates.push(newwd);
        accumulatedUpdates.push(newwd);
        players.updateScore(id, wd.length);
        playerListChanged = true;
        return true;
    } else {
        return false;
    }
}

function updateGrid() {
    io.sockets.emit("gridupdates", { words: currentUpdates });
}

function updatePlayers() {
    io.sockets.emit("players", players.players);
}

function fullUpdate() {
    io.sockets.emit("gridupdates", { words: accumulatedUpdates });
}

function doUpdates() {
    if (playerListChanged) {
        playerListChanged = false;
        updatePlayers();
    }
    if (currentUpdates.length > 0) {
        updateGrid();
        currentUpdates = [];
    }
}

function updateStats() {
    let txt = "";
}

function reset() {
    players = new PlayerList();
    playerListChanged = true;
    currentUpdates = [];
    accumulatedUpdates = [];
}

setInterval(doUpdates, 1000);
setInterval(fullUpdate, 60000);
//setInterval(reset, 120000);

var words = {};
function sortString(s) {
    return s.split('').sort().join('');
}

function loadPuzzle() {
    let file = fs.readFileSync("statesout.txt", { encoding: 'utf-8' });
    let lines = file.split('\n');
    theme = lines[0];
    nrows = parseInt(lines[1]);
    ncols = parseInt(lines[2]);
    nwords = parseInt(lines[3]);
    for (let i = 4; i < 4 + nwords; ++i) {
        words[sortString(lines[i])] = 1;
    }
    gridletters = lines[nwords + 4];
    console.log(`Loaded puzzle: theme=${theme}`)
}

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/wordsearch/login", (req, res) => {
    let uname = req.query.username;
    if (typeof uname == 'undefined') {
        res.send({ success: false });
    } else {
        let ret = processLogin(req, uname);
        res.send(ret);
    }
});

app.get("/wordsearch/puzzle", (req, res) => {
    let id = req.query.id;
    if (typeof id == 'undefined') {
        res.send({ success: false });
    } else {
        let ret = processPuzzle(id);
        res.send(ret);
    }
});

app.get("/wordsearch/submit", (req, res) => {
    let id = req.query.id;
    let letters = req.query.letters;
    if (typeof id == 'undefined' || typeof letters == 'undefined') {
        res.send({ success: false });
    } else {
        let ret = processSubmit(id, letters);
        res.send({ success: ret });
    }
});

app.use((req, res) => {
    res.writeHead(404);
    res.end('Not found.');
    console.log('Error: Invalid Request: ' + req.url);
});

var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(PORT, HOST, () => {
    loadPuzzle();
    console.log(`Wordsearch Server running at http://${HOST}:${PORT}/`);
});

// Set up socket.io connection for sending card grids and player lists
var clientList = new Object();
io.sockets.on('connection',
    function (socket) {
        var clientIPAddress = socket.request.connection.remoteAddress;
        console.log("New Connection from " + clientIPAddress);
        clientList[clientIPAddress] = socket;
    }
);