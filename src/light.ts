import { throwExpression, clamp, perlin3d } from "./util.js";

export class Colour {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number) {
        this.r = clamp(r, 0, 255);
        this.g = clamp(g, 0, 255);
        this.b = clamp(b, 0, 255);
    }

    isZero(): boolean {
        return this.r==0 && this.g==0 && this.b==0;
    }

    static Zero(): Colour{
        return new Colour(0, 0, 0);
    }

    // returns random colour each component independent and between 0 and 1
    static Random(): Colour{
        return new Colour(Math.random(), Math.random(), Math.random());
    }

    static sum(colours: Colour[]): Colour {
        let out = Colour.Zero();
        for (let colour of colours) {
            out = out.add(colour);
        }
        return out;
    }

    mag(): number {
        return (this.r + this.g + this.b) / 3;
    }

    add(c: Colour): Colour {
        return new Colour(
            255*255*(this.r+c.r) / (255*255 + this.r*c.r),
            255*255*(this.g+c.g) / (255*255 + this.g*c.g),
            255*255*(this.b+c.b) / (255*255 + this.b*c.b)
        );
    }

    scalarmult(x: number): Colour {
        return new Colour(this.r*x, this.g*x, this.b*x);
    }

    toString() {
        return `RGB(${this.r}, ${this.g}, ${this.b})`;
    }
}

// adds two numbers in [0, 255], guaranteed to land in [0, 255], inspired by relativistic velocity addition meow im a cat :-3
function addcolours(c1: number, c2: number) {
    return 255*255*(c1+c2) / (255*255 + c1*c2);
}

// attenuation coeff for a light some distance away (TODO: precompute?)
function attenuate(dx: number, dy: number) {
    return 1/(0.5*(dx*dx+dy*dy)+1);
}

// returns light level from 0 to 200
function getSunlight(time: number) {
    const l = 200 * 0.5*(Math.cos(2*Math.PI * time / globalThis.MINSPERDAY / 10) + 1); // super fast for debug
    return new Colour(l*1.05, l, l);
}
//test comment please remove
export function updateLighting() {
    let lights = []; // TODO
    const sunlight = getSunlight(TIME);
    const lightrange = 8;

    // reset light level of all cells to the ambient level
    for (let cellY = -lightrange; cellY < VIEWPORT.size.y + lightrange; ++cellY) {
        for (let cellX = -lightrange; cellX < VIEWPORT.size.x + lightrange; ++cellX) {
            const cell = CELLMAP[`${VIEWPORT.Disp2Real(cellX, cellY)}`];
            if (!cell) continue;
            let perlinCloud = (perlin3d({x: cell.x / 25, y: cell.y / 25, z: TIME / 101}) + 1) * 0.5;
            cell.lightLevel = sunlight.scalarmult(perlinCloud);
        }
    }

    // find all light sources among visible(+lightrange) cells, and add their influences
    for (let cellY = -lightrange; cellY < VIEWPORT.size.y + lightrange; ++cellY) {
        for (let cellX = -lightrange; cellX < VIEWPORT.size.x + lightrange; ++cellX) {
            const cell = CELLMAP[`${VIEWPORT.Disp2Real(cellX, cellY)}`];
            if (!cell) continue;
            const lum = cell.maxLum();
            if (lum.isZero()) continue;

            // then cell contains a light
            for (let dy = -lightrange; dy <= lightrange; ++dy) {
                for (let dx = -lightrange; dx <= lightrange; ++dx) {
                    const cell2 = CELLMAP[`${cell.x+dx},${cell.y+dy}`];
                    if (!cell2) continue;
                    cell2.lightLevel = cell2.lightLevel.add(lum.scalarmult(attenuate(dx,dy)));
                }
            }
        }
    }
}
