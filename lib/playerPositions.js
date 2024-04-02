const position0 = { top: '85%', left:  '50%'};
const position1 = { top: '85%', left:  '15%'};
const position2 = { top: '50%', left:  '5%'};
const position3 = { top: '10%', left:  '15%'};
const position4 = { top: '10%', left:  '50%'};
const position5 = { top: '10%', left:  '85%'};
const position6 = { top: '50%', left:  '95%'};
const position7 = { top: '85%', left:  '85%'};

const chipPosition0 = { top: '-200%', left:  '15%'};
const chipPosition1 = { top: '50%', left:  '95%'};
const chipPosition2 = { top: '50%', left:  '5%'};
const chipPosition3 = { top: '110%', left:  '70%'};
const chipPosition4 = { top: '10%', left:  '50%'};
const chipPosition5 = { top: '110%', left:  '-20%'};




export const playerPositions = {

    2: [position0, position4],
    3: [position0, position3, position5],
    4: [position0, position2, position4, position6],
    5: [position0, position1, position3, position5, position7],
    6: [position0, position1, position3, position4, position5, position7],
}
export const chipPositions = {
    2: [chipPosition0, chipPosition2],
    3: [chipPosition0, chipPosition3, chipPosition5],
    4: [chipPosition0, position2, position4, position6],
    5: [chipPosition0, position1, position3, position5, position7],
    6: [chipPosition0, position1, position3, position4, position5, position7],
}