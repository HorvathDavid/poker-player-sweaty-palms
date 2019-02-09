class Player {
  static get VERSION() {
    return '0.21';
  }

  static betRequest(gameState, bet) {
    // Init
    const {current_buy_in, minimum_raise, players, in_action} = gameState

    let tempCards = ['10', 'J', 'Q', 'K', 'A'];
    let ourID = gameState.in_action;
    let ourCards = players.find(obj => obj.id == ourID).hole_cards;
    
    if (tempCards.includes(ourCards[0].rank) && tempCards.includes(ourCards[1].rank)) {
      let betzor = current_buy_in - players.in_action.bet + minimum_raise;
      bet(Math.floor(betzor));
    }

    bet(0);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
