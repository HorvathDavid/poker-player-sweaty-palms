
function isPair(gameState) {
  const id = gameState.in_action;


  const { hole_cards } = player;

  const [card1, card2] = hole_cards;

  return card1.rank === card2.rank;
}

function getOwnPlayer(gameState) {
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

    let tempCards = ['10', 'J', 'Q', 'K', 'A'];
    const player = getOwnPlayer(gameState);

    const allCards = getAllCards(player, gameState);

    const callValue = callValue(player, current_buy_in);
    const _isPair = isPair(gameState);


    if (tempCards.includes(ourCards[0].rank) && tempCards.includes(ourCards[1].rank)) {
      let betzor = current_buy_in - players.find(obj => obj.id == ourID).bet + minimum_raise;
      return betCallback(Math.floor(betzor));
    }

    let betValue = 0;


    if (_isPair) {
      let betzor = current_buy_in - players.find(obj => obj.id == ourID).bet + minimum_raise;
      return betCallback(Math.floor(betzor));
    }

    betCallback(betValue);
  }

  static showdown(gameState) {

  }
}

module.exports = Player;
