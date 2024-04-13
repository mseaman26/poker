

const position0 = { top: '75%', left:  '57%', transform: 'translateX(-50%)'};
const position1 = { top: '93%', left:  '18%',};
const position2 = { top: '58%', left:  '4%'};
const position3 = { top: '10%', left:  '18%'};
const position4 = { top: '10%', left:  '48%'};
const position5 = { top: '10%', left:  '90%'};
const position6 = { top: '58%', left:  '104%'};
const position7 = { top: '93%', left:  '91%', };

const chipPosition0 = { top: '-130%', left:  '65%', transform: 'translateX(-50%)'};
const chipPosition1 = { top: '-90%', left:  '135%'};
const chipPosition2 = { top: '40%', left:  '250%'};
const chipPosition3 = { top: '170%', left:  '135%'};
const chipPosition4 = { top: '170%', left:  '85%'};
const chipPosition5 = { top: '170%', left:  '-60%'};
const chipPosition6 = { top: '40%', left:  '-180%',};
const chipPosition7 = { top: '-90%', left:  '-60%'};

const cardPostion0 = {left: '-1500%', top: '-500%'}
const cardPostion1 = {top: '-35%', left: '70%'   }
const cardPostion2 = {top: '-35%', left: '70%' }
const cardPostion3 = {top: '-35%', left: '70%'}
const cardPostion4 = {top: '-35%', left: '70%' }
const cardPostion5 = {top: '-35%', left: '-180%' }
const cardPostion6 = {top: '-35%', left: '-170%' }
const cardPostion7 = {top: '-35%', left: '-160%' }

export const playerPositions = {

    2: [position0, position4],
    3: [position0, position1, position7],
    4: [position0, position1, position2, position3],
    5: [position0, position1, position3, position5, position7],
    6: [position0, position1, position3, position4, position5, position7],
    7: [position0, position1, position3, position4, position5, position6, position7],
    8: [position0, position1, position2, position3, position4, position5, position6, position7],
}
export const chipPositions = {
    2: [chipPosition0, chipPosition4],
    3: [chipPosition0, chipPosition1, chipPosition7],
    4: [chipPosition0, chipPosition1, chipPosition2, chipPosition3],
    5: [chipPosition0, chipPosition1, chipPosition3, chipPosition5, chipPosition7],
    6: [chipPosition0, chipPosition1, chipPosition3, chipPosition4, chipPosition5, chipPosition7],
    7: [chipPosition0, chipPosition1, chipPosition3, chipPosition4, chipPosition5, chipPosition6, chipPosition7],
    8: [chipPosition0, chipPosition1, chipPosition2, chipPosition3, chipPosition4, chipPosition5, chipPosition6, chipPosition7],
}
export const cardPositions = {
    2: [cardPostion0, cardPostion4],
    3: [cardPostion0, cardPostion1, cardPostion7],
    4: [cardPostion0, cardPostion1, cardPostion2, cardPostion3],
    5: [cardPostion0, cardPostion1, cardPostion3, cardPostion5, cardPostion7],
    6: [cardPostion0, cardPostion1, cardPostion3, cardPostion4, cardPostion5, cardPostion7],
    7: [cardPostion0, cardPostion1, cardPostion3, cardPostion4, cardPostion5, cardPostion6, cardPostion7],
    8: [cardPostion0, cardPostion1, cardPostion2, cardPostion3, cardPostion4, cardPostion5, cardPostion6, cardPostion7],
}