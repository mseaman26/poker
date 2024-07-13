export const formatDateFromMongo = (date) => {
    const splitDate = date.split('-')
    const year = splitDate[0]
    const month = splitDate[1]
    const day = splitDate[2].split('T')[0]
    return `${month}/${day}/${year}`
}

export const checkDeck = (game) => {
    const deck = game.deck.deck
    const checkDeck = [...deck]
    for (let i = 0; i < game.players.length; i++) {
        checkDeck.push(...game.players[i].pocket)
    }
    checkDeck.push(...game.flop)
    if(checkDeck.length !== 52) {
        console.log('bad deck length:', checkDeck.length)
        console.log('original deck:', deck)
        // return false
    }
    for (let i = 0; i < checkDeck.length; i++) {
        for (let j = i + 1; j < checkDeck.length; j++) {
            if (checkDeck[i].value === checkDeck[j].value && checkDeck[i].suit === checkDeck[j].suit) {
                console.log('repeated card in deck:', checkDeck[i])
                return false;
            }
        }
    }

    return true;
}

