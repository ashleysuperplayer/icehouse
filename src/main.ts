import { CtxParentMenu_Cell, CtxParentMenu_Inventory } from "./menu.js";
import { Player, Lex, Cell, Mob, MobKind, Item, TerrainFeature, GroundType, setup, tick } from "./world.js";

declare global {
    var CTX: CtxParentMenu_Cell|CtxParentMenu_Inventory|undefined;

    var DEBUG: boolean;
    var PLAYER: Player;

    var TIME: number;
    var NAVIGATIONELEMENT: HTMLElement;
    var CONTROLSTATE: string;

    var MINSPERDAY: number;
    var TICKSPERMINUTE: number;

    var TICKDURATION: number;
    var TICKSPERDAY: number;

    var CELLMAP: { [key: string]: Cell };
    var MOBSMAP: { [id: string]: Mob };

    var MOBKINDSMAP: { [key: string]: MobKind };
    var ITEMKINDSMAP: { [key: string]: Item};
    var TERRAINFEATUREKINDSMAP: { [key: string]: TerrainFeature};
    var GROUNDTYPEKINDSMAP: { [key: string]: GroundType };
}

function main() {
    let TICKER;

    setGlobals();
    setup(1000, 0, [0,0]);
    TICKER = setInterval(tick, globalThis.TICKDURATION);
}

function setGlobals() {
    globalThis.DEBUG = true;
    globalThis.MINSPERDAY = 1440;
    globalThis.TICKSPERMINUTE = 600;
    globalThis.TICKDURATION = 100;
    globalThis.TICKSPERDAY = 86400;
    globalThis.MOBSMAP = {};
    globalThis.MOBKINDSMAP = {
        "player": {name: "player", symbol: "@"},
        "npctest": {name: "npctest", symbol: "T"}
    }
    globalThis.ITEMKINDSMAP = {
        "oil lamp": {name: "oil lamp", symbol: "o", luminescence: 125, weight: 2700, space: 1, opacity: 0, blocking: false, lex: new Lex("is an oil lamp", ["are ", " oil lamps"])},
        "rock": {name: "rock", symbol: ".", luminescence: 0, weight: 100, space: 0.1, opacity: 0, blocking: false, lex: new Lex("is a rock", ["are ", " rocks"])},
        "chocolate thunder": {name: "chocolate thunder", symbol: "c", luminescence: 0, weight: 10, space: 0.01, opacity: 0, blocking: false, lex: new Lex("is a chocolate thunder", ["are ", " chocolate thunders"])}
    }
    globalThis.TERRAINFEATUREKINDSMAP = {
        "tree": {name: "tree", symbol: "#", luminescence: 0, opacity: 0, blocking: true, lex: new Lex("is a tree")},
    }
    globalThis.GROUNDTYPEKINDSMAP = {
        "mud":  new GroundType("mud", [109, 81, 60], "mudBlend", new Lex("is muddy")),
        "snow": new GroundType("snow", [240, 240, 240], "mudBlend", new Lex("is covered in snow")),
        "clay": new GroundType("clay", [0, 0, 0], "clayBlend", new Lex("is slippery, clay-rich soil"))
    }
    globalThis.CTX = undefined;
}

window.addEventListener("load", (event) => {
    main();
});