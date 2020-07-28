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
namespace Math {
    //% block="is $pred"
    //% weight=97
    export function booleanToNumber(pred: boolean) {
        return (pred) ? 1 : 0
    }

    //% block="$a mod $b"
    //% weight=97
    export function mod(a: number, b: number) {
        let val: number = a % b;
        if (val < 0) {
            val += b;
        }
        return val;
    }

   //% block="tan angle $angle"
    //% group="Trigonometry"
    //% weight=99
    export function tan_degrees(angle: number) : number {
        let rad: number = angle * Math.PI / 180.0
        return Math.tan(rad);
    }


    //% block="cos angle $angle"
    //% group="Trigonometry"
    //% weight=99
    export function cos_degrees(angle: number) : number {
        let rad2: number = angle * Math.PI / 180.0
        return Math.cos(rad2);
    }

    //% block="sin angle $angle"
    //% group="Trigonometry"
    //% weight=99
    export function sin_degrees(angle: number) : number {
        let rad3: number = angle * Math.PI / 180.0
        return Math.sin(rad3);
    }

    //% block="atan y $y x $x"
    //% group="Trigonometry"
    //% weight=98
    /**
     * Returns the arc tangent of a vector (x, y). This is an 8-bit approximation.
     * Return value is a number from 0 - 360 (Logo heading)
     * @param y y component of vector
     * @param x x component of vector
     */
    export function atan2_degrees(y: number, x: number): number {
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
                let s: Fx8 = lookupAtan0to90(y, -x);
                return 360 - Fx.toFloat(s);
            }
        } else if (x == 0) {
            // -infinity
            return 180;
        } else if (x > 0) {
            //quad2
            let t: Fx8 = lookupAtan0to90(-y, x);
            return Fx.toFloat(t) + 180;
        } else {
            //quad3
            let u: Fx8 = lookupAtan0to90(-y, -x);
            return Fx.toFloat(u) + 180;
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

}
namespace sprites {

    //% block="$sprite=variables_get(mySprite) mass"
    //% group="Gravity"
    //% weight=100
    export function mass(sprite: Sprite) : number {
        const d = sprite.data();
        if (d["mass"] == undefined) { return 1 }
        let mass: number = d["mass"];
        return mass;
    }

    //% block="set $sprite=variables_get(mySprite) mass $val"
    //% group="Gravity"
    //% weight=100
    /** 
     * Set the sprite's mass in kg
     * @param val new mass; eg: 1 
     */
    export function setmass(sprite: Sprite, val: number = 1) {
        const e = sprite.data();
        if (val <= 0) {
           e["mass"] = 1;
        } else {
           e["mass"] = val;
        }
    }

    //% block="add gravity to acceleration of $sprite=variables_get(mySprite) x $x y $y object mass $massObject"
    //% group="Gravity"
    //% weight=98
    /**
     * Applies instantaneous acceleration due to gravity on a sprite from an object. The object is not affected.
     * @param sprite - the sprite that will be acted upon
     * @param massObject - the mass of the object that the sprite is being pulled to; eg: 100
     * @param x - the x position of the object
     * @param y - the y position of the object
     */
    export function applyInstant2DGravityAcceleration (sprite: Sprite, 
      x: number,
      y: number,
      massObject: number) {

        let xOffset: number = x - sprite.x;
        let yOffset: number = y - sprite.y;

        const gravitationalAcceleration = computeGravitationalEffect(mass(sprite),
            massObject,
            xOffset,
            yOffset);

        const newAcceleration = {
            ax: gravitationalAcceleration.ax + sprite.ax,
            ay: gravitationalAcceleration.ay + sprite.ay
        }

        sprite.ax = newAcceleration.ax
        sprite.ay = newAcceleration.ay

    }

    //% block="set acceleration to gravity of $sprite=variables_get(mySprite) x $x y $y object mass $massObject"
    //% group="Gravity"
    //% weight=98
    /**
     * sets instantaneous acceleration due to gravity on a sprite.
     * @param sprite - the sprite that will be acted upon
     * @param massObject - the mass of the object that the sprite is being pulled to; eg: 100
     * @param x - the x position of the object
     * @param y - the y position of the object
     */
    export function setInstant2DGravityAcceleration (sprite: Sprite, 
      x: number,
      y: number,
      massObject: number = 100) {

        let xOffset: number = x - sprite.x;
        let yOffset: number = y - sprite.y;

        const gravitationalAcceleration = computeGravitationalEffect(mass(sprite),
            massObject,
            xOffset,
            yOffset);

        sprite.ax = gravitationalAcceleration.ax
        sprite.ay = gravitationalAcceleration.ay

    }

    /**
     * computes gravity's effect on an object
     */
    const computeGravitationalEffect = (massSprite: number, 
      massObject: number, 
      xOffset: number, 
      yOffset: number) => {

        let spriteDistance: number = distance(yOffset, xOffset);

        if (spriteDistance == 0) {
            return { ax: 0, ay: 0 };
        }
        const forceOfGravity = gravitationalForce(massSprite, massObject, spriteDistance);

        // first, find the gravitational acceleration that we should have
        const gravitationalAcceleration3 = {
            ax: forceOfGravity * xOffset / spriteDistance,
            ay: forceOfGravity * yOffset / spriteDistance
        }

        return gravitationalAcceleration3;        
      }

    const distance = (yOffset: number, xOffset: number) => {
        const squaredDistance = xOffset * xOffset + yOffset * yOffset;
        return Math.sqrt(squaredDistance);
    }

    const gravitationalForce = (massOne: number, massTwo: number, radius: number) => {
        const gravitationalConstant = 6673
        if (radius == 0) {
            return 0;
        }

        return gravitationalConstant * ((massOne * massTwo) / Math.pow(radius, 2))
    }

    //% block="record $sprite=variables_get(mySprite) heading"
    //% group="Heading"
    //% weight=99
    export function updateheading(sprite: Sprite) { 
        if (sprite.vy != 0 || sprite.vx != 0) {
            let my_heading: number = Math.atan2_degrees(0 - sprite.vy, sprite.vx);
            let magnitude: number = speed(sprite);
            let ydelta: number = (0 - sprite.vy) / magnitude;
            let xdelta: number = (sprite.vx / magnitude);
            
            const d = sprite.data();
            d["heading"] = my_heading % 360;
            d["xdelta"] = xdelta;
            d["ydelta"] = ydelta;
            //console.logValue("updateheading heading", my_heading % 360);
            //console.logValue("updateheading xdelta", xdelta);
            //console.logValue("updateheading ydelta", ydelta);
        }
    }

    export function updateAllHeadings() {
        game.currentScene().allSprites.filter(s => s instanceof Sprite).map((sprite, index) => 
            updateheading(sprite as Sprite))
    }

    //% block="$sprite=variables_get(mySprite) heading"
    //% group="Heading"
    //% weight=100
    export function heading(sprite: Sprite) : number {
        const d = sprite.data();
        if (d["heading"] == undefined) { updateheading(sprite) }
        let heading: number = d["heading"];
        return heading;
    }

    export function xdelta(sprite: Sprite) : number {
        const d = sprite.data();
        if (d["xdelta"] == undefined) { updateheading(sprite) }
        let xd: number = d["xdelta"];
        return xd;
    }

    export function ydelta(sprite: Sprite) : number {
        const d = sprite.data();
        if (d["ydelta"] == undefined) { updateheading(sprite) }
        let yd: number = d["ydelta"];
        return yd;
    }

    //% block="$sprite=variables_get(mySprite) speed"
    //% group="Heading"
    //% weight=98
    export function speed(sprite: Sprite) : number {
        let magnitude: number = Math.sqrt((sprite.vx * sprite.vx) + (sprite.vy * sprite.vy));
        return magnitude;
    }



}
namespace game {

    /**
     * Update the position and velocities of sprites
     * @param body code to execute
     */
    //% group="Gameplay"
    //% block="on game update with heading"
    //% blockAllowMultiple=1
    export function onGameUpdateWithHeading(a: () => void): void {
        if (!a) return;
        const new_a = () => { 
            sprites.updateAllHeadings()
            a() 
        }
        game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY - 1, new_a);
    }
}
namespace arrays {

    //% block="choose random element from $list=variables_get(list)"
    export function choose(list: any[]) {
        if (!list || list.length == 0) {
            return 0;
        }
        return list[Math.randomRange(0, list.length - 1)];
    }

}
namespace scene {

    //% block="$sprite=variables_get(mySprite) tile location"
    //% group="Tiles"
    export function getTileLocationOfSprite(sprite: Sprite) {
        const scene = game.currentScene();
        if (!scene.tileMap) return new tiles.Location(0, 0, scene.tileMap);
        const scale = scene.tileMap.scale;

        return new tiles.Location(sprite.x >> scale, sprite.y >> scale, scene.tileMap);
 
    }

    //% block="$sprite=variables_get(mySprite) wholly within a tile?"
    //% group="Tiles"
    export function spriteContainedWithinTile(sprite: Sprite): boolean {
        const scene = game.currentScene();
        if (!scene.tileMap) return true;
        const scale = scene.tileMap.scale;
        
        const left: number = Fx.toInt(sprite._hitbox.left);
        const right: number = Fx.toInt(sprite._hitbox.right) - 1;

        /*
        if ((sprite.left >> scale) != (left >> scale) || 
            ((sprite.right-1) >> scale) != (right >> scale)) {

                console.logValue("left", sprite.left);
                console.logValue("right", sprite.right - 1);
                console.logValue("left scaled", sprite.left >> scale);
                console.logValue("right scaled", (sprite.right - 1) >> scale);
                
                console.logValue("left rounded", left);
                console.logValue("right rounded", right);
                console.logValue("left rounded scaled", left >> scale);
                console.logValue("right rounded scaled", right >> scale);
            }
        */
        if ((left >> scale) != (right >> scale)) {
            return false;
        }
        const top: number = Fx.toInt(sprite._hitbox.top);
        const bottom: number = Fx.toInt(sprite._hitbox.bottom) - 1;

        /*
        if ((sprite.top >> scale) != (top >> scale) || 
            ((sprite.bottom-1) >> scale) != (bottom >> scale)) {

                console.logValue("top", sprite.top);
                console.logValue("bottom", sprite.bottom - 1);
                console.logValue("top scaled", sprite.top >> scale);
                console.logValue("bottom scaled", (sprite.bottom - 1) >> scale);

                console.logValue("top rounded", top);
                console.logValue("bottom rounded", bottom);
                console.logValue("top rounded scaled", top >> scale);
                console.logValue("bottom rounded scaled", bottom >> scale);
        }
        */
        if ((top >> scale) != (bottom >> scale)) {
            return false;
        }
        return true;
        
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
        const scale5 = scene.tileMap.scale;
        let x: number = loc.x >> scale5;
        let y: number = loc.y >> scale5;
        let width: number = scene.tileMap.areaWidth() >> scale5;
        let height: number = scene.tileMap.areaHeight() >> scale5;

        //console.log("loc.x = " + loc.x);
        //console.log("loc.y = " + loc.y);
        //console.log("x >> scale = " + x);
        //console.log("y >> scale = " + y);

        let xdOriginal: number = sprites.xdelta(sprite);
        let ydOriginal: number = sprites.ydelta(sprite);

        //console.logValue("xdOriginal", xdOriginal);
        //console.logValue("ydOriginal", ydOriginal);

        let xd2: number = xdOriginal * round_n;   
        let yd2: number = ydOriginal * round_n;

        //console.logValue("xd", xd);
        //console.logValue("yd", yd);

        let j: number = sprites.heading(sprite);
        switch(td) {
            case TravelDirection.Ahead:
                x = x + xd2;
                y = y - yd2;
                break;
            case TravelDirection.Behind:
                x = x - xd2;
                y = y + yd2;
                break;
            case TravelDirection.Right:
                x = x + yd2;
                y = y + xd2;
                break;
            case TravelDirection.Left:
                x = x - yd2;
                y = y - xd2;
                break;
        } 

        //console.logValue("x", x);
        //console.logValue("y", y);

        x = Math.round(x);
        y = Math.round(y);
        
        if (x < 0) x = 0;
        if (x >= width) x = width - 1;
        if (y < 0) y = 0;
        if (y >= height) y = height - 1;

        //console.logValue("final x", x);
        //console.logValue("final y", y);

        return new tiles.Location(x, y, scene.tileMap);

        
    }


    //% block="tile at $loc is wall?"
    //% loc.shadow=mapgettile
    //% group="Tiles"
    export function isTileAWallAt(loc: tiles.Location) {
        const scene = game.currentScene();
        if (!scene.tileMap) return new tiles.Location(0, 0, scene.tileMap);
        const scale = scene.tileMap.scale;

        let pointX: number = (loc.x >> scale);
        let pointY: number = (loc.y >> scale);

        return scene.tileMap.isObstacle(pointX, pointY);
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
        
        let k: Image = tiles.getTileImage(scaledLoc);
        return (k == tile);
    }


}
