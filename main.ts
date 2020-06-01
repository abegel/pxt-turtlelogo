
enum TravelDirection {
    //% block="ahead of me"
    Ahead = 2,
    //% block="behind me"
    Behind = 3,
    //% block="on my left"
    Left = 0,
    //% block="on my right"
    Right = 1
    
}

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

namespace scene {

    //% block="is $sprite=variables_get(mySprite) hitting wall $td"
    //% group="Collisions"
    //% td.defl=TravelDetection.Ahead
    export function isWallinDirectionOfTravel(sprite: Sprite, td: TravelDirection) {
        let cd: CollisionDirection = CollisionDirection.Top;
        let h: number = sprites.heading(sprite);
        switch(td) {
            case TravelDirection.Ahead:
                if ((h >= 0 && h < 45) || (h >= 315 && h < 360)) {
                    cd = CollisionDirection.Top;
                } else if (h >= 45 && h < 135) {
                    cd = CollisionDirection.Right;
                } else if (h >= 135 && h < 225) {
                    cd = CollisionDirection.Bottom;
                } else if (h >= 225 && h < 315) {
                    cd = CollisionDirection.Left;
                } 
                break;
            case TravelDirection.Behind:
                if ((h >= 0 && h < 45) || (h >= 315 && h < 360)) {
                    cd = CollisionDirection.Bottom;
                } else if (h >= 45 && h < 135) {
                    cd = CollisionDirection.Left;
                } else if (h >= 135 && h < 225) {
                    cd = CollisionDirection.Top;
                } else if (h >= 225 && h < 315) {
                    cd = CollisionDirection.Right;
                } 
                break;
            case TravelDirection.Left:
                if ((h >= 0 && h < 45) || (h >= 315 && h < 360)) {
                    cd = CollisionDirection.Left;
                } else if (h >= 45 && h < 135) {
                    cd = CollisionDirection.Top;
                } else if (h >= 135 && h < 225) {
                    cd = CollisionDirection.Right;
                } else if (h >= 225 && h < 315) {
                    cd = CollisionDirection.Bottom;
                } 
                break;
            case TravelDirection.Right:
                if ((h >= 0 && h < 45) || (h >= 315 && h < 360)) {
                    cd = CollisionDirection.Right;
                } else if (h >= 45 && h < 135) {
                    cd = CollisionDirection.Bottom;
                } else if (h >= 135 && h < 225) {
                    cd = CollisionDirection.Left;
                } else if (h >= 225 && h < 315) {
                    cd = CollisionDirection.Top;
                } 
                break;

        }
        return sprite.isHittingTile(cd);
    }

}
