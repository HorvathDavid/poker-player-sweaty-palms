
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

function whichGroup(cards) {

  // "hole_cards": [                         // The cards of the player. This is only visible for your own player
  //   //     except after showdown, when cards revealed are also included.
  //   {
  //     "rank": "6",                    // Rank of the card. Possible values are numbers 2-10 and J,Q,K,A
  //     "suit": "hearts"                // Suit of the card. Possible values are: clubs,spades,hearts,diamonds
  //   },
  //   {
  //     "rank": "K",
  //     "suit": "spades"
  //   }
  // ]

  const ourCards = cards.map(c => c.rank);

  let group = 0;

  const g1 = {
    norm: [
      ['A', 'A'],
      ['K', 'K'],
      ['Q', 'Q'],
      ['J', 'J']
    ],
    suited: [['A', 'K']]
  };

  const g2 = {
    norm: [
      ['10', '10'],
      ['A', 'K']
    ],
    suited: [
      ['A', 'Q'],
      ['A', 'J'],
      ['Q', 'K']
    ]
  };

  const g3 = {
    norm: [
      ['9', '9'],
      ['A', 'Q']
    ],
    suited: [
      ['J', '10'],
      ['Q', 'J'],
      ['K', 'J'],
      ['A', '10']
    ]
  };

  const g4 = {
    norm: [
      ['K', 'Q'],
      ['8', '8'],
      ['K', '10'],
      ['J', 'A'],
      ['J', 'A']
    ],
    suited: [
      ['10', '9'],
      ['K', '10'],
      ['9', '8'],
      ['J', '9'],
    ]
  };

  if (ourCards) {
    // check g1
    for (const pairs of g1.norm) {
      if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
        group = 1;
        return group;
      }
    }

    // check g2
    for (const pairs of g2.norm) {
      if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
        group = 2;
        return group;
      }
    }

    // check g3
    for (const pairs of g3.norm) {
      if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
        group = 3;
        return group;
      }
    }

    // check g4
    for (const pairs of g4.norm) {
      if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
        group = 4;
        return group;
      }
    }
  }

  return group;
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

    const player = getOwnPlayer(gameState);
    const ourCards = player.hole_cards;
    const allCards = getAllCards(player, gameState);
    const _isPair = isPair(gameState, player);

    const tempCards = ['10', 'J', 'Q', 'K', 'A'];

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
