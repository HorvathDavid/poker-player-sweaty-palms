
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

    // const g3 = ['10', '10']
    // const g3 = ['A', 'Q'] // suited
    // const g3 = ['A', 'J']  // suited
    // const g3 = ['Q', 'K'] // suited
    // const g3 = ['A', 'K']

    const player = getOwnPlayer(gameState);

    try {

    const allCards = getAllCards(player, gameState);
    const callValue = callValue(player, current_buy_in);
    const _isPair = isPair(gameState);

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
