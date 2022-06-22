import { throwExpression } from "./util";
import { Cell, TIME, PLAYER, CELLMAP, timeToLight } from "./world";

export function updateDisplay() {
    for (let cellY = 0; cellY < 33; cellY++) { // (screen length)
        for (let cellX = 0; cellX < 33; cellX++) { // (screen length)
            displayCell(`${cellX},${cellY}`, `${cellX - 16 + PLAYER.x},${cellY - 16 + PLAYER.y}`);
        }
    }
}

function displayCell(displayElementCoords: string, cellCoords: string) {
    // console.log(`displayCell: ${displayElementCoords},${cellCoords}`);
    let displayElement = DISPLAYELEMENTSDICT[displayElementCoords] ?? throwExpression(`invalid display coords ${displayElementCoords}`);
    let itemsElement = ITEMSELEMENTSDICT[displayElementCoords] ?? throwExpression(`invalid item element coords ${displayElementCoords}`);
    let lightElement = LIGHTELEMENTSDICT[displayElementCoords] ?? throwExpression(`invalid light element coords ${displayElementCoords}`);
    let cell = CELLMAP[cellCoords] ?? throwExpression(`invalid cell coords ${cellCoords}`);

    let itemsDisplay = "";
    displayElement.innerHTML = "";
    // this sux ! Object.values sucks, make my own thing with types
    for (let item of cell.inventory.itemsArray(1)) {
            // console.log(item.symbol)
            itemsDisplay += item.symbol;
        }

    if (cell.mobs.length > 0) {
        const symbol = cell.mobs.at(-1)?.symbol
        if (symbol) {
            displayElement.innerHTML = symbol;
        }
    }

    if (cell.terrain[0]) {
        displayElement.innerHTML = cell.terrain[0].symbol;
    }

    itemsElement.innerHTML = itemsDisplay;

    // under the current system, ambient light is purely cosmetic for the player
    // in the future, npc's will be beholden to light level and what they can "see" to be able to do stuff
    // this will require reworking the whole lighting system to use rays
    // for now this "works" though
    let lightElementColourAmbient = cell.lightLevel + timeToLight(TIME);

    if (lightElementColourAmbient < 0) {
        lightElementColourAmbient = 0;
    }

    if (lightElementColourAmbient > 255) {
        lightElementColourAmbient = 255;
    }

    lightElement.style.mixBlendMode = "multiply";
    lightElement.style.backgroundColor = `RGB(${lightElementColourAmbient},${lightElementColourAmbient},${lightElementColourAmbient}`;

    displayElement.style.backgroundColor = `RGB(${cell.color})` // band aid
}

export let DISPLAYELEMENTSDICT: { [key: string]: HTMLElement} = {};
export let LIGHTELEMENTSDICT: { [key: string]: HTMLElement} = {};
export let ITEMSELEMENTSDICT: { [key: string]: HTMLElement} = {};