namespace sprites {

//% block="$sprite=variables_get(mySprite) heading"
//% group="Turtle Logo"
export function heading(sprite: Sprite) : number {
    let r: number = Math.atan2(0-sprite.vy(), sprite.vx());
    let d: number = r * 180.0 / Math.PI;
    let d2: number = 450 - d;
    return d2;
}

//% block="$sprite=variables_get(mySprite) speed"
//% group="Turtle Logo"
export function speed(sprite: Sprite) : number {
    let magnitude: number = Math.sqrt((sprite.vx() * sprite.vx()) + (sprite.vy() * sprite.vy()));
    return magnitude;
}

//% block="set $sprite=variables_get(mySprite) heading to $heading"
//% group="Turtle Logo"
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
export function setspeed(sprite: Sprite, speed: number) {
    let r: number = Math.atan2(sprite.vy(), sprite.vx());
    let vx: number = speed * Math.cos(r);
    let vy: number = speed * Math.sin(r);
    sprite.setVelocity(vx, vy);
}

}
