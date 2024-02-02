class Card{
    constructor(rank, suit){
        this.rank = rank
        this.suit = suit
    }
}

class Player{
    constructor(name, chips, cards){
        this.name = name
        this.chips = chips
        this.cards = cards
    }
}

class Game{
    constructor(players, startAmount, lowBlinds){
        this.players = players
        this.startAmount = startAmount
        this.lowBlinds = lowBlinds
    }
}