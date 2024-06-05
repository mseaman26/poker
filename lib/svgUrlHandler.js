import twoOfClubs from '../app/assets/cardSVGs/fronts/clubs_2.svg'
import twoOfHearts from '../app/assets/cardSVGs/fronts/hearts_2.svg'
import twoOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_2.svg'
import twoOfSpades from '../app/assets/cardSVGs/fronts/spades_2.svg'
import threeOfClubs from '../app/assets/cardSVGs/fronts/clubs_3.svg'
import threeOfHearts from '../app/assets/cardSVGs/fronts/hearts_3.svg'
import threeOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_3.svg'
import threeOfSpades from '../app/assets/cardSVGs/fronts/spades_3.svg'
import fourOfClubs from '../app/assets/cardSVGs/fronts/clubs_4.svg'
import fourOfHearts from '../app/assets/cardSVGs/fronts/hearts_4.svg'
import fourOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_4.svg'
import fourOfSpades from '../app/assets/cardSVGs/fronts/spades_4.svg'
import fiveOfClubs from '../app/assets/cardSVGs/fronts/clubs_5.svg'
import fiveOfHearts from '../app/assets/cardSVGs/fronts/hearts_5.svg'
import fiveOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_5.svg'
import fiveOfSpades from '../app/assets/cardSVGs/fronts/spades_5.svg'
import sixOfClubs from '../app/assets/cardSVGs/fronts/clubs_6.svg'
import sixOfHearts from '../app/assets/cardSVGs/fronts/hearts_6.svg'
import sixOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_6.svg'
import sixOfSpades from '../app/assets/cardSVGs/fronts/spades_6.svg'
import sevenOfClubs from '../app/assets/cardSVGs/fronts/clubs_7.svg'
import sevenOfHearts from '../app/assets/cardSVGs/fronts/hearts_7.svg'
import sevenOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_7.svg'
import sevenOfSpades from '../app/assets/cardSVGs/fronts/spades_7.svg'
import eightOfClubs from '../app/assets/cardSVGs/fronts/clubs_8.svg'
import eightOfHearts from '../app/assets/cardSVGs/fronts/hearts_8.svg'
import eightOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_8.svg'
import eightOfSpades from '../app/assets/cardSVGs/fronts/spades_8.svg'
import nineOfClubs from '../app/assets/cardSVGs/fronts/clubs_9.svg'
import nineOfHearts from '../app/assets/cardSVGs/fronts/hearts_9.svg'
import nineOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_9.svg'
import nineOfSpades from '../app/assets/cardSVGs/fronts/spades_9.svg'
import tenOfClubs from '../app/assets/cardSVGs/fronts/clubs_10.svg'
import tenOfHearts from '../app/assets/cardSVGs/fronts/hearts_10.svg'
import tenOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_10.svg'
import tenOfSpades from '../app/assets/cardSVGs/fronts/spades_10.svg'
import jackOfClubs from '../app/assets/cardSVGs/fronts/clubs_jack.svg'
import jackOfHearts from '../app/assets/cardSVGs/fronts/hearts_jack.svg'
import jackOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_jack.svg'
import jackOfSpades from '../app/assets/cardSVGs/fronts/spades_jack.svg'
import queenOfClubs from '../app/assets/cardSVGs/fronts/clubs_queen.svg'
import queenOfHearts from '../app/assets/cardSVGs/fronts/hearts_queen.svg'
import queenOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_queen.svg'
import queenOfSpades from '../app/assets/cardSVGs/fronts/spades_queen.svg'
import kingOfClubs from '../app/assets/cardSVGs/fronts/clubs_king.svg'
import kingOfHearts from '../app/assets/cardSVGs/fronts/hearts_king.svg'
import kingOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_king.svg'
import kingOfSpades from '../app/assets/cardSVGs/fronts/spades_king.svg'
import aceOfClubs from '../app/assets/cardSVGs/fronts/clubs_ace.svg'
import aceOfHearts from '../app/assets/cardSVGs/fronts/hearts_ace.svg'
import aceOfDiamonds from '../app/assets/cardSVGs/fronts/diamonds_ace.svg'
import aceOfSpades from '../app/assets/cardSVGs/fronts/spades_ace.svg'



const svgURLsObj = {
    2: {clubs: twoOfClubs,
        hearts: twoOfHearts,
        diamonds: twoOfDiamonds,
        spades: twoOfSpades},
    3: {clubs: threeOfClubs,
        hearts: threeOfHearts,
        diamonds: threeOfDiamonds,
        spades: threeOfSpades},
    4: {clubs: fourOfClubs,
        hearts: fourOfHearts,
        diamonds: fourOfDiamonds,
        spades: fourOfSpades},
    5: {clubs: fiveOfClubs,
        hearts: fiveOfHearts,
        diamonds: fiveOfDiamonds,
        spades: fiveOfSpades},
    6: {clubs: sixOfClubs, 
        hearts: sixOfHearts,
        diamonds: sixOfDiamonds,
        spades: sixOfSpades},
    7: {clubs: sevenOfClubs,
        hearts: sevenOfHearts,
        diamonds: sevenOfDiamonds,
        spades: sevenOfSpades},
    8: {clubs: eightOfClubs,
        hearts: eightOfHearts,
        diamonds: eightOfDiamonds,
        spades: eightOfSpades},
    9: {clubs: nineOfClubs,
        hearts: nineOfHearts,
        diamonds: nineOfDiamonds,
        spades: nineOfSpades},
    10: {clubs: tenOfClubs,
        hearts: tenOfHearts,
        diamonds: tenOfDiamonds,
        spades: tenOfSpades},
    11: {clubs: jackOfClubs,
        hearts: jackOfHearts,
        diamonds: jackOfDiamonds,
        spades: jackOfSpades},
    12: {clubs: queenOfClubs,
        hearts: queenOfHearts,
        diamonds: queenOfDiamonds,
        spades: queenOfSpades},
    13: {clubs: kingOfClubs,
         hearts: kingOfHearts,
         diamonds: kingOfDiamonds,
         spades: kingOfSpades},
    14: {clubs: aceOfClubs,
        hearts: aceOfHearts,
        diamonds: aceOfDiamonds,
        spades: aceOfSpades},    

}
export const svgUrlHandler = (card)=> {
    if(card){
        return svgURLsObj[card?.value][card?.suit]
    }
    
}

