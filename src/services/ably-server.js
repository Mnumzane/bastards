// Heavily inspire by https://dev.to/ably/building-a-realtime-multiplayer-browser-game-in-less-than-a-day-part-3-4-4bbm

const envConfig = require("dotenv").config();
const express = require("express");
const Ably = require("ably");
const app = express();
const ABLY_API_KEY = process.env.ABLY_API_KEY;
const MIN_PLAYERS_TO_START_GAME = 3;
const MAX_PLAYERS_TO_START_GAME = 5;

let peopleAccessingTheWebsite = 0;
const players = {};
const playerChannels = {};
let gameRoom;
let totalPlayers = 0;

const realtime = Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false,
});

// create a uniqueId to assign to clients on auth
const uniqueId = function () {
    return "id-" + totalPlayers + Math.random().toString();
};

app.use(express.static("js"));

app.get("/auth", (request, response) => {
    const tokenParams = { clientId: uniqueId() };
    realtime.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
        if (err) {
            response
                .status(500)
                .send("Error requesting token: " + JSON.stringify(err));
        } else {
            response.setHeader("Content-Type", "application/json");
            response.send(JSON.stringify(tokenRequest));
        }
    });
});

app.get("/", (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (++peopleAccessingTheWebsite > MAX_PLAYERS_TO_START_GAME) {
        // Route to game room full page
        response.sendFile(__dirname + "/views/gameRoomFull.html");
    } else {
        // Show INTRO screen and allow player to joing the game room.
        response.sendFile(__dirname + "/views/intro.html");
    }
});

app.get("/gameplay", (request, response) => {
    // Root to rules
    response.sendFile(__dirname + "/views/index.html");
});

app.get("/winner", (request, response) => {
    // Root to winner page
    response.sendFile(__dirname + "/views/winner.html");
});

app.get("/playagain", (request, response) => {
    // Root to play again page
    response.sendFile(__dirname + "/views/playagain.html");
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

realtime.connection.once("connected", () => {
    gameRoom = realtime.channels.get("game-room");
    gameRoom.presence.subscribe("enter", (player) => {
        let newPlayerId;
        totalPlayers++;

        newPlayerId = player.clientId;
        playerChannels[newPlayerId] = realtime.channels.get(
            "clientChannel-" + player.clientId
        );

        let newPlayerObject = {
            id: newPlayerId,
            //   invaderAvatarType: avatarTypes[randomAvatarSelector()],
            //   invaderAvatarColor: avatarColors[randomAvatarSelector()],
            points: 0,
            name: player.name,
        };
        players[newPlayerId] = newPlayerObject;

        if (
            totalPlayers >= MIN_PLAYERS_TO_START_GAME &&
            totalPlayers <= MAX_PLAYERS_TO_START_GAME
        ) {
            // TODO button for starting game is "clickable" present.
        }
        subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId);
    });
    gameRoom.presence.subscribe("leave", (player) => {
        let leavingPlayer = player.clientId;
        totalPlayers--;
        delete players[leavingPlayer];
        if (totalPlayers <= 0) {
            // Allow a new game to begin
            resetGame();
        }
    });
});

function subscribeToPlayerInput(channelInstance, playerId) {
    channelInstance.subscribe("play", (msg) => {
        if (msg.data.keyPressed == "return") {
            // TODO handle return KEY
        }
        // TODO handle other player events
        // Play a card
        // Bet
    });
}

function startRound(numCards) {
    // TODO Deal correct number of cards to each player.
    // Initiate betting
}

function startBetting() {
    // TODO logic for betting
}

function endRound() {
    // TODO logic for end of round
    // Assign points
}

function finishGame(playerId) {
    let orderedPlayers = new Array();
    for (let item in players) {
        orderedPlayers.push({
            name: players[item].name,
            points: players[item].points,
        });
    }

    orderedPlayers.sort((a, b) => {
        return b.points - a.points;
    });
    let winnerName = orderedPlayers[0].name;
    let winnerPoints = orderedPlayers[0].points;

    gameRoom.publish("game-over", {
        winner: winnerName,
        points: winnerPoints,
        players: orderedPlayers,
    });
}

function resetGame() {
    peopleAccessingTheWebsite = 0;
    totalPlayers = 0;
    for (let item in playerChannels) {
        playerChannels[item].unsubscribe();
    }
}
