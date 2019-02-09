var gs = require("./test")


function ourPosition(gameState) {
  const { dealer, players, in_action } = gameState;
  let dealerPlayer = (dealer+1)%(players.length);
  let pos = (6 + (in_action - dealer)) % 6;
  let position = "E";
  if (pos === 1 || pos === 2) {
      position = "L";
  } else if (pos === 5 || pos === 0) {
      position = "M";
  } else {
      position = "E"
  }
  return position;
}


function decision(group, )

console.log("kaki");
console.log(ourPosition(gs));