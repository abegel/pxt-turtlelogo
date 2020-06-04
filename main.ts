enum TravelDirection {
    //% block="ahead of"
    Ahead = 2,
    //% block="behind"
    Behind = 3,
    //% block="to the left of "
    Left = 0,
    //% block="to the right of"
    Right = 1
    
}

namespace sprites {

    /**
     * Returns the arc tangent of a vector (x, y). This is an 8-bit approximation.
     * Return value is a number from 0 - 360 (Logo heading)
     * @param y y component of vector
     * @param x x component of vector
     */
    function atan2(y: number, x: number): number {
        if (y >= 0) {
            //quad14
            if (x == 0) {
                // +infinity
                return 0;
            } else if (x > 0) {
                //quad1  x > 0, y >= 0
                let r: Fx8 = lookupAtan0to90(y, x);
                return Fx.toFloat(r);
            } else {
                //quad4  x < 0, y >= 0
                let r: Fx8 = lookupAtan0to90(y, -x);
                return 360 - Fx.toFloat(r);
            }
        } else if (x == 0) {
            // -infinity
            return 180;
        } else if (x > 0) {
            //quad2
            let r: Fx8 = lookupAtan0to90(-y, x);
            return Fx.toFloat(r) + 180;
        } else {
            //quad3
            let r: Fx8 = lookupAtan0to90(-y, -x);
            return Fx.toFloat(r) + 180;
        }
    }

    const fortyfiveFx8 = 45 * 256 as any as Fx8

    function lookupAtan0to90(y: number, x: number): Fx8 {
        let swapped: boolean = false;
        if (x == y) {
            return fortyfiveFx8; // 45 degrees
        } else if (x < y) {
            let temp: number = y;
            y = x;
            x = temp;
            swapped = true;
        }
        let n: Fx8 = Fx8(y / x)
        let angle: number = lookupAtan((n as any as number) & 0xff)
        if (swapped) {
            return angle as any as Fx8;
        } else {
            return Fx.sub(Fx8(90), angle as any as Fx8);
        }
    }

    const atanTable = hex`000039007300ac00e5001e0158019101ca0103023d027602af02e80221035a039403cd0306043f047804b104e90422055b059405cd0505063e067706af06e806200758079107c907010839087108a908e108190951098909c109f809300a670a9f0ad60a0d0b440b7b0bb20be90b200c570c8d0cc40cfa0c310d670d9d0dd30d090e3f0e750eab0ee00e160f4b0f800fb50fea0f1f1054108910be10f21026115b118f11c311f7112a125e129212c512f8122c135f139213c413f7132a145c148e14c114f314241556158815b915eb151c164d167e16af16e016101741177117a117d1170118311860189018bf18ee181d194c197b19aa19d819061a351a631a911abe1aec1a1a1b471b741ba11bce1bfb1b271c541c801cac1cd81c041d301d5c1d871db21dde1d091e331e5e1e891eb31edd1e081f321f5b1f851faf1fd81f01202b2053207c20a520ce20f6201e2146216e219621be21e5210d2234225b228222a922d022f6221d23432369238f23b523db23002426244b2470249524ba24df24032528254c2570259425b825dc250026232647266a268d26b026d326f52618273a275d277f27a127c327e5270628282849286b288c28ad28ce28ee280f293029502970299029b029d029f029102a2f2a4f2a6e2a8d2aac2acb2aea2a082b272b452b642b822ba02bbe2bdc2bfa2b172c352c522c6f2c8d2caa2cc62c
    e32c002d`;

    // atan y/x for 0 through 1 with 256 entries
    // value is the Fx8 representation of the angles 0 - 45 
    // last entry is unused, but there for completeness. it's 45 degrees.
    function lookupAtan(index: number) {
        return atanTable.getNumber(NumberFormat.UInt16LE, index << 1);
    }

    //% block="record $sprite=variables_get(mySprite) heading"
    //% group="Heading"
    //% weight=99
    export function updateheading(sprite: Sprite) {
        const d = sprite.data();
        if (sprite.vy() != 0 || sprite.vx() != 0) {
            let heading: number = atan2(0 - sprite.vy(), sprite.vx());
            let magnitude: number = speed(sprite);
            let ydelta: number = (0 - sprite.vy()) / magnitude;
            let xdelta: number = (sprite.vx() / magnitude);
            d["heading"] = heading % 360;
            d["xdelta"] = xdelta;
            d["ydelta"] = ydelta;
        }
    }

    //% block="$sprite=variables_get(mySprite) heading"
    //% group="Heading"
    //% weight=100
    export function heading(sprite: Sprite) : number {
        const d = sprite.data();
        let heading: number = d["heading"];
        return heading;
    }

    export function xdelta(sprite: Sprite) : number {
        const d = sprite.data();
        let xd: number = d["xdelta"];
        return xd;
    }

    export function ydelta(sprite: Sprite) : number {
        const d = sprite.data();
        let yd: number = d["ydelta"];
        return yd;
    }

    //% block="$sprite=variables_get(mySprite) speed"
    //% group="Heading"
    //% weight=98
    export function speed(sprite: Sprite) : number {
        let magnitude: number = Math.sqrt((sprite.vx() * sprite.vx()) + (sprite.vy() * sprite.vy()));
        return magnitude;
    }

}
namespace scene {

    //% block="$sprite=variables_get(mySprite) tile location"
    //% group="Tiles"
    export function getTileLocationOfSprite(sprite: Sprite) {
        const scene = game.currentScene();
        if (!scene.tileMap) return new tiles.Location(0, 0, scene.tileMap);
        const scale = scene.tileMap.scale;
        
        const hbox = sprite._hitbox;

        const left = Fx.toIntShifted(hbox.left, scale);
        const right = Fx.toIntShifted(hbox.right, scale);
        const top = Fx.toIntShifted(hbox.top, scale);
        const bottom = Fx.toIntShifted(hbox.bottom, scale);

        return new tiles.Location(left, top, scene.tileMap);
    }

    //% block="$loc col"
    //% loc.shadow=mapgettile
    //% group="Tiles"
    export function getTileColCoordinate(loc: tiles.Location) {
        const scene = game.currentScene();
        if (!scene.tileMap) return 0;
        const scale = scene.tileMap.scale;
        return loc.x >> scale;
    }

    //% block="$loc row"
    //% loc.shadow=mapgettile
    //% group="Tiles"
    export function getTileRowCoordinate(loc: tiles.Location) {
        const scene = game.currentScene();
        if (!scene.tileMap) return 0;
        const scale = scene.tileMap.scale;
        return loc.y >> scale;
    }



    //% block="tile location $n tiles $td sprite $sprite=variables_get(mySprite)"
    //% n.defl=1
    //% group="Tiles"
    export function getCoordinateNTilesAwayFromTile(n: number, td: TravelDirection, sprite: Sprite) {
        const scene = game.currentScene();
        if (!scene.tileMap || n < 0) return new tiles.Location(0, 0, scene.tileMap);

        let round_n = Math.round(n);
               
        let loc: tiles.Location = getTileLocationOfSprite(sprite);
        const scale = scene.tileMap.scale;
        let x: number = loc.x >> scale;
        let y: number = loc.y >> scale;
        let width: number = scene.tileMap.areaWidth() >> scale;
        let height: number = scene.tileMap.areaHeight() >> scale;

        //console.log("loc.x = " + loc.x);
        //console.log("loc.y = " + loc.y);
        //console.log("x >> scale = " + x);
        //console.log("y >> scale = " + y);

        let xd = sprites.xdelta(sprite) * round_n;
        let yd = sprites.ydelta(sprite) * round_n;

        let i: number = sprites.heading(sprite);
        switch(td) {
            case TravelDirection.Ahead:
                x = x + xd;
                y = y + yd;
                break;
            case TravelDirection.Behind:
                x = x - xd;
                y = y - yd;
                break;
            case TravelDirection.Left:
                x = x + yd;
                y = y - xd;
                break;
            case TravelDirection.Right:
                x = x - yd;
                y = y + xd;
                break;
        } 

        x = Math.round(x);
        y = Math.round(y);
        
        if (x < 0) x = 0;
        if (x >= width) x = width - 1;
        if (y < 0) y = 0;
        if (y >= height) y = height - 1;

        return new tiles.Location(x, y, scene.tileMap);

        
    }

    //% block="tile at $loc is wall?"
    //% loc.shadow=mapgettile
    //% group="Tiles"
    export function isTileAWallAt(loc: tiles.Location) {
        const scene = game.currentScene();
        if (!loc || !scene.tileMap) return false;

        const scale = scene.tileMap.scale;   
        return scene.tileMap.isObstacle(loc.x >> scale, loc.y >> scale);
    }

    //% block="tile at $loc is $tile?"
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% loc.shadow=mapgettile
    //% group="Tiles"
    export function isTileAShapeAt(loc: tiles.Location, tile: Image) {
        const scene = game.currentScene();

        if (!loc || !scene.tileMap) return false;

        const scale = scene.tileMap.scale;
        let scaledLoc: tiles.Location = new tiles.Location(loc.x >> scale, loc.y >> scale, scene.tileMap);
        
        let i: Image = tiles.getTileImage(scaledLoc);
        return (i == tile);
    }


}
