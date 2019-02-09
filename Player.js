const _ = require('lodash');

function numberOfFolds(gameState) {
  const { players, in_action } = gameState;

  return players.filter(e => e.status === 'folded' && in_action !== e.id).length;
}

function numberOfBetOnOtherPlayers(gameState) {
  const { players, in_action, small_blind } = gameState;

  return players.filter(e => e.bet > (2 * small_blind) && in_action !== e.id).length;
}

function ourPosition(gameState) {
  const { dealer, players, in_action } = gameState;

  const playerIndexesAbs = players.filter(p => p.status !== 'out').map(p => p.id);

  let pos = (playerIndexesAbs.length + (playerIndexesAbs.indexOf(in_action) - playerIndexesAbs.indexOf(dealer))) % playerIndexesAbs.length;

  let position = "E";

  if (playerIndexesAbs.length === 6) {
    if (pos === 1 || pos === 2) {
      position = "L";
    } else if (pos === 3 || pos === 4) {
      position = "E";
    } else {
      position = "M";
    }
  } else if (playerIndexesAbs.length === 5) {
    if (pos === 1 || pos === 2) {
      position = "L";
    } else if (pos === 3 || pos === 4) {
      position = "E";
    } else {
      position = "M";
    }
  } else if (playerIndexesAbs.length === 4) {
    if (pos === 1 || pos === 2) {
      position = "L";
    } else if (pos === 3) {
      position = "E";
    } else {
      position = "M";
    }
  } else if (playerIndexesAbs.length === 3) {
    if (pos === 2) {
      position = "L";
    } else if (pos === 0) {
      position = "E";
    } else {
      position = "M";
    }
  } else if (playerIndexesAbs.length === 2) {
    position = "E";
  }



  // console.log('position', pos)
  return position;
}

function decision(group, pos, nOfBets) {
  let raiseMultiplier = 1;
  let action = "fold";
  if (group > 4) {
    action = "fold";
  } else if (group === 0) {
    action = "fold";
  } else {
    if (pos === "E") {
      if (group === 1 || group === 2) {
        action = "raise";
        raiseMultiplier = 3;
      } else {
        action = "raise";
        raiseMultiplier = 1;
      }
    } else if (pos === "M") {
      if (nOfBets === 0) {
        if (group === 1 || group === 2) {
          action = "raise";
          raiseMultiplier = 3;
        } else {
          action = "raise";
          raiseMultiplier = 1;
        }
      } else if (nOfBets === 1) {
        if (group === 1 || group === 2) {
          action = "raise";
          raiseMultiplier = 3;
        } else {
          action = "fold";
          raiseMultiplier = 1;
        }
      } else {
        action = "fold";
      }
    } else {
      if (group === 1 || group === 2) {
        action = "raise";
        raiseMultiplier = 3;
      } else {
        action = "raise";
        raiseMultiplier = 1;
      }
    }
  }
  return { action, raiseMultiplier };
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

function suited(cards) {
  return cards[0].suit === cards[1].suit;
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
  const isSuited = suited(cards);
  const ourCards = cards.map(c => c.rank);

  let group = 0;

  const g1 = {
    norm: [
      ['A', 'A'],
      ['K', 'K'],
      ['Q', 'Q'],
      ['J', 'J']
    ],
    suited: [
      ['A', 'K']
    ]
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

  const g5 = {
    norm: [],
    suited: []
  };

  if (ourCards) {

    // suited cards list test
    if (isSuited) {
      // check g1
      for (const pairs of g1.suited) {
        if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
          group = 1;
          return group;
        }
      }

      // check g2
      for (const pairs of g2.suited) {
        if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
          group = 2;
          return group;
        }
      }

      // check g3
      for (const pairs of g3.suited) {
        if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
          group = 3;
          return group;
        }
      }

      // check g4
      for (const pairs of g4.suited) {
        if (JSON.stringify(pairs.sort()) === JSON.stringify(ourCards.sort())) {
          group = 4;
          return group;
        }
      }
    }

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
    return '0.3';
  }

  static betRequest(gameState, betCallback) {
    // Init
    const {
      current_buy_in,
      small_blind,
      minimum_raise,
      pot,
    } = gameState;

    let betValue = 0;

    const player = getOwnPlayer(gameState);
    const ourCards = player.hole_cards;
    const allCards = getAllCards(player, gameState);
    const _isPair = isPair(gameState, player);

    if (allCards.length > 2) {
      // 2 pair
      // 3 egyforma
      const grouped = _.groupBy(allCards, function (o) {
        return o.rank;
      });
      
      let maxOfSame = 0;
      for (const key of Object.keys(grouped)) {
        if (grouped[key].length > maxOfSame) { 
          maxOfSame = grouped[key].length;
        }
      }
      
      // console.log(maxOfSame)
      

      if (maxOfSame > 2) {
        betValue = player.stack;
        // console.log('same cards:', maxOfSame)
        // console.log('betValue', betValue);
        return betCallback(Math.floor(betValue));
      }
    }

    // console.log('no same cards');

    const group = whichGroup(ourCards);
    const ourPos = ourPosition(gameState);


    const tempCards = ['10', 'J', 'Q', 'K', 'A'];

    const numberOfBets = numberOfBetOnOtherPlayers(gameState);
    const { action: act, raiseMultiplier: rm } = decision(group, ourPos, numberOfBets);

    // console.log('numberOfBets', numberOfBets);
    // console.log('ourPos', ourPos);
    // console.log('group', group);
    // console.log(act, rm);
    // console.log('ourPos', ourPos);

    try {

      if (act === "raise") {
        betValue = current_buy_in - player.bet + rm * minimum_raise;
        // Ha betValue > pot/2, akkor fold - nem adjuk meg az all-int
        if (betValue > player.stack / 2) {
          if (group !== 1) {
            betValue = 0;
          }
        }
      }
      // if (tempCards.includes(ourCards[0].rank) && tempCards.includes(ourCards[1].rank)) {
      //   betValue = current_buy_in - player.bet + minimum_raise;
      // }

      // if (_isPair) {
      //   betValue = current_buy_in - player.bet + minimum_raise;
      // }

    } catch (error) {
      console.log(error);
    }

    betCallback(Math.floor(betValue));
  }

  static showdown(gameState) {

  }
}

module.exports = Player;
