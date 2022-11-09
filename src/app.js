const express = require('express');
const bodyParser = require('body-parser');
const app = express();  // API server
const port = 5000;

// Configuring body parser middleware
app.use(bodyParser.json());

// number of wins
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

function getAiPlay() {
  let max = "rock";
  let r = counter.rock, p = counter.paper, s = counter.scissors;

  console.log(`r: ${r}, p: ${p}, s: ${s}`);

  // find most frequent player move
  if (r > p) {
    max = "rock";
  } else {
    max = "paper";
  }
  if ((s > r) && (s > p)) {
    max = "scissors";
  }

  console.log(`max: ${max}`);

  // respond to most frequent player move
  if (max === "rock") {
    return "paper";
  } else if (max === "paper") {
    return "scissors";
  } else {
    return "rock"
  }
}

function checkPlay(player, ai) {
  switch (player) {
    case "rock":
      counter.rock++;
      if (ai === "rock") {
        return "tie";
      } else if (ai === "paper") {
        return "lose";
      } else if (ai === "scissors") {
        return "win";
      }
    case "paper":
      counter.paper++;
      if (ai === "rock") {
        return "win";
      } else if (ai === "paper") {
        return "tie";
      } else if (ai === "scissors") {
        return "lose";
      }
    case "scissors":
      counter.scissors++;
      if (ai === "rock") {
        return "lose";
      } else if (ai === "paper") {
        return "win";
      } else if (ai === "scissors") {
        return "tie";
      }
    default:
      return "lose";
  }
}

// validate input middleware
const validateInput = function (req, res, next) {
  if ((req.body.myHand === "rock") || (req.body.myHand === "paper") || (req.body.myHand === "scissors")) {
    next();
  } else {
    res.status(400).send("Incorrect input. Please play again.");
  }
};

app.get('/results', (req, res) => {
  console.log(`computer results: ${results.computer}`);
  res.json(results)
});

app.get('/reset', (req, res) => {
  let aiPlay = getAiPlay();
  let message = "New game started.";
  res.send(message);
});

app.use(validateInput);

app.post('/play', (req, res) => {
  let myPlay = req.body.myHand;
  let aiPlay = getAiPlay();
  let result = checkPlay(myPlay, aiPlay);
  let message = `you played ${myPlay}, I played ${aiPlay}, you ${result}`;

  if (result == "win") {
    results.player++;
    res.status(201).send(message);
  } else if (result == "lose") {
    results.computer++;
    // 204 means No Content needs to be sent back, so any message included will not be displayed.
    res.status(204).send();
  } else {
    res.status(418).send(message);
  }
});

app.listen(port, () => {
  console.log(`RPS API listening on port ${port}`);
});

