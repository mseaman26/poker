const position0 = { top: '80%', left:  '50%'};
const position1 = { top: '80%', left:  '15%'};
const position2 = { top: '50%', left:  '11%'};
const position3 = { top: '10%', left:  '15%'};
const position4 = { top: '7%', left:  '50%'};
const position5 = { top: '10%', left:  '85%'};
const position6 = { top: '50%', left:  '90%'};
const position7 = { top: '80%', left:  '85%'};

const chipPosition0 = { top: '-70%', left:  '25%'};
const chipPosition1 = { top: '-80%', left:  '115%'};
const chipPosition2 = { top: '50%', left:  '125%', transform: 'translateY(-50%)'};
const chipPosition3 = { top: '110%', left:  '115%'};
const chipPosition4 = { top: '130%', left:  '25%'};
const chipPosition5 = { top: '110%', left:  '-20%'};
const chipPosition6 = { top: '50%', left:  '-60%', transform: 'translateY(-50%)'};
const chipPosition7 = { top: '-80%', left:  '-20%'};




export const playerPositions = {

    2: [position0, position4],
    3: [position0, position3, position5],
    4: [position0, position2, position4, position6],
    5: [position0, position1, position3, position5, position7],
    6: [position0, position1, position3, position4, position5, position7],
}
export const chipPositions = {
    2: [chipPosition0, chipPosition4],
    3: [chipPosition0, chipPosition3, chipPosition5],
    4: [chipPosition0, position2, position4, position6],
    5: [chipPosition0, position1, position3, position5, position7],
    6: [chipPosition0, position1, position3, position4, position5, position7],
}