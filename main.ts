namespace sprites {

    //% block="$sprite=variables_get(mySprite) heading"
    //% group="Turtle Logo"
    //% weight=100
    export function heading(sprite: Sprite) : number {
        let r: number = Math.atan2(0-sprite.vy(), sprite.vx());
        let d: number = r * 180.0 / Math.PI;
        let d2: number = 450 - d;
        return d2;
    }

    //% block="$sprite=variables_get(mySprite) speed"
    //% group="Turtle Logo"
    //% weight=98
    export function speed(sprite: Sprite) : number {
        let magnitude: number = Math.sqrt((sprite.vx() * sprite.vx()) + (sprite.vy() * sprite.vy()));
        return magnitude;
    }

    //% block="set $sprite=variables_get(mySprite) heading to $heading"
    //% group="Turtle Logo"
    //% weight=99
    export function setheading(sprite: Sprite, heading: number) {
        let d: number = heading % 360;
        let d2: number = 450 - d;
        let r: number = d2 * Math.PI / 180.0;
        let speed: number = sprites.speed(sprite);
        // if speed is too low, heading won't get set
        speed = Math.max(speed, 0.004);
        let vx: number = speed * Math.cos(r);
        let vy: number = 0.0 - (speed * Math.sin(r));
        sprite.setVelocity(vx, vy);
    }

    //% block="set $sprite=variables_get(mySprite) speed to $speed"
    //% group="Turtle Logo"
    //% weight=97
    export function setspeed(sprite: Sprite, speed: number) {
        let r: number = Math.atan2(sprite.vy(), sprite.vx());
        let vx: number = speed * Math.cos(r);
        let vy: number = speed * Math.sin(r);
        sprite.setVelocity(vx, vy);
    }

    //% block="left $sprite=variables_get(mySprite) by $delta_heading degrees"
    //% delta_heading.defl=90
    //% group="Turtle Logo"
    //% weight=90
    export function left(sprite: Sprite, delta_heading: number) {
        let h: number = sprites.heading(sprite);
        let new_h: number = (h - delta_heading) % 360;
        sprites.setheading(sprite, new_h);
    }

    //% block="right $sprite=variables_get(mySprite) by $delta_heading degrees"
    //% delta_heading.defl=90
    //% group="Turtle Logo"
    //% weight=89
    export function right(sprite: Sprite, delta_heading: number) {
        sprites.left(sprite, 0 - delta_heading);
    }


}
