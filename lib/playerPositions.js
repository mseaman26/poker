import { left } from "inquirer/lib/utils/readline";

const position0 = { top: '72%', left:  '50%'};
const position1 = { top: '94%', left:  '13%'};
const position2 = { top: '50%', left:  '4%'};
const position3 = { top: '10%', left:  '13%'};
const position4 = { top: '7%', left:  '43%'};
const position5 = { top: '10%', left:  '88%'};
const position6 = { top: '50%', left:  '95%'};
const position7 = { top: '87%', left:  '87%', transform: 'translateX(-100%)'};

const chipPosition0 = { top: '-70%', left:  '65%', transform: 'translateX(-50%)'};
const chipPosition1 = { top: '-147%', left:  '105%'};
const chipPosition2 = { top: '60%', left:  '230%', transform: 'translateY(-50%)'};
const chipPosition3 = { top: '180%', left:  '105%'};
const chipPosition4 = { top: '120%', left:  '85%'};
const chipPosition5 = { top: '180%', left:  '-60%'};
const chipPosition6 = { top: '60%', left:  '-160%', transform: 'translateY(-50%)'};
const chipPosition7 = { top: '-147%', left:  '0%'};

const cardPostion0 = {left: '-100%'}
const cardPostion1 = {top: '-170%', left: '100%'   }
const cardPostion2 = {top: '-120%', left: '100%' }
const cardPostion3 = {top: '-60%', left: '100%'}
const cardPostion4 = {top: '-120%', left: '110%' }
const cardPostion5 = {top: '-60%', left: '-100%' }
const cardPostion6 = {top: '-120%', left: '-100%' }
const cardPostion7 = {top: '-170%', left: '-100%' }

export const playerPositions = {

    2: [position0, position4],
    3: [position0, position3, position5],
    4: [position0, position1, position2, position3],
    5: [position0, position1, position3, position5, position7],
    6: [position0, position1, position3, position4, position5, position7],
    7: [position0, position1, position3, position4, position5, position6, position7],
    8: [position0, position1, position2, position3, position4, position5, position6, position7],
}
export const chipPositions = {
    2: [chipPosition0, chipPosition4],
    3: [chipPosition0, chipPosition3, chipPosition5],
    4: [chipPosition0, chipPosition1, chipPosition2, chipPosition3],
    5: [chipPosition0, chipPosition1, chipPosition3, chipPosition5, chipPosition7],
    6: [chipPosition0, chipPosition1, chipPosition3, chipPosition4, chipPosition5, chipPosition7],
    7: [chipPosition0, chipPosition1, chipPosition3, chipPosition4, chipPosition5, chipPosition6, chipPosition7],
    8: [chipPosition0, chipPosition1, chipPosition2, chipPosition3, chipPosition4, chipPosition5, chipPosition6, chipPosition7],
}
export const cardPositions = {
    2: [cardPostion0, cardPostion4],
    3: [cardPostion0, cardPostion3, cardPostion5],
    4: [cardPostion0, cardPostion1, cardPostion2, cardPostion3],
    5: [cardPostion0, cardPostion1, cardPostion3, cardPostion5, cardPostion7],
    6: [cardPostion0, cardPostion1, cardPostion3, cardPostion4, cardPostion5, cardPostion7],
    7: [cardPostion0, cardPostion1, cardPostion3, cardPostion4, cardPostion5, cardPostion6, cardPostion7],
    8: [cardPostion0, cardPostion1, cardPostion2, cardPostion3, cardPostion4, cardPostion5, cardPostion6, cardPostion7],
}