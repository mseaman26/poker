

const position0 = { top: '61%', left:  '50%', transform: 'translateX(-50%)'};
const position1 = { top: '72%', left:  '-4.5%',};
const position2 = { top: '45%', left:  '-4.5%'};
const position3 = { top: '13.5%', left:  '8%'};
const position4 = { top: '10%', left:  '43%'};
const position5 = { top: '13.5%', left:  '77%'};
const position6 = { top: '45%', left:  '85%'};
const position7 = { top: '72%', left:  '85%', };

const chipPosition0 = { top: '-18%', left:  '65%', transform: 'translateX(-50%)'};
const chipPosition1 = { top: '0%', left:  '100%'};
const chipPosition2 = { top: '100%', left:  '-.5%'};
const chipPosition3 = { top: '100%', left:  '-.5%'};
const chipPosition4 = { top: '100%', left:  '-.5%'};
const chipPosition5 = { top: '100%', left:  '-.5%'};
const chipPosition6 = { top: '100%', left:  '-.5%',};
const chipPosition7 = { top: '0%', left:  '-100%'};

const cardPostion0 = {left: '0%', top: '0%'}
const cardPostion1 = {top: '-95%', left: '270%'   }
const cardPostion2 = {top: '-95%', left: '75%' }
const cardPostion3 = {top: '-95%', left: '70%'}
const cardPostion4 = {top: '-95%', left: '70%' }
const cardPostion5 = {top: '-95%', left: '70%' }
const cardPostion6 = {top: '-95%', left: '70%' }
const cardPostion7 = {top: '-95%', left: '-120%' }

export const playerPositions = {

    2: [position0, position4],
    3: [position0, position3, position5],
    4: [position0, position2, position4, position6],
    5: [position0, position1, position3, position5, position7],
    6: [position0, position2, position3, position4, position5, position6],
    7: [position0, position1, position3, position4, position5, position6, position7],
    8: [position0, position1, position2, position3, position4, position5, position6, position7],
}
export const chipPositions = {
    2: [chipPosition0, chipPosition4],
    3: [chipPosition0, chipPosition3, chipPosition5],
    4: [chipPosition0, chipPosition2, chipPosition4, chipPosition6],
    5: [chipPosition0, chipPosition1, chipPosition3, chipPosition5, chipPosition7],
    6: [chipPosition0, chipPosition2, chipPosition3, chipPosition4, chipPosition5, chipPosition6],
    7: [chipPosition0, chipPosition1, chipPosition3, chipPosition4, chipPosition5, chipPosition6, chipPosition7],
    8: [chipPosition0, chipPosition1, chipPosition2, chipPosition3, chipPosition4, chipPosition5, chipPosition6, chipPosition7],
}
export const cardPositions = {
    2: [cardPostion0, cardPostion4],
    3: [cardPostion0, cardPostion3, cardPostion5],
    4: [cardPostion0, cardPostion2, cardPostion4, cardPostion6],
    5: [cardPostion0, cardPostion1, cardPostion3, cardPostion5, cardPostion7],
    6: [cardPostion0, cardPostion2, cardPostion3, cardPostion4, cardPostion5, cardPostion6],
    7: [cardPostion0, cardPostion1, cardPostion3, cardPostion4, cardPostion5, cardPostion6, cardPostion7],
    8: [cardPostion0, cardPostion1, cardPostion2, cardPostion3, cardPostion4, cardPostion5, cardPostion6, cardPostion7],
}