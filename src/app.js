const express = require('express');
const bodyParser = require('body-parser');
const app = express();  // API server
const port = 5000;

// Configuring body parser middleware
app.use(bodyParser.json());

// Number of wins for both sides
const results = {
  player: 0,
  computer: 0,
};

// AI counter to track player move frequency
const counter = {
  rock: 0,
  paper: 0,
  scissors: 0,
};

let aiPlay = "";

/* Purpose: Get AI's next round based on player's history */
function getAiPlay() {
  let max = getRandomMove();  // randomly generate first move
  let r = counter.rock, p = counter.paper, s = counter.scissors;

  //console.log(`r: ${r}, p: ${p}, s: ${s}`);

  // find most frequent player move
  if (!((r === p) && (p === s))) {
    if (r > p) {
      max = "rock";
    } else {
      max = "paper";
    }
    if ((s > r) && (s > p)) {
      max = "scissors";
    }
  }

  //console.log(`max: ${max}`);

  // respond to most frequent player move
  if (max === "rock") {
    return "paper";
  } else if (max === "paper") {
    return "scissors";
  } else {
    return "rock"
  }
}

/* Purpose: check both moves and determine outcome of the round */
function checkPlay(player, ai) {
  // check if tie
  if (player === ai) {
    return "tie";
  } else if (player === "rock") {
    counter.rock++;
    if (ai === "paper") {
      return "lose";
    } else {
      return "win";
    }
  } else if (player === "paper") {
    counter.paper++;
    if (ai === "rock") {
      return "win";
    } else {
      return "lose";
    }
  } else {  // myPlay: "scissors"
    counter.scissors++;
    if (ai === "rock") {
      return "lose";
    } else {
      return "win";
    }
  }
}

/* Purpose: get random move for AI to play */
function getRandomMove() {
  let plays = ["rock", "paper", "scissors"];
  let random = Math.floor(Math.random() * 3); // get random value between 0 and 2
  return plays[random];
}

/* Purpose: Middleware to validate player input */
const validateInput = function (req, res, next) {
  if ((req.body.myHand === "rock") || (req.body.myHand === "paper") || (req.body.myHand === "scissors")) {
    next();
  } else {
    res.status(400).send(`Incorrect input. Valid inputs: "rock", "paper", or "scissors".`);
  }
};

/* /results: return the number of wins each the player and computer have. */
app.get('/results', (req, res) => {
  res.json(results);
});

/* /reset: AI starts the game, and prompts user to user /play to respond with player move. */
app.get('/reset', (req, res) => {
  aiPlay = getAiPlay();

  // reset results ?
  //results.player = 0;
  //results.computer = 0;

  let message = `AI has started a new game. Use /play endpoint to respond with your move.`;
  res.send(message);
});

// Calling ValidateInput middleware to continue to /play endpoint
app.use(validateInput);

/* /play: Get both user and ai plays, evaluate winner and return results to player. */
app.post('/play', (req, res) => {
  let myPlay = req.body.myHand;
  if (aiPlay === "") aiPlay = getAiPlay();
  let result = checkPlay(myPlay, aiPlay);
  let message = `you played ${myPlay}, I played ${aiPlay}, you ${result}`;

  //console.log(`message: ${message}`);

  if (result === "win") {
    results.player++;
    res.status(201).send(message);
  } else if (result === "lose") {
    results.computer++;
    // 204 means No Content needs to be sent back, so any message included will not be displayed.
    res.status(204).send();
  } else {
    res.status(418).send(message);
  }

  // reset aiPlay to empty
  aiPlay = "";
});

app.listen(port, () => {
  console.log(`RPS API listening on port ${port}`);
});

