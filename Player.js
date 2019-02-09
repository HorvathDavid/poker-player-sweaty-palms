
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

function decision(group, pos) {
  let action = "fold";
  if (group > 4) {
      action = "fold";
  } else if (group === 0) {
      action = "fold";
  } else {
      if (pos === "E") {
          if (group === 1 || group === 2) {
              action = "raise"
          } else {
              action = "fold"
          }
      } else if (pos === "M") {
          if (group === 1 || group === 2) {
              action = "raise"
          } else {
              action = "fold"
          }
      } else {
          if (group === 1 || group === 2) {
              action = "raise"
          } else {
              action = "fold"
          }
      }
  }
  return action;
}

function isPair(gameState, player) {
  const id = gameState.in_action;


  const { hole_cards } = player;

  const [card1, card2] = hole_cards;

  return card1.rank === card2.rank;
}

function getOwnPlayer(gameState) {
  const id = gameState.in_action;
  return gameState.players.filter(player => {
    return player.id === id;
  })[0];
}

function getAllCards(player, gameState) {
  const { hole_cards } = player;
  const { community_cards } = gameState;

  return [...hole_cards, ...community_cards];
}

function callValue(player, current_buy_in) {
  return current_buy_in - player['bet'];
}

class Player {

  static get VERSION() {
    return '0.22';
  }

  static betRequest(gameState, betCallback) {
    // Init
    const {
      current_buy_in,
      small_blind,
      minimum_raise,
      pot,
      community_cards
    } = gameState;
    let betValue = 0;

    const tempCards = ['10', 'J', 'Q', 'K', 'A'];

    // const g1 = ['A', 'A']
    // const g1 = ['K', 'K']
    // const g1 = ['Q', 'Q']
    // const g1 = ['J', 'J']
    // const gc1 = ['A', 'K'] // color

    // const g2 = ['10', '10']
    // const g2 = ['A', 'Q'] // suited
    // const g2 = ['A', 'J']  // suited
    // const g2 = ['Q', 'K'] // suited
    // const g2 = ['A', 'K']

    // const g3 = ['9', '9']
    // const g3 = ['J', '10'] // suited
    // const g3 = ['Q', 'J']  // suited
    // const g3 = ['K', 'J'] // suited
    // const g3 = ['A', '10'] // suited
    // const g3 = ['A', 'Q']

    // const g4 = ['10', '9'] // suited
    // const g4 = ['K', 'Q'] 
    // const g4 = ['8', '8'] 
    // const g4 = ['K', '10'] // suited
    // const g4 = ['K', '10']
    // const g4 = ['9', '8'] // suited
    // const g4 = ['J', '9'] //suited
    // const g4 = ['J', 'A'] 
    // const g4 = ['J', 'A'] 



    const player = getOwnPlayer(gameState);
    const ourCards = player.hole_cards;

    const allCards = getAllCards(player, gameState);
    // const callVal = callValue(player, current_buy_in);
    const _isPair = isPair(gameState, player);
    try {
      if (tempCards.includes(ourCards[0].rank) && tempCards.includes(ourCards[1].rank)) {
        betValue = current_buy_in - player.bet + minimum_raise;
      }

      if (_isPair) {
        betValue = current_buy_in - player.bet + minimum_raise;
      }

    } catch (error) {
      console.log(error);
    }

    betCallback(Math.floor(betValue));
  }

  static showdown(gameState) {

  }
}

module.exports = Player;
